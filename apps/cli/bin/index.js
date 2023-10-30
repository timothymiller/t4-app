#! /usr/bin/env node
import ora from 'ora'
import chalk from 'chalk'
import { promisify } from 'util'
import { exec as execCb } from 'child_process'
import readline from 'readline'
import { promises as fs } from 'fs';
import path from 'path';

const exec = promisify(execCb)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const repositoryUrl = 'https://github.com/timothymiller/t4-app'

let [projectFolder, ...commandLineArgs] = process.argv.slice(2)

// Parse command line arguments correctly even with no projectFolder specified
if (projectFolder && projectFolder.startsWith('--')) {
  commandLineArgs.push(projectFolder)
  projectFolder = undefined
}
if (!projectFolder && commandLineArgs.length > 1) {
  commandLineArgs.every((arg) => {
    if (!arg.startsWith('--')) {
      projectFolder = arg
      return false
    }
    return true
  })
}
const useTauri = commandLineArgs.includes('--tauri')

const generateRepositoryBranch = () => {
  if (useTauri) {
    return '-b tauri --single-branch'
  }
  // Add more branch options if needed
  return ''
}

const repositoryBranch = generateRepositoryBranch()

const cloneRepository = async (folderName) => {
  const gitSpinner = ora(chalk.green.bold(`Cloning t4-app into ${folderName}`)).start()
  try {
    await exec(`git clone ${repositoryBranch} ${repositoryUrl} ${folderName}`)
    gitSpinner.succeed()
  } catch (error) {
    gitSpinner.fail()
    throw new Error(`Failed to clone repository: ${error.message}`)
  }
}

const removeUnnecessaryFiles = async (folderName) => {
  const filesToRemove = [
    `${folderName}/.git`,
    `${folderName}/apps/cli`,
    `${folderName}/apps/vscode`,
    `${folderName}/.github/workflows/cli.yml`,
    `${folderName}/.github/workflows/vscode.yml`
  ]

  try {
    await removePaths(filesToRemove);
  } catch (error) {
    throw new Error(`Failed to remove unnecessary files: ${error.message}`)
  }
}

const installDependencies = async (folderName) => {
  const installSpinner = ora(chalk.green.bold('Installing dependencies')).start()
  try {
    await exec(`cd ${folderName} && bun install`)
    installSpinner.succeed()
  } catch (error) {
    installSpinner.fail()
    throw new Error(`Failed to install dependencies: ${error.message}`)
  }
}

const generateDrizzleClient = async (folderName) => {
  const drizzleSpinner = ora(chalk.green.bold('Generating Drizzle client')).start()
  try {
    await exec(`cd ${folderName} && bun generate`)
    drizzleSpinner.succeed()
  } catch (error) {
    drizzleSpinner.fail()
    throw new Error(`Failed to generate Drizzle client: ${error.message}`)
  }
}

const setupProject = async (folderName) => {
  try {
    console.log(chalk.yellow(`
👉 Setting up a new t4 project.
This script follows the steps below to create your project:
1. Clone the t4-app repository into the specified folder.
2. Remove unnecessary files.
3. Install dependencies.
4. Generate the Drizzle client.
`))

    await cloneRepository(folderName)
    console.log(chalk.green.bold('\n✅ Repository cloned successfully.\n'))

    await removeUnnecessaryFiles(folderName)
    console.log(chalk.green.bold('✅ Unnecessary files removed.\n'))

    await installDependencies(folderName)
    console.log(chalk.green.bold('✅ Dependencies installed.\n'))

    await generateDrizzleClient(folderName)
    console.log(chalk.green.bold('✅ Drizzle client generated.\n'))

    console.log(chalk.yellow(`
💭 Remember to set up your environment variables properly:
1. Duplicate the .env.example file, rename it to .env.local, and enter your variables.
2. Duplicate /packages/api/.dev.vars.example, remove .example, and enter your Supabase JWT_VERIFICATION_KEY.
3. Configure Cloudflare Wrangler configs inside /apps/next/wrangler.toml and /packages/api/wrangler.toml to match your deployment environment.
`))

    console.log(chalk.green.bold(`
🚀 Successfully created t4 project!
Make sure you have a Supabase account and have created a new project.
After filling out your .env file, run 'bun migrate:local' to create your database tables.
To start the API and web development servers, run 'bun api' and 'bun web' in separate terminal tabs.
`))
  } catch (error) {
    console.error(chalk.red.bold(`🚫 Error: ${error.message}`))
  } finally {
    rl.close()
  }
}

const logo = `
 _________  __   __        ________   ______   ______    
/________/\\/__/\\/__/\\     /_______/\\ /_____/\\ /_____/\\   
\\__.::.__\\/\\  \\ \\: \\ \\__  \\::: _  \\ \\\\:::_ \\ \\\\:::_ \\ \\  
   \\::\\ \\   \\::\\_\\::\\/_/\\  \\::(_)  \\ \\\\:(_) \\ \\\\:(_) \\ \\ 
    \\::\\ \\   \\_:::   __\\/   \\:: __  \\ \\\\: ___\\/ \\: ___\\/ 
     \\::\\ \\       \\::\\ \\     \\:.\\ \\  \\ \\\\ \\ \\    \\ \\ \\   
      \\__\\/        \\__\\/      \\__\\/\\__\\/ \\_\\/     \\_\\/`

console.log(chalk.green.bold(logo))
console.log(chalk.magentaBright.bold('\n"Type-Safe, Full-Stack Starter Kit for React Native + Web"'))
console.log(chalk.magentaBright.bold('      ft. Tamagui + TypeScript + tRPC + Turborepo'))

if (repositoryBranch) {
  console.log(chalk.yellow.bold(`\n⚠  Cloning ${repositoryBranch.replace('-b', '').replace('--single-branch', '').trim()} branch.`))
}

if (!projectFolder) {
  console.log(chalk.green.bold('\nEnter the name of the project:'))

  try {
    const folderName = await promptQuestion('> ')
    if (!folderName || folderName.includes(' ')) {
      console.log(chalk.red.bold('🚫 Please enter a valid folder name!'))
    } else {
      console.log(' ')
      setupProject(folderName)
    }
  } catch (error) {
    console.error(chalk.red.bold(`🚫 Error: ${error.message}`))
  }
} else {
  setupProject(projectFolder)
}

function promptQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

const removePaths = async (paths) => {
  try {
    for (const pathToRemove of paths) {
      const stats = await fs.stat(pathToRemove);

      if (stats.isDirectory()) {
        await removeFolder(pathToRemove);
      } else {
        await fs.unlink(pathToRemove);
      }

      console.log(`Removed: ${pathToRemove}`);
    }

    console.log('All paths removed successfully!\n');
  } catch (error) {
    console.error('Error removing paths:', error);
  }
};

const removeFolder = async (folderPath) => {
  const folderContents = await fs.readdir(folderPath);

  for (const content of folderContents) {
    const contentPath = path.join(folderPath, content);
    const stats = await fs.stat(contentPath);

    if (stats.isDirectory()) {
      await removeFolder(contentPath);
    } else {
      await fs.unlink(contentPath);
    }
  }

  await fs.rmdir(folderPath);
};
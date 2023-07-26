#! /usr/bin/env node
import ora from 'ora'
import chalk from 'chalk'
import { promisify } from 'util'
import { exec as execCb } from 'child_process'
import readline from 'readline'
import { rimraf } from 'rimraf'

const exec = promisify(execCb)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const repositoryUrl = 'https://github.com/timothymiller/t4-app'

const [projectFolder, ...commandLineArgs] = process.argv.slice(2)
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
    `${folderName}/apps/docs`,
    `${folderName}/apps/vscode`,
    `${folderName}/.github/workflows/cli.yml`,
    `${folderName}/.github/workflows/docs.yml`,
    `${folderName}/.github/workflows/vscode.yml`
  ]

  try {
    await Promise.all(filesToRemove.map(promisifiedRimraf))
  } catch (error) {
    throw new Error(`Failed to remove unnecessary files: ${error.message}`)
  }
}

const installDependencies = async () => {
  const installSpinner = ora(chalk.green.bold('Installing dependencies')).start()
  try {
    await exec('pnpm install')
    installSpinner.succeed()
  } catch (error) {
    installSpinner.fail()
    throw new Error(`Failed to install dependencies: ${error.message}`)
  }
}

const generateDrizzleClient = async () => {
  const drizzleSpinner = ora(chalk.green.bold('Generating Drizzle client')).start()
  try {
    await exec('pnpm generate')
    drizzleSpinner.succeed()
  } catch (error) {
    drizzleSpinner.fail()
    throw new Error(`Failed to generate Drizzle client: ${error.message}`)
  }
}

const setupProject = async (folderName) => {
  try {
    console.log(chalk.yellow(`
âš™ï¸ Setting up a new t4 project.
Follow the steps below to create your project:
1. Cloning the t4-app repository into the specified folder.
2. Removing unnecessary files.
3. Installing dependencies.
4. Generating the Drizzle client.
`))

    await cloneRepository(folderName)
    console.log(chalk.green.bold('\nâœ”ï¸ Repository cloned successfully.\n'))

    await removeUnnecessaryFiles(folderName)
    console.log(chalk.green.bold('âœ”ï¸ Unnecessary files removed.\n'))

    await installDependencies()
    console.log(chalk.green.bold('âœ”ï¸ Dependencies installed.\n'))

    await generateDrizzleClient()
    console.log(chalk.green.bold('âœ”ï¸ Drizzle client generated.\n'))

    console.log(chalk.yellow(`
ðŸš§ Remember to set up your environment variables properly:
1. Duplicate the .env.example file, rename it to .env.local, and enter your variables.
2. Duplicate /packages/api/.dev.vars.example, remove .example, and enter your Supabase JWT_VERIFICATION_KEY.
3. Configure Cloudflare Wrangler configs inside /apps/next/wrangler.toml and /packages/api/wrangler.toml to match your deployment environment.
`))

    console.log(chalk.green.bold(`
ðŸš€ Successfully created t4 project!
Make sure you have a Supabase account and have created a new project.
After filling out your .env file, run 'pnpm migrate:local' to create your database tables.
To start the API and web development servers, run 'pnpm api' and 'pnpm web' in separate terminal tabs.
`))
  } catch (error) {
    console.error(chalk.red.bold(`â›”ï¸ Error: ${error.message}`))
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
      \\__\\/        \\__\\/      \\__\\/\\__\\/ \\_\\/     \\`

console.log(chalk.green.bold(logo))
console.log(chalk.magentaBright.bold('"Type-Safe, Full-Stack Starter Kit for React Native + Web" ðŸ’ª'))
console.log(chalk.magentaBright.bold('ft. Tamagui + TypeScript + tRPC + Turborepo'))

if (!projectFolder) {
  console.log(chalk.green.bold('Enter the name of the project:'))

  try {
    const folderName = await promptQuestion('> ')
    if (!folderName || folderName.includes(' ')) {
      console.log(chalk.red.bold('â›”ï¸ Please enter a valid folder name!'))
    } else {
      console.log(' ')
      setupProject(folderName)
    }
  } catch (error) {
    console.error(chalk.red.bold(`â›”ï¸ Error: ${error.message}`))
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

function promisifiedRimraf(path) {
  return new Promise((resolve, reject) => {
    rimraf(path, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

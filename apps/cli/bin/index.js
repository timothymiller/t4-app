#! /usr/bin/env node
import ora from 'ora'
import chalk from 'chalk'
import { exec } from 'child_process'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const repoUrl = 'https://github.com/timothymiller/t4-app'

const args = process.argv.slice(2)
const folderArg = args.filter((arg) => !arg.includes('--'))[0]

const withTauri = args.includes('--tauri')
let repoBranch = ''
if (withTauri) {
  repoBranch = '-b tauri --single-branch'
  console.log(
    chalk.green.bold(
      '🚀 Setting up with Tauri!'
    )
  )
}

const setup = (folderName) => {
  const gitSpinner = ora(chalk.green.bold(`Cloning t4-app into ${folderName}`)).start()

  exec(`git clone ${repoBranch} ${repoUrl} ${folderName}`, (gitErr) => {
    if (gitErr) {
      gitSpinner.fail()
      console.error(chalk.red.bold(`Failed to clone repository: ${gitErr.message}`))
      return
    }


    gitSpinner.succeed()




    exec(

      `rm -rf ${folderName}/.git && rm -rf ${folderName}/apps/cli && rm -rf ${folderName}/apps/docs && rm -rf ${folderName}/apps/vscode && rm -f ${folderName}/.github/workflows/cli.yml && rm -f ${folderName}/.github/workflows/docs.yml && rm -f ${folderName}/.github/workflows/vscode.yml`,

      (rmErr) => {

        if (rmErr) {

          console.error(chalk.red.bold(`Failed to remove unnecessary files: ${rmErr.message}`))
          return
        }

        const installSpinner = ora(chalk.green.bold(`Installing dependencies`)).start()

        exec(`pnpm install`, (installErr) => {
          if (installErr) {
            installSpinner.fail()
            console.error(chalk.red.bold(`Failed to install dependencies: ${installErr.message}`))
            return
          }

          installSpinner.succeed()

          const drizzleSpinner = ora(chalk.green.bold(`Generating Drizzle client`)).start()

          exec(`pnpm generate`, (drizzleErr) => {
            if (drizzleErr) {
              drizzleSpinner.fail()
              console.error(
                chalk.red.bold(`Failed to generate Drizzle client: ${drizzleErr.message}`)
              )
              return
            }

            drizzleSpinner.succeed()

            console.log(
              chalk.yellow(
                `\n🚧 Remember to set up your environment variables properly by:\n1. Duplicating the .env.example file, renaming it to .env.local, and entering your variables.\n2. Duplicating /packages/api/.dev.vars.example, removing .example, and entering your Supabase JWT_VERIFICATION_KEY.\n3. Configure Cloudflare Wrangler configs inside /apps/next/wrangler.toml and /packages/api/wrangler.toml to match your deployment environment.`
              )
            )

            console.log(
              chalk.green.bold(
                "🚀 Successfully created t4 project! Make sure you have a Supabase account and have created a new project. After having filled out your .env, run 'pnpm migrate:local' to create your database tables. Run 'pnpm api' and 'pnpm web' in separate terminal tabs to start the api and web development servers."
              )
            )

            rl.close()
          })
        })
      }
    )
  })
}

const logo =
  ' _________  __   __        ________   ______   ______    \n/________/\\/__/\\/__/\\     /_______/\\ /_____/\\ /_____/\\   \n\\__.::.__\\/\\  \\ \\: \\ \\__  \\::: _  \\ \\\\:::_ \\ \\\\:::_ \\ \\  \n   \\::\\ \\   \\::\\_\\::\\/_/\\  \\::(_)  \\ \\\\:(_) \\ \\\\:(_) \\ \\ \n    \\::\\ \\   \\_:::   __\\/   \\:: __  \\ \\\\: ___\\/ \\: ___\\/ \n     \\::\\ \\       \\::\\ \\     \\:.\\ \\  \\ \\\\ \\ \\    \\ \\ \\   \n      \\__\\/        \\__\\/      \\__\\/\\__\\/ \\_\\/     \\_\\/   \n                                                         '

console.log(chalk.green.bold(logo))

console.log(
  chalk.magentaBright.bold('"Type-Safe, Full-Stack Starter Kit for React Native + Web" 💪')
)
console.log(chalk.magentaBright.bold('ft. Tamagui + TypeScript + tRPC + Turborepo'))

if (!folderArg) {
  console.log(chalk.green.bold('Enter the name of the project:'))

  rl.question('> ', (folderName) => {
    if (folderName === '' || folderName.includes(' ')) {
      console.log(chalk.red.bold('Please enter a valid folder name!'))
    } else {
      console.log(' ')
      setup(folderName)
    }
    rl.close()
  })
} else {
  setup(folderArg)

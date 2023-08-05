import { TextEncoder } from 'util'
import * as vscode from 'vscode'
import * as path from 'path'

// Returns the active workspace folder (a.k.a the root of the monorepo)
function getActiveWorkspaceFolder() {
  const workspaceFolder = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0]
    : undefined
  if (!workspaceFolder) {
    vscode.window.showInformationMessage(
      'No workspace folder is open. Please open a workspace folder and try again.'
    )
    return
  }
  return workspaceFolder
}

// Handles errors for the input boxes
function isInputError(input: string | undefined, inputName: string) {
  if (!input || input.includes(' ')) {
    vscode.window.showInformationMessage(`Enter a valid ${inputName} name. You entered: ${input}`)
    return true
  }
  return false
}

// Inserts the new router import into the router file
async function insertRouterImport(workspaceFolder: vscode.WorkspaceFolder, routeName: string) {
  const routerFileUri = vscode.Uri.file(
    path.join(workspaceFolder.uri.fsPath, 'packages', 'api', 'src', 'router.ts')
  )
  const routerFile = await vscode.workspace.openTextDocument(routerFileUri)
  const RouterContents = routerFile.getText()

  const newImport = `import { ${routeName}Router } from "./${routeName}";\n`
  const lastImportIndex = RouterContents.lastIndexOf('import')
  const newRoute = `  ${routeName}: ${routeName}Router,\n`
  const closingRouterObject = RouterContents.indexOf('});')

  // Append the new import and route to the router file
  const newRouterContents =
    RouterContents.substring(0, lastImportIndex) +
    newImport +
    RouterContents.substring(lastImportIndex, closingRouterObject) +
    newRoute +
    RouterContents.substring(closingRouterObject)

  // Write the new contents to the router file
  const newRouterFileData = new TextEncoder().encode(newRouterContents)
  vscode.workspace.fs.writeFile(routerFileUri, newRouterFileData)
}

export function activate(context: vscode.ExtensionContext) {
  // The command for creating a new screen
  const disposableScreen = vscode.commands.registerCommand('t4-app-tools.newScreen', async () => {
    // Ask for the name of the new screen
    const screenName = await vscode.window.showInputBox({
      placeHolder: 'NewScreen',
      prompt: 'Enter the name of the new screen',
    })
    if (!screenName || isInputError(screenName, 'screen')) return

    // Ask if the screen is a dynamic route
    const isDynamicRoute = await vscode.window
      .showQuickPick(['Static Route', 'Dynamic Route'], {
        placeHolder: 'What type of route does this screen depend on?',
      })
      .then((result) => result === 'Dynamic Route')

    // If so, ask for the name of the dynamic route parameter
    let parameterName: string | undefined = undefined
    if (isDynamicRoute) {
      parameterName = await vscode.window.showInputBox({
        placeHolder: 'id',
        prompt: 'Enter the name of the dynamic route parameter',
      })
      if (isInputError(parameterName, 'parameter')) return
    }

    const workspaceFolder = getActiveWorkspaceFolder()
    if (!workspaceFolder) return

    // Create the new features screen folder
    const folderUri = vscode.Uri.file(
      path.join(workspaceFolder.uri.fsPath, 'packages', 'app', 'features', screenName.toLowerCase())
    )
    vscode.workspace.fs.createDirectory(folderUri)

    // Create the new features screen file
    const featuresFileUri = vscode.Uri.file(path.join(folderUri.fsPath, 'screen.tsx'))
    let screenFileData = new TextEncoder().encode(
      `import { Paragraph, YStack } from "@t4/ui";\nimport React from "react";\n\nexport function ${
        screenName + 'Screen'
      }() {\n  return (\n    <YStack f={1} jc="center" ai="center" space>\n      <Paragraph ta="center" fow="800">\n        ${screenName.toLowerCase()}\n      </Paragraph>\n    </YStack>\n  );\n} `
    )
    if (isDynamicRoute) {
      screenFileData = new TextEncoder().encode(
        `import { Paragraph, YStack } from "@t4/ui";\nimport React from "react";\nimport { createParam } from "solito";\n\nconst { useParam } = createParam<{ ${parameterName!.toLowerCase()}: string }>()\n\nexport function ${
          screenName + 'Screen'
        }() {\n  const [${parameterName!.toLowerCase()}] = useParam('${parameterName!.toLowerCase()}')\n\n  return (\n    <YStack f={1} jc="center" ai="center" space>\n      <Paragraph ta="center" fow="800">\n        {\`${parameterName!.toLowerCase()}: \${${parameterName!.toLowerCase()}}\`}\n      </Paragraph>\n    </YStack>\n  );\n} `
      )
    }
    await vscode.workspace.fs.writeFile(featuresFileUri, screenFileData)

    // Setup the correct path for the new Expo screen
    let expoFolderUri = vscode.Uri.file(
      path.join(workspaceFolder.uri.fsPath, 'apps', 'expo', 'app')
    )
    let expoFileUri = vscode.Uri.file(
      path.join(expoFolderUri.fsPath, `${screenName.toLowerCase()}.tsx`)
    )

    if (isDynamicRoute) {
      expoFolderUri = vscode.Uri.file(
        path.join(workspaceFolder.uri.fsPath, 'apps', 'expo', 'app', screenName.toLowerCase())
      )

      expoFileUri = vscode.Uri.file(
        path.join(expoFolderUri.fsPath, `[${parameterName!.toLowerCase()}].tsx`)
      )
    }

    // Create the new Expo screen folder
    vscode.workspace.fs.createDirectory(expoFolderUri)

    // Create the new Expo screen file
    const expoScreenFileData = new TextEncoder().encode(
      `import { ${
        screenName + 'Screen'
      } } from "app/features/${screenName.toLowerCase()}/screen";\n\nexport default function () {\n    return <${
        screenName + 'Screen'
      }/>\n}\n`
    )
    await vscode.workspace.fs.writeFile(expoFileUri, expoScreenFileData)

    // Setup the correct path for the new Next screen
    const nextFolderUri = vscode.Uri.file(
      path.join(workspaceFolder.uri.fsPath, 'apps', 'next', 'pages', screenName.toLowerCase())
    )
    let nextFileUri = vscode.Uri.file(path.join(nextFolderUri.fsPath, 'index.tsx'))

    if (isDynamicRoute) {
      nextFileUri = vscode.Uri.file(
        path.join(nextFolderUri.fsPath, `[${parameterName!.toLowerCase()}].tsx`)
      )
    }

    // Create the new Next screen folder
    vscode.workspace.fs.createDirectory(nextFolderUri)

    // Create the new Next screen file
    const nextFileData = new TextEncoder().encode(
      `import { ${
        screenName + 'Screen'
      } } from 'app/features/${screenName.toLowerCase()}/screen'\n\nexport default ${
        screenName + 'Screen'
      }\n`
    )
    await vscode.workspace.fs.writeFile(nextFileUri, nextFileData)

    // Open the features/{screenName}/screen.tsx file
    const newScreenDocument = await vscode.workspace.openTextDocument(featuresFileUri)
    vscode.window.showTextDocument(newScreenDocument)
  })

  // The command for creating a new component
  const disposableComponent = vscode.commands.registerCommand(
    't4-app-tools.newComponent',
    async () => {
      const componentName = await vscode.window.showInputBox({
        placeHolder: 'NewComponent',
        prompt: 'Enter the name of the new component',
      })
      if (isInputError(componentName, 'component')) return

      const workspaceFolder = getActiveWorkspaceFolder()
      if (!workspaceFolder) return

      // Create the new component file
      const newFileUri = vscode.Uri.file(
        path.join(workspaceFolder.uri.fsPath, 'packages', 'ui', 'src', componentName + '.tsx')
      )
      const componentFileData = new TextEncoder().encode(
        `import { Paragraph, YStack } from "@t4/ui";\nimport React from "react";\n\nexport function ${componentName}() {\n  return (\n    <YStack f={1} jc="center" ai="center" space>\n      <Paragraph ta="center" fow="800">\n        ${componentName}\n      </Paragraph>\n    </YStack>\n  );\n} `
      )
      await vscode.workspace.fs.writeFile(newFileUri, componentFileData)

      // Open the ui/src/{componentName}.tsx file
      const newComponentDocument = await vscode.workspace.openTextDocument(newFileUri)
      vscode.window.showTextDocument(newComponentDocument)
    }
  )

  // The command for creating a new route
  const disposableRoute = vscode.commands.registerCommand('t4-app-tools.newRoute', async () => {
    const routeName = await vscode.window.showInputBox({
      placeHolder: 'newRoute',
      prompt: 'Enter the name of the new route',
    })
    if (isInputError(routeName, 'route')) return

    const workspaceFolder = getActiveWorkspaceFolder()
    if (!workspaceFolder) return

    // Create the new route file
    const newFileUri = vscode.Uri.file(
      path.join(workspaceFolder.uri.fsPath, 'packages', 'api', 'src', 'routes', routeName + '.ts')
    )
    const routeFileData = new TextEncoder().encode(
      `import { protectedProcedure, publicProcedure, router } from "../trpc";\n\nexport const ${routeName}Router = router({\n\n});\n`
    )
    await vscode.workspace.fs.writeFile(newFileUri, routeFileData)

    // Insert the new route import in the api/src/router.ts file
    await insertRouterImport(workspaceFolder, routeName)

    // Open the routes/{routeName}.tsx file
    const newRouteDocument = await vscode.workspace.openTextDocument(newFileUri)
    vscode.window.showTextDocument(newRouteDocument)
  })

  context.subscriptions.push(disposableScreen)
  context.subscriptions.push(disposableComponent)
  context.subscriptions.push(disposableRoute)
}

export function deactivate() {}

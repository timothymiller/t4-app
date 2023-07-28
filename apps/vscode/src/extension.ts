import { TextEncoder } from 'util'
import * as vscode from 'vscode'
import * as path from 'path'

export function activate(context: vscode.ExtensionContext) {
  const disposableScreen = vscode.commands.registerCommand('t4-app-tools.newScreen', async () => {
    const screenName = await vscode.window.showInputBox({
      placeHolder: 'NewScreen',
      prompt: 'Enter the name of the new screen',
    })

    // Check if the user input is not empty
    if (!screenName || screenName.includes(' ')) {
      vscode.window.showInformationMessage(`Enter a valid screen name. You entered: ${screenName}`)
      return
    }

    const isStaticRoute = await vscode.window
      .showQuickPick(['Static Route', 'Dynamic Route'], {
        placeHolder: 'What type of route does this screen depend on?',
      })
      .then((result) => result === 'Static Route')

    let parameterName: string | undefined = undefined
    if (!isStaticRoute) {
      parameterName = await vscode.window.showInputBox({
        placeHolder: 'id',
        prompt: 'Enter the name of the dynamic route parameter',
      })

      // Check if the user input is not empty
      if (!parameterName || parameterName.includes(' ')) {
        vscode.window.showInformationMessage(
          `Enter a valid parameter name. You entered: ${parameterName}`
        )
        return
      }
    }

    // Get the active workspace folder
    const workspaceFolder = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0]
      : undefined
    if (!workspaceFolder) {
      vscode.window.showInformationMessage(
        'No workspace folder is open. Please open a workspace folder and try again.'
      )
      return
    }

    const folderUri = vscode.Uri.file(
      path.join(workspaceFolder.uri.fsPath, 'packages', 'app', 'features', screenName.toLowerCase())
    )
    const fileUri = vscode.Uri.file(path.join(folderUri.fsPath, 'screen.tsx'))

    // Create the new screen folder
    vscode.workspace.fs.createDirectory(folderUri)

    // Create the new screen file
    let screenFileData = new TextEncoder().encode(
      `import { Paragraph, YStack } from "@my/ui";\nimport React from "react";\n\nexport function ${
        screenName + 'Screen'
      }() {\n  return (\n    <YStack f={1} jc="center" ai="center" space>\n      <Paragraph ta="center" fow="800">\n        ${screenName.toLowerCase()}\n      </Paragraph>\n    </YStack>\n  );\n} `
    )
    if (!isStaticRoute) {
      screenFileData = new TextEncoder().encode(
        `import { Paragraph, YStack } from "@my/ui";\nimport React from "react";\nimport { createParam } from "solito";\n\nconst { useParam } = createParam<{ ${parameterName!.toLowerCase()}: string }>()\n\nexport function ${
          screenName + 'Screen'
        }() {\n  const [${parameterName!.toLowerCase()}] = useParam('${parameterName!.toLowerCase()}')\n\n  return (\n    <YStack f={1} jc="center" ai="center" space>\n      <Paragraph ta="center" fow="800">\n        {\`${parameterName!.toLowerCase()}: \${${parameterName!.toLowerCase()}}\`}\n      </Paragraph>\n    </YStack>\n  );\n} `
      )
    }
    await vscode.workspace.fs.writeFile(fileUri, screenFileData)

    let expoFolderUri = vscode.Uri.file(
      path.join(workspaceFolder.uri.fsPath, 'apps', 'expo', 'app')
    )
    let expoFileUri = vscode.Uri.file(
      path.join(expoFolderUri.fsPath, `${screenName.toLowerCase()}.tsx`)
    )

    if (!isStaticRoute) {
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

    // Same for apps/next/pages
    const nextFolderUri = vscode.Uri.file(
      path.join(workspaceFolder.uri.fsPath, 'apps', 'next', 'pages', screenName.toLowerCase())
    )
    let nextFileUri = vscode.Uri.file(path.join(nextFolderUri.fsPath, 'index.tsx'))

    if (!isStaticRoute) {
      nextFileUri = vscode.Uri.file(
        path.join(nextFolderUri.fsPath, `[${parameterName!.toLowerCase()}].tsx`)
      )
    }

    // Create the new next folder
    vscode.workspace.fs.createDirectory(nextFolderUri)

    // Create the new next file
    const nextFileData = new TextEncoder().encode(
      `import { ${
        screenName + 'Screen'
      } } from 'app/features/${screenName.toLowerCase()}/screen'\n\nexport default ${
        screenName + 'Screen'
      }\n`
    )
    await vscode.workspace.fs.writeFile(nextFileUri, nextFileData)

    // Open the screen.tsx file
    const newScreenDocument = await vscode.workspace.openTextDocument(fileUri)

    // Show it in the editor
    vscode.window.showTextDocument(newScreenDocument)
  })

  const disposableComponent = vscode.commands.registerCommand(
    't4-app-tools.newComponent',
    async () => {
      const componentName = await vscode.window.showInputBox({
        placeHolder: 'NewComponent',
        prompt: 'Enter the name of the new component',
      })
      // Check if the user input is not empty
      if (!componentName || componentName.includes(' ')) {
        // Do something with the user input
        vscode.window.showInformationMessage(
          `Enter a valid component name. You entered: ${componentName}`
        )
        return
      }

      // Get the active workspace folder
      const workspaceFolder = vscode.workspace.workspaceFolders
        ? vscode.workspace.workspaceFolders[0]
        : undefined
      if (!workspaceFolder) {
        vscode.window.showInformationMessage(
          'No workspace folder is open. Please open a workspace folder and try again.'
        )
        return
      }

      const newFileUri = vscode.Uri.file(
        path.join(workspaceFolder.uri.fsPath, 'packages', 'ui', 'src', componentName + '.tsx')
      )

      // Create the new component file
      const componentFileData = new TextEncoder().encode(
        `import { Paragraph, YStack } from "@my/ui";\nimport React from "react";\n\nexport function ${componentName}() {\n  return (\n    <YStack f={1} jc="center" ai="center" space>\n      <Paragraph ta="center" fow="800">\n        ${componentName}\n      </Paragraph>\n    </YStack>\n  );\n} `
      )
      await vscode.workspace.fs.writeFile(newFileUri, componentFileData)

      // Open the {componentName}.tsx file
      const newComponentDocument = await vscode.workspace.openTextDocument(newFileUri)

      // Show it in the editor
      vscode.window.showTextDocument(newComponentDocument)
    }
  )

  const disposableRoute = vscode.commands.registerCommand('t4-app-tools.newRoute', async () => {
    const routeName = await vscode.window.showInputBox({
      placeHolder: 'newRoute',
      prompt: 'Enter the name of the new route',
    })
    // Check if the user input is not empty
    if (!routeName || routeName.includes(' ')) {
      // Do something with the user input
      vscode.window.showInformationMessage(`Enter a valid route name. You entered: ${routeName}`)
      return
    }

    // Get the active workspace folder
    const workspaceFolder = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0]
      : undefined
    if (!workspaceFolder) {
      vscode.window.showInformationMessage(
        'No workspace folder is open. Please open a workspace folder and try again.'
      )
      return
    }

    const newFileUri = vscode.Uri.file(
      path.join(workspaceFolder.uri.fsPath, 'packages', 'api', 'src', 'routes', routeName + '.ts')
    )

    // Create the new route file
    const routeFileData = new TextEncoder().encode(
      `import { protectedProcedure, publicProcedure, router } from "../trpc";\n\nexport const ${routeName}Router = router({\n\n});\n`
    )
    await vscode.workspace.fs.writeFile(newFileUri, routeFileData)

    const routerIndexFileUri = vscode.Uri.file(
      path.join(workspaceFolder.uri.fsPath, 'packages', 'api', 'src', 'router.ts')
    )

    const navigationProviderIndex = await vscode.workspace.openTextDocument(routerIndexFileUri)
    const RouterContents = navigationProviderIndex.getText()

    const newImport = `import { ${routeName}Router } from "./${routeName}";\n`
    const lastImportIndex = RouterContents.lastIndexOf('import')
    const newRoute = `  ${routeName}: ${routeName}Router,\n`
    const closingRouterObject = RouterContents.indexOf('});')

    const newRouterContents =
      RouterContents.substring(0, lastImportIndex) +
      newImport +
      RouterContents.substring(lastImportIndex, closingRouterObject) +
      newRoute +
      RouterContents.substring(closingRouterObject)

    // Write the new contents to the navigation file
    const newRouterFileData = new TextEncoder().encode(newRouterContents)
    vscode.workspace.fs.writeFile(routerIndexFileUri, newRouterFileData)

    // Open the {componentName}.tsx file
    const newRouteDocument = await vscode.workspace.openTextDocument(newFileUri)

    // Show it in the editor
    vscode.window.showTextDocument(newRouteDocument)
  })

  context.subscriptions.push(disposableScreen)
  context.subscriptions.push(disposableComponent)
  context.subscriptions.push(disposableRoute)
}

// this method is called when your extension is deactivated
export function deactivate() {}

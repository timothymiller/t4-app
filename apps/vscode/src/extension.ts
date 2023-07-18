import { TextEncoder } from 'util';
import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Validates user input by checking if it is empty or contains spaces.
 * @param prompt The prompt message for the input box.
 * @param placeholder The placeholder text for the input box.
 * @returns The validated user input or undefined if the input is invalid.
 */
async function validateInput(prompt: string, placeholder: string): Promise<string | undefined> {
  const input = await vscode.window.showInputBox({ prompt, placeHolder: placeholder });
  if (!input || input.includes(' ')) {
    // Show an error message if the input is invalid
    vscode.window.showErrorMessage(`Enter a valid input. You entered: ${input}`);
    return undefined;
  }
  return input;
}

/**
 * Helper function to create a file and open it in the editor.
 * @param uri The URI of the file to create.
 * @param data The content of the file as a Uint8Array.
 */
async function createFile(uri: vscode.Uri, data: Uint8Array): Promise<void> {
  await vscode.workspace.fs.writeFile(uri, data);
  const document = await vscode.workspace.openTextDocument(uri);
  vscode.window.showTextDocument(document);
}

/**
 * Retrieves the first workspace folder if available.
 * @returns The first workspace folder or undefined if no workspace folder is open.
 */
function getWorkspaceFolder(): vscode.WorkspaceFolder | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0];
  }
  return undefined;
}

/**
 * Creates a new screen.
 * @param screenName The name of the new screen.
 * @param isStaticRoute Specifies if the screen depends on a static route.
 * @param parameterName The name of the dynamic route parameter (optional).
 */
async function createScreen(screenName: string, isStaticRoute: boolean, parameterName?: string): Promise<void> {
  const workspaceFolder = getWorkspaceFolder();
  if (!workspaceFolder) {
    // Show an error message if no workspace folder is open
    vscode.window.showErrorMessage('No workspace folder is open. Please open a workspace folder and try again.');
    return;
  }

  const screenFolderUri = vscode.Uri.joinPath(workspaceFolder.uri, 'packages', 'app', 'features', screenName.toLowerCase());
  const screenFileUri = vscode.Uri.joinPath(screenFolderUri, 'screen.tsx');

  // Create the new screen folder
  await vscode.workspace.fs.createDirectory(screenFolderUri);

  // Generate the screen file content based on the route type
  let screenFileData: Uint8Array;
  if (isStaticRoute) {
    screenFileData = new TextEncoder().encode(`import { Paragraph, YStack } from "@my/ui";
import React from "react";

export function ${screenName}Screen() {
  return (
    <YStack f={1} jc="center" ai="center" space>
      <Paragraph ta="center" fow="800">
        ${screenName.toLowerCase()}
      </Paragraph>
    </YStack>
  );
}`);
  } else {
    screenFileData = new TextEncoder().encode(`import { Paragraph, YStack } from "@my/ui";
import React from "react";
import { createParam } from "solito";

const { useParam } = createParam<{ ${parameterName!.toLowerCase()}: string }>();

export function ${screenName}Screen() {
  const [${parameterName!.toLowerCase()}] = useParam('${parameterName!.toLowerCase()}');

  return (
    <YStack f={1} jc="center" ai="center" space>
      <Paragraph ta="center" fow="800">
        {${parameterName!.toLowerCase()}: ${parameterName!.toLowerCase()}}
      </Paragraph>
    </YStack>
  );
}`);
  }

  // Create the new screen file
  await createFile(screenFileUri, screenFileData);
}

/**
 * Creates a new component.
 * @param componentName The name of the new component.
 */
async function createComponent(componentName: string): Promise<void> {
  const workspaceFolder = getWorkspaceFolder();
  if (!workspaceFolder) {
    // Show an error message if no workspace folder is open
    vscode.window.showErrorMessage('No workspace folder is open. Please open a workspace folder and try again.');
    return;
  }

  const newFileUri = vscode.Uri.joinPath(workspaceFolder.uri, 'packages', 'ui', 'src', `${componentName}.tsx`);

  // Generate the component file content
  const componentFileData = new TextEncoder().encode(`import { Paragraph, YStack } from "@my/ui";
import React from "react";

export function ${componentName}() {
  return (
    <YStack f={1} jc="center" ai="center" space>
      <Paragraph ta="center" fow="800">
        ${componentName}
      </Paragraph>
    </YStack>
  );
}`);

  // Create the new component file
  await createFile(newFileUri, componentFileData);
}

/**
 * Creates a new route.
 * @param routeName The name of the new route.
 */
async function createRoute(routeName: string): Promise<void> {
  const workspaceFolder = getWorkspaceFolder();
  if (!workspaceFolder) {
    // Show an error message if no workspace folder is open
    vscode.window.showErrorMessage('No workspace folder is open. Please open a workspace folder and try again.');
    return;
  }

  const newFileUri = vscode.Uri.joinPath(workspaceFolder.uri, 'packages', 'api', 'src', 'routes', `${routeName}.ts`);

  // Generate the route file content
  const routeFileData = new TextEncoder().encode(`import { protectedProcedure, publicProcedure, router } from "../trpc";

export const ${routeName}Router = router({

});`);

  // Create the new route file
  await vscode.workspace.fs.writeFile(newFileUri, routeFileData);

  const routerIndexFileUri = vscode.Uri.joinPath(workspaceFolder.uri, 'packages', 'api', 'src', 'router.ts');
  const routerIndexDocument = await vscode.workspace.openTextDocument(routerIndexFileUri);
  const routerIndexContents = routerIndexDocument.getText();

  const newImport = `import { ${routeName}Router } from "./${routeName}`;
  const lastImportIndex = routerIndexContents.lastIndexOf('import');
  const newRoute = `  ${routeName}: ${routeName}Router,\n`;
  const closingRouterObject = routerIndexContents.indexOf('});');

  const newRouterContents =
    routerIndexContents.substring(0, lastImportIndex) +
    newImport +
    routerIndexContents.substring(lastImportIndex, closingRouterObject) +
    newRoute +
    routerIndexContents.substring(closingRouterObject);

  const newRouterFileData = new TextEncoder().encode(newRouterContents);
  await vscode.workspace.fs.writeFile(routerIndexFileUri, newRouterFileData);

  const newRouteDocument = await vscode.workspace.openTextDocument(newFileUri);
  vscode.window.showTextDocument(newRouteDocument);
}

/**
 * Activates the extension.
 * @param context The extension context.
 */
export function activate(context: vscode.ExtensionContext) {
  const disposableScreen = vscode.commands.registerCommand('t4-app-tools.newScreen', async () => {
    const screenName = await validateInput('Enter the name of the new screen', 'NewScreen');
    if (!screenName) {
      return;
    }

    const routeType = await vscode.window.showQuickPick(['Static Route', 'Dynamic Route'], {
      placeHolder: 'What type of route does this screen depend on?',
    });
    if (!routeType) {
      return;
    }
    const isStaticRoute = routeType === 'Static Route';

    let parameterName: string | undefined;
    if (!isStaticRoute) {
      parameterName = await validateInput('Enter the name of the dynamic route parameter', 'id');
      if (!parameterName) {
        return;
      }
    }

    await createScreen(screenName, isStaticRoute, parameterName);
  });

  const disposableComponent = vscode.commands.registerCommand('t4-app-tools.newComponent', async () => {
    const componentName = await validateInput('Enter the name of the new component', 'NewComponent');
    if (!componentName) {
      return;
    }

    await createComponent(componentName);
  });

  const disposableRoute = vscode.commands.registerCommand('t4-app-tools.newRoute', async () => {
    const routeName = await validateInput('Enter the name of the new route', 'newRoute');
    if (!routeName) {
      return;
    }

    await createRoute(routeName);
  });

  context.subscriptions.push(disposableScreen, disposableComponent, disposableRoute);
}

/**
 * Deactivates the extension.
 */
export function deactivate() {}

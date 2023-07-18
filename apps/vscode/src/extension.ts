import { TextEncoder } from 'util';
import * as vscode from 'vscode';
import * as path from 'path';

// Helper function to validate user input
async function validateInput(prompt: string, placeholder: string): Promise<string | undefined> {
  const input = await vscode.window.showInputBox({ prompt, placeHolder: placeholder });
  if (!input || input.includes(' ')) {
    vscode.window.showInformationMessage(`Enter a valid input. You entered: ${input}`);
    return undefined;
  }
  return input;
}

async function createFile(uri: vscode.Uri, data: Uint8Array): Promise<void> {
  await vscode.workspace.fs.writeFile(uri, data);
  const document = await vscode.workspace.openTextDocument(uri);
  vscode.window.showTextDocument(document);
}

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

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showInformationMessage(
        'No workspace folder is open. Please open a workspace folder and try again.'
      );
      return;
    }

    const screenFolderUri = vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'packages', 'app', 'features', screenName.toLowerCase()));
    const screenFileUri = vscode.Uri.file(path.join(screenFolderUri.fsPath, 'screen.tsx'));

    await vscode.workspace.fs.createDirectory(screenFolderUri);

    let screenFileData = new TextEncoder().encode(`import { Paragraph, YStack } from "@my/ui";
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

    if (!isStaticRoute) {
      screenFileData = new TextEncoder().encode(`import { Paragraph, YStack } from "@my/ui";
import React from "react";
import { createParam } from "solito";

const { useParam } = createParam<{ ${parameterName.toLowerCase()}: string }>();

export function ${screenName}Screen() {
  const [${parameterName.toLowerCase()}] = useParam('${parameterName.toLowerCase()}');

  return (
    <YStack f={1} jc="center" ai="center" space>
      <Paragraph ta="center" fow="800">
        {${parameterName.toLowerCase()}: ${parameterName.toLowerCase()}}
      </Paragraph>
    </YStack>
  );
}`);
    }

    await createFile(screenFileUri, screenFileData);

    let expoFolderUri = vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'apps', 'expo', 'app'));
    let expoFileUri = vscode.Uri.file(path.join(expoFolderUri.fsPath, `${screenName.toLowerCase()}.tsx`));

    if (!isStaticRoute) {
      expoFolderUri = vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'apps', 'expo', 'app', screenName.toLowerCase()));
      expoFileUri = vscode.Uri.file(path.join(expoFolderUri.fsPath, `[${parameterName.toLowerCase()}].tsx`));
    }

    await vscode.workspace.fs.createDirectory(expoFolderUri);

    const expoScreenFileData = new TextEncoder().encode(`import { ${screenName}Screen } from "app/features/${screenName.toLowerCase()}/screen";

export default function () {
  return <${screenName}Screen />;
}`);
    await createFile(expoFileUri, expoScreenFileData);

    const nextFolderUri = vscode.Uri.file(
      path.join(workspaceFolder.uri.fsPath, 'apps', 'next', 'pages', screenName.toLowerCase())
    );
    let nextFileUri = vscode.Uri.file(path.join(nextFolderUri.fsPath, 'index.tsx'));

    if (!isStaticRoute) {
      nextFileUri = vscode.Uri.file(
        path.join(nextFolderUri.fsPath, `[${parameterName!.toLowerCase()}].tsx`)
      );
    }

    await vscode.workspace.fs.createDirectory(nextFolderUri);

    const nextFileData = new TextEncoder().encode(`import { ${screenName}Screen } from 'app/features/${screenName.toLowerCase()}/screen';

export default ${screenName}Screen;
`);
    await createFile(nextFileUri, nextFileData);
  });

  const disposableComponent = vscode.commands.registerCommand('t4-app-tools.newComponent', async () => {
    const componentName = await validateInput('Enter the name of the new component', 'NewComponent');
    if (!componentName) {
      return;
    }

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showInformationMessage(
        'No workspace folder is open. Please open a workspace folder and try again.'
      );
      return;
    }

    const newFileUri = vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'packages', 'ui', 'src', `${componentName}.tsx`));

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
    await createFile(newFileUri, componentFileData);
  });

  const disposableRoute = vscode.commands.registerCommand('t4-app-tools.newRoute', async () => {
    const routeName = await validateInput('Enter the name of the new route', 'newRoute');
    if (!routeName) {
      return;
    }

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showInformationMessage(
        'No workspace folder is open. Please open a workspace folder and try again.'
      );
      return;
    }

    const newFileUri = vscode.Uri.file(
      path.join(workspaceFolder.uri.fsPath, 'packages', 'api', 'src', 'routes', `${routeName}.ts`)
    );

    const routeFileData = new TextEncoder().encode(`import { protectedProcedure, publicProcedure, router } from "../trpc";

export const ${routeName}Router = router({

});`);

    await vscode.workspace.fs.writeFile(newFileUri, routeFileData);

    const routerIndexFileUri = vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'packages', 'api', 'src', 'router.ts'));
    const routerIndexDocument = await vscode.workspace.openTextDocument(routerIndexFileUri);
    const routerIndexContents = routerIndexDocument.getText();

    const newImport = `import { ${routeName}Router } from "./${routeName}";\n`;
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
  });

  context.subscriptions.push(disposableScreen, disposableComponent, disposableRoute);
}

export function deactivate() {}

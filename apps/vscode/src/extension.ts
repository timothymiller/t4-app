import { TextEncoder } from 'util';
import * as vscode from 'vscode';
import * as path from 'path';

// Function to get valid user input
async function getUserInput(prompt: string, placeHolder?: string): Promise<string | undefined> {
  const userInput = await vscode.window.showInputBox({ prompt, placeHolder });
  if (!userInput || userInput.includes(' ')) {
    throw new Error(`Invalid input. Please enter a valid value for ${prompt.toLowerCase()}`);
  }
  return userInput;
}

// Function to show error message
async function showErrorMessage(message: string) {
  vscode.window.showErrorMessage(message);
}

// Function to create screen files
async function createScreenFiles(screenName: string, isStaticRoute: boolean, parameterName?: string) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    await showErrorMessage('No workspace folder is open. Please open a workspace folder and try again.');
    return;
  }

  // Create the folder and file URIs
  const screenFolderUri = vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'packages', 'app', 'features', screenName.toLowerCase()));
  const screenFileUri = vscode.Uri.file(path.join(screenFolderUri.fsPath, 'screen.tsx'));

  // Create the screen folder
  await vscode.workspace.fs.createDirectory(screenFolderUri);

  // Generate the screen file contents
  const screenFileContents = getScreenFileContents(screenName, isStaticRoute, parameterName);

  // Write the screen file
  const screenFileData = new TextEncoder().encode(screenFileContents);
  await vscode.workspace.fs.writeFile(screenFileUri, screenFileData);

  // Open the screen file in the editor
  const newScreenDocument = await vscode.workspace.openTextDocument(screenFileUri);
  vscode.window.showTextDocument(newScreenDocument);
}

// Function to generate screen file contents
function getScreenFileContents(screenName: string, isStaticRoute: boolean, parameterName?: string): string {
  let screenFileContents = `
    import { Paragraph, YStack } from "@my/ui";
    import React from "react";
  `;

  if (!isStaticRoute) {
    if (!parameterName) {
      throw new Error('Dynamic route parameter name is missing.');
    }

    screenFileContents += `
      import { createParam } from "solito";

      const { useParam } = createParam<{ ${parameterName.toLowerCase()}: string }>();

      export function ${screenName}Screen() {
        const [${parameterName.toLowerCase()}] = useParam('${parameterName.toLowerCase()}');

        return (
          <YStack f={1} jc="center" ai="center" space>
            <Paragraph ta="center" fow="800">
              { \`${parameterName.toLowerCase()}: \${${parameterName.toLowerCase()}}\` }
            </Paragraph>
          </YStack>
        );
      }
    `;
  } else {
    screenFileContents += `
      export function ${screenName}Screen() {
        return (
          <YStack f={1} jc="center" ai="center" space>
            <Paragraph ta="center" fow="800">
              ${screenName.toLowerCase()}
            </Paragraph>
          </YStack>
        );
      }
    `;
  }

  return screenFileContents;
}

// Function to create Expo screen files
async function createExpoScreenFiles(screenName: string, isStaticRoute: boolean, parameterName?: string) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    await showErrorMessage('No workspace folder is open. Please open a workspace folder and try again.');
    return;
  }

  let expoScreenFolderUri: vscode.Uri;
  let expoScreenFileUri: vscode.Uri;

  if (!isStaticRoute) {
    if (!parameterName) {
      throw new Error('Dynamic route parameter name is missing.');
    }

    expoScreenFolderUri = vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'apps', 'expo', 'app', screenName.toLowerCase()));
    expoScreenFileUri = vscode.Uri.file(path.join(expoScreenFolderUri.fsPath, `[${parameterName.toLowerCase()}].tsx`));
  } else {
    expoScreenFolderUri = vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'apps', 'expo', 'app'));
    expoScreenFileUri = vscode.Uri.file(path.join(expoScreenFolderUri.fsPath, `${screenName.toLowerCase()}.tsx`));
  }

  // Create the Expo screen folder
  await vscode.workspace.fs.createDirectory(expoScreenFolderUri);

  // Generate the Expo screen file contents
  const expoScreenFileContents = getExpoScreenFileContents(screenName);

  // Write the Expo screen file
  const expoScreenFileData = new TextEncoder().encode(expoScreenFileContents);
  await vscode.workspace.fs.writeFile(expoScreenFileUri, expoScreenFileData);
}

// Function to generate Expo screen file contents
function getExpoScreenFileContents(screenName: string): string {
  return `
    import { ${screenName}Screen } from "app/features/${screenName.toLowerCase()}/screen";

    export default function() {
      return <${screenName}Screen />;
    }
  `;
}

// Function to create Next.js screen files
async function createNextScreenFiles(screenName: string, isStaticRoute: boolean, parameterName?: string) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    await showErrorMessage('No workspace folder is open. Please open a workspace folder and try again.');
    return;
  }

  // Create the Next.js screen folder
  const nextScreenFolderUri = vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'apps', 'next', 'pages', screenName.toLowerCase()));
  await vscode.workspace.fs.createDirectory(nextScreenFolderUri);

  let nextScreenFileUri: vscode.Uri;
  if (!isStaticRoute) {
    if (!parameterName) {
      throw new Error('Dynamic route parameter name is missing.');
    }

    nextScreenFileUri = vscode.Uri.file(path.join(nextScreenFolderUri.fsPath, `[${parameterName.toLowerCase()}].tsx`));
  } else {
    nextScreenFileUri = vscode.Uri.file(path.join(nextScreenFolderUri.fsPath, 'index.tsx'));
  }

  // Generate the Next.js screen file contents
  const nextScreenFileContents = getNextScreenFileContents(screenName);

  // Write the Next.js screen file
  const nextScreenFileData = new TextEncoder().encode(nextScreenFileContents);
  await vscode.workspace.fs.writeFile(nextScreenFileUri, nextScreenFileData);
}

// Function to generate Next.js screen file contents
function getNextScreenFileContents(screenName: string): string {
  return `
    import { ${screenName}Screen } from 'app/features/${screenName.toLowerCase()}/screen';

    export default ${screenName}Screen;
  `;
}

export async function activate(context: vscode.ExtensionContext) {
  const disposableScreen = vscode.commands.registerCommand('t4-app-tools.newScreen', async () => {
    try {
      // Get the screen name from the user
      const screenName = await getUserInput('Enter the name of the new screen', 'New

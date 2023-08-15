# T4 App Tools

![Typescript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square)
![Code](https://shields.io/badge/VSCode-00495c?logo=visual-studio-code&logoColor=FFF&style=flat-square)

This Visual Studio Code extension provides a set of commands to create screens, components, and API routes for a T4 application. [t4-app](https://github.com/timothymiller/t4-app) template.

## Summary

The `t4-app-tools` extension offers the following commands:

- `t4-app-tools.newScreen`: Creates a new screen for the T4 application. It prompts for the screen name and type of route (static or dynamic). If it's a dynamic route, it will also ask for the parameter name.

- `t4-app-tools.newComponent`: Creates a new component for the UI library. It prompts for the component name.

- `t4-app-tools.newRoute`: Creates a new API route for the T4 application. It prompts for the route name.

## Instructions

### Creating a New Screen

1. Open Visual Studio Code and navigate to a T4 application project.

2. Open the Command Palette (`Ctrl + Shift + P` or `Cmd + Shift + P`).

3. Search for the command `t4-app-tools: New Screen` and select it.

4. Enter the name of the new screen when prompted. Make sure it is a valid name without any spaces.

5. Choose the type of route the screen depends on: static or dynamic.

6. If you selected a dynamic route, enter the name of the dynamic route parameter.

7. The screen file will be created in the appropriate folders for the T4 application, Expo, and Next.js.

### Creating a New Component

1. Open Visual Studio Code and navigate to the UI library project.

2. Open the Command Palette (`Ctrl + Shift + P` or `Cmd + Shift + P`).

3. Search for the command `t4-app-tools: New Component` and select it.

4. Enter the name of the new component when prompted. Make sure it is a valid name without any spaces.

5. The component file will be created in the UI library project.

### Creating a New API Route

1. Open Visual Studio Code and navigate to the API project.

2. Open the Command Palette (`Ctrl + Shift + P` or `Cmd + Shift + P`).

3. Search for the command `t4-app-tools: New API Route` and select it.

4. Enter the name of the new route when prompted. Make sure it is a valid name without any spaces.

5. The route file will be created in the appropriate folder for the API project.

## Commands Description

Here are the details of each command provided by the t4-app-tools extension:

### New Screen

This command allows you to create a new screen for your T4 application. Enter the name of the new screen using capitalized camel case (e.g., MyNewScreen). The command will generate a new screen.tsx file in the packages/app/features/{ScreenName} directory, add a new index.tsx file in apps/expo/app/{ScreenName}.tsx, and create a new index.tsx file in apps/next/pages/{ScreenName}.tsx that imports your new screen in Next.js. Finally, it will open the new screen.tsx file for you to modify.

### New Component

Use this command to create a new component for your UI library. Enter the name of the new component using capitalized camel case (e.g., MyNewComponent). The command will generate a new component file in the packages/ui/src/components folder. After creation, it will open the new {ComponentName}.tsx file for you to modify.

### New API Route

This command allows you to create a new API route for your T4 application. Enter the name of the new route using lowercase camel case (e.g., myNewRoute). The command will generate a new router in the packages/api/src/routes folder and add it to the index.ts router. Afterward, it will open the new {routeName.ts} file for you to modify.

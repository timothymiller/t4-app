# t4-app-tools

![Typescript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square)
![Code](https://shields.io/badge/VSCode-00495c?logo=visual-studio-code&logoColor=FFF&style=flat-square)

This is a VSCode extension that consists of a set of tools for apps created with the [t4-app](https://github.com/timothymiller/t4-app) template.

The public extension is live on the VSCode marketplace [here]().

## Usage

### New Screen

Input the new screen name in CapitalizedCamelCase (i.e. the name that you would have used for the screen component). Subsequently this command will generate a new `screen.tsx` file under the directory `packages/app/features/{ScreenName}`,  add a new `index.tsx` under `apps/expo/app/{ScreenName}.tsx` and add a new `index.tsx` under `apps/next/pages/{ScreenName}.tsx` importing your new screen in Nextjs. After that it will open the new `screen.tsx` file for you to modify.

### New Component

Input the new component name in CapitalizedCamelCase. Subsequently this command will generate a new component under the `packages/ui/src/components` folder. After that it will open the new `{ComponentName}.tsx` file for you to modify.

### New API Route

Input the new API route name in lowercaseCamelCase. Subsequently this command will generate a new router in the `packages/api/src/routes` folder and add that to the `index.ts` router. After that it will open the new `{routeName.ts}` file for you to modify.

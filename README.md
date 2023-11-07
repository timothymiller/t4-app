<p align="center">
  <a href="https://t4stack.com" target="_blank" rel="noopener noreferrer">
    <picture>
      <img src="https://github.com/timothymiller/t4-app/blob/master/apps/next/public/t4-logo-large.png?raw=true" width="200" alt="Logo of Create T4 App">
    </picture>
  </a>
</p>

<h1 align="center">
  create-t4-app
</h1>

<p align="center">
  Interactive CLI to start a full-stack, typesafe, universal Expo & Next.js app on Cloudflare's edge platform.
</p>

<p align="center">
  Get started with the <a rel="noopener noreferrer" target="_blank" href="https://t4stack.com">T4 Stack</a> by running <code>bun create t4-app</code>
</p>

<p align="center">
  <a href = "https://discord.gg/wj2GV7AvQd">
    <img src="https://img.shields.io/discord/1117289587472081016?color=%235865F2&label=Discord&logo=discord&logoColor=white&style=for-the-badge" alt="Join the T4 discord community">
  </a>&nbsp;
  <a href = "https://www.npmjs.com/package/create-t4-app">
    <img src="https://img.shields.io/npm/dw/create-t4-app?logo=npm&style=for-the-badge&color=CC3534" alt="Weekly downloads for create-t4-app on npmjs.org">
  </a>&nbsp;
  <a href="https://marketplace.visualstudio.com/items?itemName=albbus.t4-app-tools">
    <img src="https://img.shields.io/visual-studio-marketplace/i/albbus.t4-app-tools?logo=visual-studio-code&style=for-the-badge&color=0078D7" alt="VSCode Extension Installs">
  </a>
</p>

## 🍔 The T4 Stack

The T4 Stack is a universal web and native stack made by [Tim Miller](https://twitter.com/ogtimothymiller) focused on **developer experience**, **rapid development**, and **performance**.

Easy integration with **Cloudflare** services, such as R2 & D1 enable developers to build apps with **AI-powered features** at a **lower cost** compared to AWS.

👉 Further documentation can be found on the [T4 Stack website](https://t4stack.com). 👈

<br>
<p align="center">
  <a href="https://pages.cloudflare.com/">
    <img src="https://img.shields.io/badge/Cloudflare%20Pages-F38020?style=for-the-badge&logo=Cloudflare%20Pages&logoColor=white" alt="T4 is compatible with Cloudflare Pages">
  </a>&nbsp;
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="T4 uses Next.js">
  </a>&nbsp;
  <a href="https://expo.dev/">
    <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" alt="T4 uses Expo">
  </a>&nbsp;
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="T4 is written in TypeScript">
  </a>
</p>

### 📐 UI Kit

- 🎨 [Tamagui](https://tamagui.dev)

### 🔮 Frontend

- 🔗 [Next.js](https://nextjs.org)
- 📱 [Expo](https://expo.io)

### 📡 Data Fetching

- 🔄 [tRPC](https://trpc.io)
- ⏲️ [Tanstack Query](https://tanstack.com/query/latest)
- 🎂 [ts-pattern](https://github.com/gvergnaud/ts-pattern)
  - Handle data fetching UI states like this:
 ![tanstack-ts-pattern](https://github.com/timothymiller/t4-app/assets/46549361/f022b20d-840d-48a9-83b8-c52d5f037880)
 

### 📈 Performance Improvements

- 💨 [Million.js](https://million.dev/)
  - Virtual DOM replacement for React
  - Achieve SolidJS-like performance with React
- 🎂 [PattyCake](https://github.com/aidenybai/pattycake)
  - Zero-runtime pattern matching with ts-pattern

### ✅ Type Validation

- 🤖 [Valibot](https://valibot.dev)

### 🧭 Router

- 📲 [Expo Router](https://docs.expo.dev/routing/introduction/)
- ☀️ [Solito](https://solito.dev)

### 🏢 Global State Management

- 🧩 [Jotai](https://jotai.org)

### ⚙️ Backend

- 🔥 [Hono](https://hono.dev)
- 💚 [Cloudflare Workers](https://workers.cloudflare.com)
- 📁 [Cloudflare D1](https://developers.cloudflare.com/d1)
  - [SQLite](https://sqlite.org) database for the edge
- 🗄️ [Drizzle](https://orm.drizzle.team)

### 🔒 Authentication

- 🔑 [Supabase](https://supabase.com/auth)

## 📖 Background

T4 is a project starter kit for building **type-safe**, **native** & **web** applications in TypeScript using Tamagui, tRPC, and Turborepo. Deploy to Cloudflare for a global edge network. All at a fraction of the cost of AWS, Vercel, or Azure.

It provides a unified, opinionated, & minimalistic setup for quickly getting started with building native & web apps, using the same code, without having to worry about the complexities of setting up a development environment.

### 💪 Build Apps for All Platforms

- 📱 iOS
- 🤖 Android
- 🕸️ Web
  - Progressive Web App (PWA) support
  - 💻 macOS
  - 🪟 Windows
  - 🐧 Linux
- 🧪 (Experimental) Desktop support via Tauri

Build native apps for iOS, Android, macOS, Windows, and Linux using the same codebase.

#### Never worry about using XCode or Android Studio again

<p align="left">
  <a href="https://developer.android.com/studio">
    <img src="https://img.shields.io/badge/Android_Studio-3DDC84?style=for-the-badge&logo=android-studio&logoColor=white" alt="Android Studio">
  </a>&nbsp;
  <a href="https://developer.apple.com/xcode/">
    <img src="https://img.shields.io/badge/Xcode-007ACC?style=for-the-badge&logo=Xcode&logoColor=white" alt="XCode">
  </a>
</p>

## 🚀 Quick Start

### Basic Setup

> bun v1.0 is required to use `create-t4-app`

<p align="left">
  <a href="https://bun.sh">
    <img src="https://img.shields.io/badge/bun-%234a4a4a.svg?style=for-the-badge&logo=bun&logoColor=f69220" alt="bun is required to use `create-t4-app`">
  </a>
</p>

To scaffold an app using `create-t4-app`, run any of the following commands.

### **bun**

```bash
bun create t4-app
```

### **Tauri**

If you would like to use Tauri use:

```bash
bun create t4-app --tauri
```

## ❓ Why T4?

T4 is the result of extensive research and testing to identify the best libraries for React Native and Web development. We've done the hard work for you, so you can focus on building amazing apps without worrying about performance bottlenecks.

Whether you're developing a mobile app with React Native or a web app using React, T4 is the perfect choice. Our template is designed to seamlessly integrate with your existing projects, making it easy to enhance performance without starting from scratch.

### 🚅 Performance

- 👉 6 second package install time
- 👉 30 second backend deployments
- 👉 90 second frontend deployments

- Small learning curve
- Instant feedback, rapid development
- Universal across **React Native** & **React Web**
  - [Data fetching](https://tanstack.com/query/latest)
  - [Styling](https://tamagui.dev)
  - [Authentication](https://supabase.com)
  - [Navigation](https://solito.dev)
  - [Type Safety](https://valibot.dev)
- High code re-use
- Low bundle size
- Edge compatible
- Fast startup time
- Simple setup
- Allows for platform-specific code when needed.

## 📦 What's Included

- [Tamagui](https://tamagui.dev) - A UI kit for building beautiful and responsive user interfaces.
- [TanStack](https://tanstack.com/) - High-quality open-source software for React developers.
- [tRPC](https://trpc.io) - A TypeScript framework for building end-to-end typesafe APIs.
- [TypeScript](https://www.typescriptlang.org) - A typed superset of JavaScript that compiles to plain JavaScript.

## 🧩 VSCode Extension

The VSCode extension is optional but highly recommended. It provides a better developer experience by providing code actions to help you scaffold your app. You can find more info in the [docs](https://t4stack.com/extension) or install it from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=albbus.t4-app-tools).

## ✨ Features

- ✅ 6 second package install time
- ✅ 30 second backend deployments
- ✅ 90 second frontend deployments
- ✅ Tamagui UI kit across all platforms.
- ✅ Bun support
- ✅ Million.js Support
- ✅ PattyCake Support
- ✅ Valibot Support
- ✅ Generate Valibot Type Guards from your Drizzle Schema
- ✅ Supabase Auth
- ✅ Uses Next.js for building web apps.
- ✅ Uses Expo for building native mobile apps.
- ✅ PWA by default for native desktop support. No Electron required.
- ✅ Uses Cloudflare Workers for serverless functions.
- ✅ No Docker containers required.
- ✅ Uses tRPC & Tanstack Query for fetching & caching across all platforms.
- ✅ Authentication across all platforms.
- ✅ Powered by TypeScript for type safety and better developer experience.
- ✅ Comes with pre-configured Biome for lightning fast code consistency.
- ✅ Github Action publishing for Expo apps
- ✅ Database migration in CI/CD
- ✅ Tauri Support

## ⭐ Wish List

👉 The wish list has moved to [the docs website](https://t4stack.com/wish-list).

## 💬 Community

For help, discussion about best practices, or any other conversation that would benefit `create-t4-app`:

[Join the T4 Discord Server](https://discord.gg/wj2GV7AvQd)

## 🫶 Contributors

We welcome contributions from anyone and everyone. Please read our [contributing guidelines](https://github.com/timothymiller/t4-app/blob/master/CONTRIBUTING.md) for more information on how to get started.

## 👏 Special Thanks

- [Nate Birdman](https://twitter.com/natebirdman) - Creator of Tamagui
- [Aiden Bai](https://aiden.mov/) - Creator of Million.js and PattyCake
- [Tanner Linsley](https://twitter.com/tannerlinsley) - Creator of TanStack
- [Drizzle Developers](https://twitter.com/DrizzleOrm)
- [Yusuke Wada](https://twitter.com/yusukebe) - Creator of Hono.js
- [Fernando Rojo](https://twitter.com/fernandotherojo) - Creator of Solito
- [Daishi Kato](https://twitter.com/dai_shi) Creator of Jotai
- [Expo Developers](https://twitter.com/expo) - Insightful office hours

## ⚖️ License

**Create T4 App** is licensed under the [MIT License](https://github.com/timothymiller/t4-app/blob/master/LICENSE).

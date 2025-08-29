# React Native Expo Component Template

A comprehensive starter template for creating React Native component libraries with Expo, pre-configured with Storybook, Builder Bob, and testing infrastructure.

![picture of storybook](https://github.com/user-attachments/assets/cf98766d-8b90-44ab-b718-94ab16e63205)

## Features

This template comes pre-configured with:

- **📱 Expo** - Modern React Native development platform
- **📚 Storybook** - Component development and documentation (both on-device and web)
- **🔨 Builder Bob** - Library build tool for React Native packages
- **🧪 Testing** - Jest and React Native Testing Library setup
- **📦 TypeScript** - Full TypeScript support
- **✨ Prettier** - Code formatting and style consistency
- **🎨 Example Components** - Sample Button component with stories and tests

## Getting Started

### Installation

1. **Clone or use this template:**

   ```sh
   git clone https://github.com/zestic/react-native-expo-component-template.git my-component-library
   cd my-component-library
   ```

2. **Install dependencies:**

   ```sh
   # npm
   npm install

   # yarn
   yarn install

   # pnpm
   pnpm install
   ```

3. **Commit your lock file:**
   ```sh
   git add package-lock.json  # or yarn.lock / pnpm-lock.yaml
   git commit -m "Add lock file for reproducible builds"
   ```

4. **Update package.json:**
   - Change the `name` field to your library name
   - Update `version`, `description`, and other metadata
   - Update the repository URL and author information

> **📦 Package Manager Choice:** This template works with npm, yarn, or pnpm. Choose your preferred package manager and use it consistently throughout your project. The examples below show commands for all three - use whichever you prefer.

> **🔒 Lock Files Required:** The CI workflows require a lock file to be committed for reproducible builds. After running your first `install` command, make sure to commit the generated lock file (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`).

### Development

#### Running the Expo App

Start the Expo development server:

```sh
# npm
npm start

# yarn
yarn start

# pnpm
pnpm start
```

#### Storybook Development

This template supports both on-device and web Storybook:

**On-Device Storybook:**

```sh
# Start on-device storybook
npm run storybook        # or: yarn storybook / pnpm storybook

# iOS specific
npm run storybook:ios    # or: yarn storybook:ios / pnpm storybook:ios

# Android specific
npm run storybook:android # or: yarn storybook:android / pnpm storybook:android
```

**Web Storybook:**

```sh
# Start web storybook
npm run storybook:web    # or: yarn storybook:web / pnpm storybook:web

# Build web storybook
npm run storybook:build  # or: yarn storybook:build / pnpm storybook:build
```

If you add new stories, update the story loader:

```sh
npm run storybook:generate # or: yarn storybook:generate / pnpm storybook:generate
```

#### Building Your Library

Build the library for distribution:

```sh
npm run library:build     # or: yarn library:build / pnpm library:build
```

Verify the build:

```sh
npm run library:verify    # or: yarn library:verify / pnpm library:verify
```

#### Testing

Run tests:

```sh
# Run all tests
npm test                  # or: yarn test / pnpm test

# Run tests in watch mode
npm run test:watch        # or: yarn test:watch / pnpm test:watch

# Run tests with coverage
npm run test:coverage     # or: yarn test:coverage / pnpm test:coverage
```

#### Code Formatting

Format your code with Prettier:

```sh
# Format all files
npm run format            # or: yarn format / pnpm format

# Check if files are formatted correctly
npm run format:check      # or: yarn format:check / pnpm format:check

# Format specific files (useful for pre-commit hooks)
npm run format:staged <file1> <file2>  # or: yarn format:staged / pnpm format:staged
```

## Project Structure

```
src/
├── components/          # Your component library
│   └── Button/         # Example component
│       ├── Button.tsx
│       ├── Button.stories.tsx
│       └── __tests__/
│           └── Button.test.tsx
└── index.tsx           # Main library export
```

## Creating New Components

1. Create a new component directory in `src/components/`
2. Add your component implementation
3. Create Storybook stories for documentation and testing
4. Write unit tests
5. Export your component from `src/index.tsx`

## Publishing

1. Build your library: `npm run library:build` (or `yarn library:build` / `pnpm library:build`)
2. Update version in `package.json`
3. Publish to npm: `npm publish`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for your changes
4. Ensure all tests pass
5. Submit a pull request

# Publishing Aurio SDK to npm

This guide explains how to publish Aurio SDK to npm registry.

## Prerequisites

1. Node.js and npm installed
2. npm account created at https://www.npmjs.com
3. Logged in to npm: `npm login`

## Steps to Publish

### 1. Update Version

Update the version in `package.json`:

```bash
npm version patch  # for bug fixes (0.1.0 -> 0.1.1)
npm version minor  # for new features (0.1.0 -> 0.2.0)
npm version major  # for breaking changes (0.1.0 -> 1.0.0)
```

This will:
- Update package.json
- Create a git tag
- Commit the change

### 2. Build the SDK

```bash
npm run build
```

This generates the `dist/` folder with compiled JavaScript and TypeScript declarations.

### 3. Publish to npm

```bash
npm publish
```

The package will be published to npm registry and available at:
```
https://www.npmjs.com/package/aurio-sdk
```

### 4. Verify Publication

Check that the package is available:

```bash
npm view aurio-sdk
npm search aurio-sdk
```

## Installation by Users

After publishing, users can install the SDK:

```bash
npm install aurio-sdk
```

## Package Contents

When published, only the contents of the `dist/` folder and files listed in `package.json` "files" field are included:

```
dist/
  core/
  hooks/
  index.d.ts
  index.js
  ...
```

## Pre-publish Checklist

- [ ] Update version in package.json
- [ ] Run `npm run build` and verify dist/ contents
- [ ] Run `npm run typecheck` to ensure no TypeScript errors
- [ ] Update CHANGELOG.md (if you have one)
- [ ] Commit changes: `git add . && git commit -m "chore: bump version to X.Y.Z"`
- [ ] Push to repository: `git push`
- [ ] Create git tag: `git tag vX.Y.Z && git push --tags`
- [ ] Run `npm publish`

## Scoped Packages

If you want to publish as a scoped package (e.g., `@yourname/aurio-sdk`):

1. Update `package.json`:
   ```json
   "name": "@yourname/aurio-sdk"
   ```

2. Publish with:
   ```bash
   npm publish --access=public
   ```

## Troubleshooting

### "You must be logged in to publish"
```bash
npm login
```

### "You do not have permission to publish this package"
- The package name might already exist. Try a scoped name like `@yourname/aurio-sdk`
- Or use a different package name

### "dist/ folder is empty"
```bash
npm run build
```

### Publishing fails with lint/type errors
```bash
npm run typecheck
```

## Documentation

After publishing, documentation is available at:
- npm: https://www.npmjs.com/package/aurio-sdk
- GitHub: Your repository URL

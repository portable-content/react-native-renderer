# Build Verification Scripts

This directory contains scripts to verify that Build Bob is working correctly.

## verify-build.js

A comprehensive verification script that checks if Build Bob has successfully built your React Native component library.

### What it checks:

1. **Directory Structure** - Verifies `lib/module/` and `lib/typescript/` directories exist
2. **Generated Files** - Checks for all expected output files and their sizes
3. **File Content** - Validates that exports are present in built files
4. **Source Maps** - Verifies source map files are valid JSON with required fields
5. **Import Resolution** - Tests ES module syntax and component exports
6. **TypeScript Declarations** - Validates TypeScript declaration files
7. **Configuration** - Checks Build Bob configuration in package.json

### Usage:

```bash
# Run verification only
npm run verify-build

# Build and then verify
npm run build-and-verify

# Run directly
node bin/verify-build.js
```

### Exit Codes:

- `0` - All checks passed (100% success rate)
- `1` - Some checks failed (less than 100% success rate)

### Output:

The script provides colored output with:

- ✅ Green checkmarks for passed checks
- ❌ Red X marks for failed checks
- ⚠️ Yellow warnings for partial issues
- ℹ️ Blue info messages for running commands

### Troubleshooting:

If checks fail, the script provides helpful tips:

- Run `npx bob build` for a fresh build
- Check that your `src/index.tsx` exports are correct
- Verify your Build Bob configuration in `package.json`
- For React Native components, import testing should be done in a React Native environment

### Example Output:

```
🔍 Build Bob Verification Script

1. Checking Build Output Directory Structure
✅ lib/ directory exists
✅ lib/module/ directory exists
✅ lib/typescript/ directory exists

2. Checking Generated Files
✅ lib/module/index.js exists (106 bytes)
✅ lib/module/index.js.map exists (143 bytes)
✅ lib/typescript/src/index.d.ts exists (90 bytes)
✅ lib/typescript/src/index.d.ts.map exists (152 bytes)

📊 Verification Summary
✅ All checks passed! (15/15)
✅ 🎉 Build Bob is working perfectly!
```

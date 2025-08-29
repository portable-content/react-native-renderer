#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logHeader(message) {
  log(`\n${colors.bold}${message}${colors.reset}`, colors.blue);
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function checkDirectoryExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

function getFileSize(filePath) {
  if (!checkFileExists(filePath)) return 0;
  return fs.statSync(filePath).size;
}

function readFileContent(filePath) {
  if (!checkFileExists(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

function runCommand(command, description) {
  try {
    logInfo(`Running: ${command}`);
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    logSuccess(`${description} - Success`);
    return { success: true, output };
  } catch (error) {
    logError(`${description} - Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

function verifyBuildBob() {
  logHeader('🔍 Build Bob Verification Script');

  let totalChecks = 0;
  let passedChecks = 0;

  // 1. Check Build Output Directory Structure
  logHeader('1. Checking Build Output Directory Structure');

  const libDir = 'lib';
  const moduleDir = path.join(libDir, 'module');
  const typescriptDir = path.join(libDir, 'typescript');

  totalChecks++;
  if (checkDirectoryExists(libDir)) {
    logSuccess(`${libDir}/ directory exists`);
    passedChecks++;
  } else {
    logError(`${libDir}/ directory missing`);
  }

  totalChecks++;
  if (checkDirectoryExists(moduleDir)) {
    logSuccess(`${moduleDir}/ directory exists`);
    passedChecks++;
  } else {
    logError(`${moduleDir}/ directory missing`);
  }

  totalChecks++;
  if (checkDirectoryExists(typescriptDir)) {
    logSuccess(`${typescriptDir}/ directory exists`);
    passedChecks++;
  } else {
    logError(`${typescriptDir}/ directory missing`);
  }

  // 2. Check Generated Files
  logHeader('2. Checking Generated Files');

  const criticalFiles = [
    'lib/module/index.js',
    'lib/module/index.js.map',
    'lib/typescript/src/index.d.ts',
    'lib/typescript/src/index.d.ts.map',
  ];

  criticalFiles.forEach(file => {
    totalChecks++;
    if (checkFileExists(file)) {
      const size = getFileSize(file);
      logSuccess(`${file} exists (${size} bytes)`);
      passedChecks++;
    } else {
      logError(`${file} missing`);
    }
  });

  // 3. Verify File Content
  logHeader('3. Verifying File Content');

  const moduleIndex = 'lib/module/index.js';
  totalChecks++;
  if (checkFileExists(moduleIndex)) {
    const content = readFileContent(moduleIndex);
    if (content && content.includes('export')) {
      logSuccess(`${moduleIndex} contains exports`);
      passedChecks++;
    } else {
      logError(`${moduleIndex} missing exports`);
    }
  } else {
    logError(`${moduleIndex} not found for content verification`);
  }

  const typesIndex = 'lib/typescript/src/index.d.ts';
  totalChecks++;
  if (checkFileExists(typesIndex)) {
    const content = readFileContent(typesIndex);
    if (content && content.includes('export')) {
      logSuccess(`${typesIndex} contains type exports`);
      passedChecks++;
    } else {
      logError(`${typesIndex} missing type exports`);
    }
  } else {
    logError(`${typesIndex} not found for content verification`);
  }

  // 4. Check Source Maps
  logHeader('4. Checking Source Maps');

  const sourceMaps = [
    'lib/module/index.js.map',
    'lib/typescript/src/index.d.ts.map',
  ];

  sourceMaps.forEach(mapFile => {
    totalChecks++;
    if (checkFileExists(mapFile)) {
      const content = readFileContent(mapFile);
      try {
        const mapData = JSON.parse(content);
        if (mapData.version && mapData.sources && mapData.mappings) {
          logSuccess(`${mapFile} is valid`);
          passedChecks++;
        } else {
          logWarning(`${mapFile} exists but missing required fields`);
        }
      } catch (error) {
        logWarning(`${mapFile} exists but is not valid JSON`);
      }
    } else {
      logError(`${mapFile} missing`);
    }
  });

  // 5. Test Import Resolution (Basic Syntax Check)
  logHeader('5. Testing Import Resolution');

  totalChecks++;
  // Instead of actually importing (which fails due to React Native dependencies),
  // we'll check if the built files have valid ES module syntax
  const moduleIndexFile = 'lib/module/index.js';
  if (checkFileExists(moduleIndexFile)) {
    const content = readFileContent(moduleIndexFile);
    if (
      content &&
      content.includes('export') &&
      !content.includes('module.exports')
    ) {
      logSuccess('Built files use ES module syntax');
      passedChecks++;
    } else {
      logError('Built files do not use proper ES module syntax');
    }
  } else {
    logError('Cannot test import resolution - module file missing');
  }

  // Additional check: verify the built component file exists
  totalChecks++;
  const componentFile = 'lib/module/components/Button/Button.js';
  if (checkFileExists(componentFile)) {
    const content = readFileContent(componentFile);
    if (content && content.includes('export const MyButton')) {
      logSuccess('Component export found in built files');
      passedChecks++;
    } else {
      logError('Component export not found in built files');
    }
  } else {
    logError('Component build file missing');
  }

  // 6. Validate TypeScript Declarations
  logHeader('6. Validating TypeScript Declarations');

  totalChecks++;
  const tsCheck = runCommand(
    'npx tsc --noEmit --skipLibCheck lib/typescript/src/index.d.ts',
    'TypeScript declaration validation'
  );
  if (tsCheck.success) {
    passedChecks++;
  }

  // 7. Check Package.json Configuration
  logHeader('7. Checking Package.json Configuration');

  totalChecks++;
  if (checkFileExists('package.json')) {
    const packageJson = JSON.parse(readFileContent('package.json'));
    const bobConfig = packageJson['react-native-builder-bob'];

    if (bobConfig && bobConfig.source === 'src' && bobConfig.output === 'lib') {
      logSuccess('Build Bob configuration is correct');
      passedChecks++;
    } else {
      logError('Build Bob configuration missing or incorrect');
    }
  } else {
    logError('package.json not found');
  }

  // Summary
  logHeader('📊 Verification Summary');

  const successRate = Math.round((passedChecks / totalChecks) * 100);

  if (successRate === 100) {
    logSuccess(`All checks passed! (${passedChecks}/${totalChecks})`);
    logSuccess('🎉 Build Bob is working perfectly!');
  } else if (successRate >= 90) {
    logWarning(
      `Most checks passed (${passedChecks}/${totalChecks} - ${successRate}%)`
    );
    logWarning('Build Bob is working well with minor issues.');
  } else if (successRate >= 75) {
    logWarning(
      `Some checks failed (${passedChecks}/${totalChecks} - ${successRate}%)`
    );
    logWarning(
      'Build Bob is mostly working, but there are some issues to address.'
    );
  } else {
    logError(
      `Many checks failed (${passedChecks}/${totalChecks} - ${successRate}%)`
    );
    logError('Build Bob has significant issues that need to be fixed.');
  }

  // Provide helpful tips
  logHeader('💡 Tips');
  if (successRate < 100) {
    logInfo('To fix issues:');
    logInfo('• Run "npx bob build --clean" for a fresh build');
    logInfo('• Check that your src/index.tsx exports are correct');
    logInfo('• Verify your Build Bob configuration in package.json');
    logInfo(
      '• For React Native components, import testing should be done in a React Native environment'
    );
  }

  // Exit with appropriate code
  process.exit(successRate === 100 ? 0 : 1);
}

// Run the verification
verifyBuildBob();

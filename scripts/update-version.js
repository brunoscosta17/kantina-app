const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Count commits
  const countOutput = execSync('git log --oneline | wc -l').toString().trim();
  const commitCount = parseInt(countOutput, 10);

  if (isNaN(commitCount)) {
    console.error('Failed to parse commit count:', countOutput);
    process.exit(1);
  }

  const versionString = `1.0.${commitCount}`;

  // Update package.json
  const pkgPath = path.join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  if (pkg.version !== versionString) {
    pkg.version = versionString;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`Updated package.json version to ${versionString}`);
    execSync(`git add "${pkgPath}"`);
  }

  // Update app.json
  const appJsonPath = path.join(__dirname, '..', 'app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  
  if (appJson.expo.version !== versionString) {
    appJson.expo.version = versionString;
    fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
    console.log(`Updated app.json version to ${versionString}`);
    execSync(`git add "${appJsonPath}"`);
  }

} catch (err) {
  console.error('Error auto-bumping version:', err.message);
  process.exit(1);
}

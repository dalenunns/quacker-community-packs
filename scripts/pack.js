const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const folderName = process.argv[2];

if (!folderName) {
    console.error('❌ Error: Please provide a folder name to pack.');
    console.error('Usage: npm run pack <folder_name>');
    process.exit(1);
}

if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
    console.error('❌ Error: Invalid folder name. Only alphanumeric characters, underscores, and hyphens are allowed.');
    process.exit(1);
}

const packDir = path.join(__dirname, '..', folderName);

if (!fs.existsSync(packDir)) {
    console.error(`❌ Error: Folder "${folderName}" does not exist.`);
    process.exit(1);
}

const configPath = path.join(packDir, 'config.json');
if (!fs.existsSync(configPath)) {
    console.error(`❌ Error: Could not find config.json in ${folderName}.`);
    process.exit(1);
}

console.log(`\n📦 Packing ${folderName}...`);

try {
    const zip = new AdmZip();
    zip.addLocalFolder(packDir);
    const outputPath = path.join(__dirname, '..', `${folderName}.zip`);
    zip.writeZip(outputPath);
    console.log(`✅ Success! Created QuackPack at ./${folderName}.zip`);
    console.log(`👉 You can now sideload this file in the Quacker application.\n`);
} catch (err) {
    console.error('❌ Error creating zip file:', err);
    process.exit(1);
}

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
    console.log('🦆 Welcome to the QuackPack Generator 🦆\n');

    let folderName = '';
    while (true) {
        folderName = await askQuestion('Folder name (alphanumeric, dashes, underscores only): ');
        if (/^[a-zA-Z0-9_-]+$/.test(folderName)) {
            break;
        } else {
            console.log('❌ Invalid folder name. No spaces or special characters allowed.\n');
        }
    }

    const confName = await askQuestion('Conference Name (e.g., "DuckConf 2026"): ');
    
    let mainHandle = await askQuestion('Main Handle (e.g., "@duckconf"): ');
    if (!mainHandle.startsWith('@')) {
        mainHandle = '@' + mainHandle;
    }

    const website = await askQuestion('Conference Website (e.g., "https://duckconf.cc"): ');

    console.log('\nCreating skeleton QuackPack...\n');

    const packDir = path.join(__dirname, '..', folderName);
    const assetsDir = path.join(packDir, 'assets');

    if (fs.existsSync(packDir)) {
        console.log(`❌ Error: Folder "${folderName}" already exists.`);
        rl.close();
        return;
    }

    // Create directories
    fs.mkdirSync(packDir);
    fs.mkdirSync(assetsDir);

    // Create skeleton config.json
    const configTemplate = {
        name: confName,
        website: website.startsWith('http') ? website : `https://${website}`,
        enabled: true,
        branding: {
            url: "logo.png",
            size: 300,
            padding: 40,
            anchor: "top-right"
        },
        default_hashtags: [
            `#${folderName.replace(/_/g, '')}`
        ],
        handles: {
            [mainHandle]: {
                twitter: mainHandle,
                mastodon: `${mainHandle}@mastodon.cloud`,
                linkedin: mainHandle,
                bluesky: `${mainHandle}.bsky.social`,
                instagram: mainHandle,
                facebook: mainHandle
            }
        },
        frames: [
            {
                id: `${folderName}_banner`,
                name: `${confName} Banner`,
                type: "dynamic_banner",
                defaultText: `#${folderName.replace(/_/g, '')}\n${website}`,
                bgColor: "#1c1917",
                borderColor: "#ffffff",
                textColor: "#ffffff",
                opacity: 0.9,
                height: 130,
                margin: 30,
                borderRadius: 30,
                fontSize: 30,
                assets: [
                    {
                        url: "logo.png",
                        anchor: "right",
                        size: 250,
                        padding: 20
                    }
                ]
            }
        ]
    };

    fs.writeFileSync(
        path.join(packDir, 'config.json'),
        JSON.stringify(configTemplate, null, 4),
        'utf8'
    );

    console.log(`✅ Success! Created QuackPack at ./${folderName}/`);
    console.log(`👉 Next steps:`);
    console.log(`   1. Place your 'logo.png' into the ./${folderName}/assets/ directory.`);
    console.log(`   2. Edit ./${folderName}/config.json to tweak your settings.`);
    console.log(`   3. Run 'npm run validate' to ensure everything is correct.\n`);

    rl.close();
}

main().catch(err => {
    console.error('Error creating QuackPack:', err);
    rl.close();
});

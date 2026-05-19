const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { imageSize: sizeOf } = require('image-size');

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DIMENSION = 4096;

const ajv = new Ajv();
addFormats(ajv);
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '../schema.json'), 'utf8'));
const validateSchema = ajv.compile(schema);

const rootDir = path.join(__dirname, '..');
const dirs = fs.readdirSync(rootDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && dirent.name !== 'node_modules' && dirent.name !== 'scripts')
    .map(dirent => dirent.name);

let hasErrors = false;

function logError(packName, message) {
    console.error(`❌ [${packName}] ${message}`);
    hasErrors = true;
}

function logSuccess(packName, message) {
    console.log(`✅ [${packName}] ${message}`);
}

for (const dir of dirs) {
    const packPath = path.join(rootDir, dir);
    const configPath = path.join(packPath, 'config.json');
    const assetsPath = path.join(packPath, 'assets');

    console.log(`\nValidating QuackPack: ${dir}`);

    // 0. Check folder name for invalid characters
    if (!/^[a-zA-Z0-9_-]+$/.test(dir)) {
        logError(dir, 'Invalid folder name. Only alphanumeric characters, underscores, and hyphens are allowed, with no spaces.');
        continue;
    }

    // 1. Check if config.json exists
    if (!fs.existsSync(configPath)) {
        logError(dir, 'Missing config.json');
        continue;
    }

    // 2. Parse config.json
    let config;
    try {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
        logError(dir, `Invalid JSON in config.json: ${e.message}`);
        continue;
    }

    // 3. Validate against schema
    const valid = validateSchema(config);
    if (!valid) {
        logError(dir, `Schema validation failed: ${ajv.errorsText(validateSchema.errors)}`);
        continue;
    }

    // 4. Extract all image URLs
    const imageUrls = new Set();
    if (config.branding && config.branding.url) {
        imageUrls.add(config.branding.url);
    }
    if (config.frames) {
        config.frames.forEach(frame => {
            if (frame.assets) {
                frame.assets.forEach(asset => {
                    if (asset.url) imageUrls.add(asset.url);
                });
            }
        });
    }

    // 5. Verify assets
    if (imageUrls.size > 0 && !fs.existsSync(assetsPath)) {
        logError(dir, `References images but assets/ directory is missing.`);
        continue;
    }

    for (const imgUrl of imageUrls) {
        const imgPath = path.join(assetsPath, imgUrl);
        
        // 5a. Check existence
        if (!fs.existsSync(imgPath)) {
            logError(dir, `Missing asset file: assets/${imgUrl}`);
            continue;
        }

        // 5b. Check file size
        const stats = fs.statSync(imgPath);
        if (stats.size > MAX_FILE_SIZE) {
            logError(dir, `Asset too large (Max 2MB): assets/${imgUrl} (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
        }

        // 5c. Check dimensions
        try {
            const buffer = fs.readFileSync(imgPath);
            const dimensions = sizeOf(buffer);
            if (dimensions.width > MAX_DIMENSION || dimensions.height > MAX_DIMENSION) {
                logError(dir, `Asset dimensions too large (Max ${MAX_DIMENSION}x${MAX_DIMENSION}): assets/${imgUrl} (${dimensions.width}x${dimensions.height})`);
            }
        } catch (e) {
            logError(dir, `Invalid image format for assets/${imgUrl}: ${e.message}`);
        }
    }

    if (!hasErrors) {
        logSuccess(dir, 'Validation passed!');
    }
}

if (hasErrors) {
    console.error('\n💥 Validation failed. Please fix the errors above.');
    process.exit(1);
} else {
    console.log('\n🎉 All QuackPacks validated successfully!');
}

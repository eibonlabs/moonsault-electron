const fs = require('fs');
const path = require('path');

const esbuild = require('esbuild');

const buildTools = require('./build-tools.js');

// copy index.html to public
buildTools.copy('./src/index.html', './public/index.html');

// copy favicon
buildTools.copy('./src/favicon.png', './public/favicon.png');

// copy assets directory to public
buildTools.copy('./src/assets', './public/assets');

// copy lib directory to public
buildTools.copy('./src/lib', './public/lib');

let apps = [];

fs.readdirSync('./src/apps/').filter((file) => {
    if (fs.statSync(path.join('./src/apps/', file)).isDirectory()) {
        apps.push(file);
    }
});

// copy and build apps
const buildAndWatch = async () => {
    for (let app of apps) {
        let context = await esbuild.context({
            bundle: true,
            minify: true,
            sourcemap: true,
            entryPoints: [`./src/apps/${app}/app.js`],
            outfile: `./public/apps/${app}/app.js`
        });

        buildTools.copy(`./src/apps/${app}/index.html`, `./public/apps/${app}/index.html`);
        buildTools.copy(`./src/apps/${app}/favicon.png`, `./public/apps/${app}/favicon.png`);
        buildTools.copy(`./src/apps/${app}/assets`, `./public/apps/${app}/assets`);
        await context.watch();

        fs.watch(`./src/apps/${app}/assets`, { recursive: true }, (eventType, fileName) => {
            if (eventType === 'change') {
                buildTools.copy(`./src/apps/${app}/assets/${fileName}`, `./public/apps/${app}/assets/${fileName}`);
            }
        });
        console.log('Build complete and watching for changes.');
    }
    fs.watch(`./src/assets`, { recursive: true }, (eventType, fileName) => {
        if (eventType === 'change') {
            buildTools.copy(`./src/assets/${fileName}`, `./public/assets/${fileName}`);
        }
    });
}


buildAndWatch();

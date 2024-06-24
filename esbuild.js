const esbuild = require('esbuild');
const fs = require('fs-extra');
const path = require('path');

async function build() {
    // Build JS
    await esbuild.build({
        entryPoints: ['src/app.js'],
        bundle: true,
        outfile: 'public/dist/app.js',
        minify: process.env.NODE_ENV === 'production',
        sourcemap: process.env.NODE_ENV !== 'production',
    });
    console.log('JS built successfully');

    // Copy HTML
    fs.copySync(
        path.resolve(__dirname, 'src/index.html'),
        path.resolve(__dirname, 'public/index.html'),
        { overwrite: true }
    );
    console.log('HTML copied successfully');

    // Copy CSS
    fs.copySync(
        path.resolve(__dirname, 'src/style.css'),
        path.resolve(__dirname, 'public/dist/style.css'),
        { overwrite: true }
    );
    console.log('CSS copied successfully');

    // Copy Bootstrap CSS
    fs.copySync(
        path.resolve(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.min.css'),
        path.resolve(__dirname, 'public/dist/bootstrap.min.css'),
        { overwrite: true }
    );
    console.log('Bootstrap CSS copied successfully');

    // Copy Bootstrap JS
    fs.copySync(
        path.resolve(__dirname, 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'),
        path.resolve(__dirname, 'public/dist/bootstrap.bundle.min.js'),
        { overwrite: true }
    );
    console.log('Bootstrap JS copied successfully');

    // Copy Bootstrap Icons CSS
    fs.copySync(
        path.resolve(__dirname, 'node_modules/bootstrap-icons/font/bootstrap-icons.css'),
        path.resolve(__dirname, 'public/dist/bootstrap-icons.css'),
        { overwrite: true }
    );
    console.log('Bootstrap Icons CSS copied successfully');

    // Copy Bootstrap Icons fonts
    fs.copySync(
        path.resolve(__dirname, 'node_modules/bootstrap-icons/font/fonts'),
        path.resolve(__dirname, 'public/dist/fonts'),
        { overwrite: true }
    );
    console.log('Bootstrap Icons fonts copied successfully');
}

build().catch(() => process.exit(1));
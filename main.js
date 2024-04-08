const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720
    })

    win.loadFile(`${__dirname}/public/index.html`);
}

// TODO:
/* when navigating to a route in electron, index.html needs to part of the hash...*/
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog
const Menu = electron.Menu

//uses github repo as update server
const GhReleases = require('electron-gh-releases')

let options = {
    repo: 'SamuelDub/GM',
    currentVersion: app.getVersion()
}

const updater = new GhReleases(options)

app.on('ready', function () {

    var mainWindow = new BrowserWindow({
        width: 810,
        height: 640,
        resizable: true
    })

    mainWindow.loadURL('file://' + __dirname + '/app/main/main.html');

    mainWindow.focus();

    mainWindow.webContents.openDevTools()

    const page = mainWindow.webContents;

    page.once('did-frame-finish-load', () => {

        // Check for updates
        // `status` returns true if there is a new update available
        updater.check((err, status) => {
            if (!err && status) {
                updater.download();
            }
        })

        // When an update has been downloaded
        updater.on('update-downloaded', (info) => {
            dialog.showMessageBox({
                type: 'question',
                buttons: ['Yes', 'No'],
                title: 'Confirm',
                message: 'A new update has been downloaded, would you like to install it?'
            }, function (response) {
                if (response == 0) { // Runs the following if 'Yes' is clicked
                    mainWindow.hide();
                    updater.install()
                }
            })

        })

        // Access electrons autoUpdater
        updater.autoUpdater;
    });

});

app.on('window-all-closed', function () {
    app.quit();
});
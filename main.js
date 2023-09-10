// BrowserWindow - Module to create native browser window.
// app - Module to control application life.
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
var fs = require('fs');
const jQuery = require('jquery');
//var sql = ;//require('sql.js');
const { AppController } = require(path.join(__dirname, '/app.js'))
const { SQL } = require(path.join(__dirname, '/sql.js'))
const { DB } = require(path.join(__dirname, '/db.js'))

const DB_PATH = path.resolve(__dirname, './', 'db.sqlite');
const SCHEMA_PATH = path.resolve(__dirname, './', 'APP_DB_SCHEMA.sql');
const SCHEMA_TEST_PATH = path.resolve(__dirname, './', 'APP_DB_SCHEMA_TEST.sql');

function createWindow() {

    // Create the browser window.
    const win = new BrowserWindow({
        width: 2000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    //win.maximize();
    //win.setFullScreen(true);
    // and load the index.html of the app.
    win.loadFile('index.html')

    // Open the devtools.
    win.openDevTools();
    // Emitted when the window is closed.
    win.on('closed', function () {

        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

}
let appController = new AppController(
    new DB(
        {
            DB_PATH: DB_PATH,
            SCHEMA_PATH: SCHEMA_PATH,
            SCHEMA_TEST_PATH: SCHEMA_TEST_PATH,
            SQL: SQL,
            fs: fs
        })
); 
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {

    ipcMain.handle('ping', () => 'pong')
    ipcMain.handle('pong', () => 'pong')
    
    ipcMain.handle('selectedPage', () => appController.selectedPage())
    ipcMain.handle('pages', () => appController.pages())
    ipcMain.handle('organisation', () => appController.organisation())
    ipcMain.handle('getPage', (pageId) => {
        appController.getPage(pageId)
    })
    ipcMain.handle('getPageHTML', (page) => {
        appController.getPageHTML(page)
    })

    
    createWindow()

    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Modules to control application life and create native browser window
const electron = require('electron');
const { app, BrowserWindow, globalShortcut } = electron;
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {

  const screenSize = electron.screen.getPrimaryDisplay().workAreaSize,
    width = 390,
    height = 1080,
    x = screenSize.width - width,
    y = 0;

  let mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    show: false,
    backgroundColor: '#222f3e',
    frame: false,
    titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      nodeIntegration: true,
    },
    fullscreenable: false,
  });

  // Keep window always on top even with full screen apps
  //mainWindow.setAlwaysOnTop(true, 'floating');
  mainWindow.setVisibleOnAllWorkspaces(true);

  // Load YouTube TV
  mainWindow.loadURL('https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Fapp%3Ddesktop%26action_handle_signin%3Dtrue%26next%3Dhttps%253A%252F%252Fmusic.youtube.com%252F%26hl%3Den%26feature',
    { userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0' });

  // Inject script and css once loaded
  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.insertCSS(
      fs.readFileSync(`${__dirname}/renderer.css`).toString()
    );
    mainWindow.webContents.executeJavaScript(
      fs.readFileSync(`${__dirname}/renderer.js`).toString()
    );
  });

  // Hide until window has mostly loaded content
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Destroy object, close app
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  globalShortcut.register('Alt+M', () => {
    console.log('Alt+M is pressed');
    mainWindow.webContents.send('song', 'next');
  });

  globalShortcut.register('Alt+N', () => {
    console.log('Alt+N is pressed');
    mainWindow.webContents.send('song', 'prev');
  });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});

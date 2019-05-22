const { app, BrowserWindow, Menu } = require('electron');
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const isDev = require('electron-is-dev');
const path = require('path');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


let win;

function sendStatusToWindow(text) {
  log.info(text);
  if (win) {
    win.webContents.send('message', text);
  }
}


function createDefaultWindow() {
  win = new BrowserWindow({
    title: '512考试教育网',
    icon: path.resolve('logo-64.ico'),
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.maximize();
  // if (isDev) {
  win.webContents.openDevTools();
  // }

  win.on('ready-to-show', function () {
    win.show();
    win.focus();
  });

  win.on('closed', () => {
    win = null;
  });

  win.loadURL('http://192.168.20.185:9000');

  return win;
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent.toFixed(2) + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
  autoUpdater.quitAndInstall();
});

app.on('ready', function () {
  createDefaultWindow();

  sendStatusToWindow('App Is Ready');
  // autoUpdater.checkForUpdates();
});

app.on('window-all-closed', () => {
  app.quit();
});



//-------------------------------------------------------------------
// Auto updates - Option 2 - More control
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------
// app.on('ready', function()  {
//   autoUpdater.checkForUpdates();
// });
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (info) => {
// })
// autoUpdater.on('update-not-available', (info) => {
// })
// autoUpdater.on('error', (err) => {
// })
// autoUpdater.on('download-progress', (progressObj) => {
// })
// autoUpdater.on('update-downloaded', (info) => {
//   autoUpdater.quitAndInstall();  
// })

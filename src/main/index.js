const { app, BrowserWindow, Menu } = require('electron');
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


let win;

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}


function createDefaultWindow() {
  win = new BrowserWindow({
    title: '512考试教育网',
    show: false,
    icon: path.resolve(__dirname, 'logo-64.ico'),
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.maximize();
  win.webContents.openDevTools();

  win.on('ready-to-show', function () {
    win.show();
    win.focus();
  });

  win.on('closed', () => {
    win = null;
  });

  win.loadURL('https://dev.512ks.cn');

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
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});

app.on('ready', function () {
  createDefaultWindow();

  sendStatusToWindow('App Is Ready');
  // autoUpdater.checkForUpdatesAndNotify().then(result => {
  //   sendStatusToWindow(JSON.stringify(result));
  // });
  autoUpdater.checkForUpdates();
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

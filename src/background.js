/*global __static*/

'use strict'

// import used components
// ---------------------------------------------------------------------------------------------------------------//

import { app, BrowserWindow } from 'electron';
import path from 'path';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import Registry from 'winreg';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// ---------------------------------------------------------------------------------------------------------------//

const isDevelopment = process.env.NODE_ENV !== 'production'
let win
let icon = path.join(__static, 'favicon.ico')

// register global functions
// ---------------------------------------------------------------------------------------------------------------//

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 975,
    height: 525,
    minWidth: 500,
    minHeight: 300,
    frame: false,
    icon: icon,
    show: false,
    title: "Multi SSH Client",
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })

  win.once('ready-to-show', () => {
    win.show();
    checkCli(process.argv);
    //if (!process.env.IS_TEST) win.webContents.openDevTools()
  })
}

function puTTYNewConnection(pw) {

  let regKey = new Registry({                                       // new operator is optional
    hive: Registry.HKCU,                                        // open registry hive HKEY_CURRENT_USER
    key: '\\Software\\SimonTatham\\PuTTY\\Sessions\\WinSCP%20temporary%20session' // key containing autostart programs
  })

  // list autostart programs
  regKey.values(function (err, items /* array of RegistryItem */) {
    if (err) {
      console.log('ERROR: ' + err);
    } else {
      let data = {'PassWord':pw};
      for (let item of items) {

        let name = item.name;
        switch (name) {
          case 'HostName':
            data[name] = item.value;
            break;

          case 'PortNumber':
            data[name] = parseInt(item.value);
            break;

          case 'UserName':
            data[name] = item.value;
            break;

          case 'PublicKeyFile':
            data[name] = item.value;
            break;

          case 'WinTitle':
            data[name] = item.value;
            break;
        }
      }
      win.webContents.send('NewConnection', data)
    }
  });
}

function checkCli(argv) { 
  console.log(argv);
  let loadkey = argv.indexOf('-load');
  let pw = null;
  for (let value of argv) {
    let pwmatch = value.match(/-pw=(\S+)/);
    if (pwmatch) {
      pw = pwmatch[1];
    }
  }

  if (loadkey > -1) {
    puTTYNewConnection(pw);
  }
}
// make app logic
// ---------------------------------------------------------------------------------------------------------------//

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit()
} else {

  // if the second instance is called 
  app.on('second-instance', function (event, argv) {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
    checkCli(argv);
  });


  // define what to do if the app can start
  app.on('ready', async () => {
    //createTray()
    createWindow()
  })


  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    app.quit()
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })



  // Exit cleanly on request from parent process in development mode.
  if (isDevelopment) {
    if (process.platform === 'win32') {
      process.on('message', data => {
        if (data === 'graceful-exit') {
          app.quit()
        }
      })
    } else {
      process.on('SIGTERM', () => {
        app.quit()
      })
    }
  }


}

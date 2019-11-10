/*global __static*/

'use strict'

// iport used components
// ---------------------------------------------------------------------------------------------------------------//
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// ---------------------------------------------------------------------------------------------------------------//
const isDevelopment = process.env.NODE_ENV !== 'production'
let win
let icon = path.join(__static, 'favicon.ico')

const clientProtocol = {}
clientProtocol.list = {};
// register global functions
// ---------------------------------------------------------------------------------------------------------------//

clientProtocol.on = function (event, callback) {
  this.list[event] = callback
}

clientProtocol.call = function (event, data) {
  this.list[event](data)
}

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
    win.show()
    //if (!process.env.IS_TEST) win.webContents.openDevTools()
  })
}
// make app logic
// ---------------------------------------------------------------------------------------------------------------//

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

// Test zone
// ---------------------------------------------------------------------------------------------------------------//


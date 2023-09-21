// Description: This script is a bootstrapper that provides entry into and initiates the application. 
const electron = require('electron')
const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell // allows for pop-out windows
const ipc = require('electron').ipcMain
const dialog = electron.dialog
const autoUpdater = require("electron-updater").autoUpdater

// context menu enables actions with right mouse click
require('electron-context-menu')({
	prepend: (params, browserWindow) => [
        {
        label: "Edit",
		role: "editMenu" // fills "Edit" object with array of default roles for edit menu (undo, redo, cut, copy, paste, selectall, delete)
        }
    ]
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null;

autoUpdater.autoDownload = false; // set autoDownload property to false; updates will not be downloaded immediately after the autoUpdater finds them

// Make sure only one instance of the application is open at a time
var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window.
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

if (shouldQuit) {
  app.quit();
  return;
}

function createWindow () {
  // Create the browser window and maximize
  win = new BrowserWindow({show: false})
  win.maximize()
  win.show()

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.min.html'), // Change here from index.html to index.min.html
    protocol: 'file:',
    slashes: true
  }))
 
 
  // Open the DevTools; remove comment on the line below if dev tools are needed
  //win.webContents.openDevTools()

  /* Alpha alert; remove once alpha testing is finished
  dialog.showMessageBox({ type: 'warning', title: 'Alpha Testing Alert', 
  message: 'The CWA 15793:2011 Tool is in alpha testing, and there may be some bugs.',
  detail: 'You may make modifications to this application, but please do not distribute unofficial versions.' })
  */

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
  
  // Allows items from within the menu variable to check the title of the current html page
  function checkWin() {
      return win.webContents.getTitle()
  }

  // set to trigger when the database cleaning window is opened
  function dbCleanWinOpen() {
      win.webContents.send('dbCleanWinOpen'); // send message (currently only to index.html) to initiate blocking div
  }

  // when db cleaning window is closed
  function dbCleanWinClosed() {
      win.webContents.reload(); // reload the the window to clear blocking div and remove any database info that no longer exists
  }

  var menu = Menu.buildFromTemplate([
        {
            // builds main menu item 
            label: 'File',
            // builds submenu items
            submenu: [
                {
                    label: 'Home',
                    click() {
                        win.loadURL(url.format({
                            pathname: path.join(__dirname, 'src/index.min.html'), // Change here from index.html to index.min.html
                            protocol: 'file',
                            slashes: true
                        }))
                    }
                },/*
                {label: 'New Evaluation'},
                {label: 'Update'},*/
                {
                    label: 'Clean Database',
                    click() {
                        if (checkWin() === 'CWA 15793:2011 Tool - Evaluation') {
                            dialog.showMessageBox({ type: 'info', title: 'Alert',
                            message: 'You may not remove items from the database while editing an evaluation.',
                            detail: 'Please navigate to the home page and try again.'
                            });
                        }
                            else {
                            dbCleanWinOpen() 
                            let win = new BrowserWindow({ frame: false, resizable: false, transparent: true, width: 400, height: 375 })
                            win.on('close', function() {win = null; dbCleanWinClosed()})
                            win.loadURL(url.format({
                                pathname: path.join(__dirname, 'src/fileRemover.html'),
                                protocol: 'file',
                                slashes: true
                            }));
                        }
                    }
                },
                {type: 'separator'}, // separator creates delimiting line between sections
                {
                    // exit submenu leaves program
                    label: 'Exit',
                    click() {
                        app.quit()
                    }
                }
            ]
        },
        {
            label: 'Reports',

            submenu: [
                {
                    label: 'Export as DOCX',
                    click() {
                        let win = new BrowserWindow({ frame: false, resizable: false, transparent: true, width: 400, height: 250 })
                        win.on('close', function() {win = null;})
                        win.loadURL(url.format({
                            pathname: path.join(__dirname, 'src/docxReport.min.html'), // Change here from docxReport.html to docxReport.min.html
                            protocol: 'file',
                            slashes: true
                        }));
                    }
                }
            ]
        },
        {
            label: 'Help',

            submenu: [
                {
                    label: 'About',
                    click() {
                        let win = new BrowserWindow({ frame: false, resizable: false, transparent: true, alwaysOnTop: true, width: 400, height: 435 })
                        win.on('close', function() {win = null})
                        win.loadURL(url.format({
                            pathname:path.join(__dirname, 'src/about.html'),
                            protocol: 'file',
                            slashes:true
                        }))
                    }
                },
                {
                    // about submenu navigates to IBCTR home
                    label: 'Publisher Website',
                    click() {
                        shell.openExternal('http://ibctr.sandia.gov/')
                    }
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// IPC methods below allow communication from rendered windows to main process.
// In this case, IPC will advance the main window to begin the evaluation once 
// the nextBtn is clicked within newFile.html
var fileName // initialize variable to hold file name

ipc.on('begin_evaluation', function(event, arg) {
    fileName = arg // package fileName
    // load the evaluation window
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/evalMain.min.html'), // Change here from evalMain.html to evalMain.min.html
        protocol: 'file:',
        slashes: true
    }));
});

// when the evaluation window is ready, send the fileName to it
ipc.on('evalMainReady', function(event) {
    event.sender.send('fileName', fileName)
});

// when the fileRemover is ready for a deletion, issue the delete warning to user
ipc.on('deleteOne', function(event, fileName2) {
    dialog.showMessageBox({ type: 'warning', title: 'Delete File',
    message: 'Are you sure you want to permanently delete "' + fileName2 + '"?',
    detail: 'This cannot be undone.', 
    buttons: ['Yes','No']}, function (response) {
        event.sender.send('deleteOne_Res', response) // callback function returns 0 for yes and 1 for no and sent back to fileRemover via IPC
    });
});

// when the fileRemover is ready to delete all, issue the delete warning to user
ipc.on('deleteAll', function(event) {
    dialog.showMessageBox({ type: 'warning', title: 'Delete All Files',
    message: 'Are you sure you want to permanently delete ALL files?',
    detail: 'This cannot be undone.', 
    checkboxLabel: 'You must check here to agree to delete the entire database.',
    buttons: ['Yes','No']}, function (response, checkboxChecked) {
        event.sender.send('deleteAll_Res', response, checkboxChecked) // callback function returns 0 for yes and 1 for no and sent back to fileRemover via IPC
    });
});

// when export as docx request is sent
ipc.on('exportDocx', function(event) {
    dialog.showSaveDialog({ title: 'Export DOCX',
    filters: [{name: 'Office Open XML', extensions: ['docx']}]}, function (filename) {
        event.sender.send('fileNameDocx', filename) // callback function returns the 
     });
});

// Auto updater

// wait for report from index.html that it is ready
ipc.on('indexHTMLReady', function(event) {
    //autoUpdater.checkForUpdates(); //check for updates --UNCOMMENT THIS LINE WHEN GITHUB REPO IS READY AND READY TO PACKAGE
});

// if there is an update available
autoUpdater.on('update-available', (info) => {
    win.webContents.send('updateAvailable') // send message to main to prompt user via update GUI
});

ipc.on('initiateUpdate', function(event) { // index.html has reported that the user has accepted the update
    autoUpdater.downloadUpdate();   // download update
});

autoUpdater.on('update-downloaded', function(event) {   // once downloaded
    autoUpdater.quitAndInstall();   // quit and install
});

autoUpdater.on('error', (error) => { 
    dialog.showMessageBox({ type: 'warning', title: 'Error Updating', 
    message: 'Oops! There was a problem with auto updating :(\n\n' + error
    });
});
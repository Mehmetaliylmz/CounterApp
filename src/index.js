const { app, BrowserWindow, ipcMain, dialog, Menu} = require('electron');
const fs = require('fs');
const path = require('path');
if (require('electron-squirrel-startup')) {
  app.quit();
}
const filePath = `${process.env.APPDATA}\\counterAppData`;
const jsonFile = fs.readFileSync(filePath + `\\data\\appList.json`,'utf-8');
const data = JSON.parse(jsonFile);
let appListData = data.appList;
let appIconsData = data.appIcons;


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  const menu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(menu);

    mainWindow.loadFile(path.join(__dirname, 'apps.html'));
  


  startLoop();
  
  ipcMain.on('openAddAppDialog', (event) => {
    const mainWindow = BrowserWindow.fromWebContents(event.sender);
    dialog
      .showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
          { name: 'Kısayol Dosyaları', extensions: ['Ink'] },
          { name: 'Bütün Dosyalar', extensions: ['*'] },
        ],
      })
      .then((result) => {
        if (!result.canceled)
        {
          event.reply('appDialogResult', result.filePaths);
        }
        else
        {
          console.log("canceled");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
  
  ipcMain.on('getApp', (event,veri) => {
    let appPathArray = veri;
    let appPath = appPathArray[0];
    let appName = appPath.split("\\")[appPath.split("\\").length - 1];
    app.getFileIcon(appPath).then(icon => {
        const dataURL = icon.toDataURL();
        appIconsData[0][appName] = dataURL;
        appListData[0].push(appName);
        const filteredAppListData = [...new Set(appListData[0])];
        const filteredAppIconsData = [...new Set(appIconsData)];
        let appListJsonData = {"appList" : [filteredAppListData], "appIcons" : filteredAppIconsData};
        let jsonDataToWrite = JSON.stringify(appListJsonData);
        fs.writeFileSync(filePath + `\\data\\appList.json`,jsonDataToWrite);
        let template = {"currentSession": 0, "totalSession" : 0};
        let jsonTemplate = JSON.stringify(template);
        fs.writeFileSync(filePath + `\\data\\apps\\${appName}.json`,jsonTemplate);
    });
  });

  ipcMain.on('readAppList', (event) => {
    let appCounterDict = {};
    if (data.appList[0] == undefined)
    {
      data.appList[0] = [];
    }
    data.appList[0].forEach(app => {
      let appJsonFile = fs.readFileSync(filePath + `\\data\\apps\\${app}.json`,'utf-8');
      const appJsonData = JSON.parse(appJsonFile);
      appCounterDict[app] = [appJsonData.currentSession,appJsonData.totalSession];

    });
    let jsonFile = fs.readFileSync(filePath + '\\data\\appList.json','utf-8');
    const jsonData = JSON.parse(jsonFile)
    let appListData = jsonData.appList;
    let appIconsData = jsonData.appIcons;
    
    event.reply('appList',appListData,appIconsData,appCounterDict);
  });

  ipcMain.on('readAppCounter', (event) => 
  {
    let appCounterDict = {};
    appListData[0].forEach(app => {
      let appJsonFile = fs.readFileSync(filePath + `\\data\\apps\\${app}.json`,'utf-8');
      const appJsonData = JSON.parse(appJsonFile);
      appCounterDict[app] = [appJsonData.currentSession,appJsonData.totalSession]; 

    });
    
    event.reply("sendAppCounterData",appCounterArray);
  })
  
  
  mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    
  }
});
let {PythonShell} = require('python-shell');

const sleep = ms => new Promise(r => setTimeout(r,ms));
let options = {
  args: appListData[0]
} 
async function startLoop()
{
  for (let x=1; x>0;x++)
  {
    PythonShell.run("src/script.py",options).then(messages=>{});
    await sleep(1000);
  }
}

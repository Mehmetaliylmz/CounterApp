const { contextBridge } = require('electron');
const { ipcRenderer } = require('electron');

const filePath = `${process.env.APPDATA}\\counterAppData\\data`;




function addApp()
{
    return new Promise((resolve,reject) => {
        ipcRenderer.send('openAddAppDialog');
        ipcRenderer.on('appDialogResult', (event, filePath) => {
            ipcRenderer.sendSync('getApp',filePath);
            ipcRenderer.on('sendBoolean', (event, boolean) => 
            {
                console.log(boolean);
                resolve(boolean);
            });
        
        });
    });
    
}
function getApps()
{
    return new Promise((resolve, reject) => {
        ipcRenderer.send('readAppList');
        ipcRenderer.on('appList', (event, appListNew,appIconsNew,appCountersNew) => {
          console.log("Uygulamalar: ", appListNew);
          console.log("Sayaçlar: ",appCountersNew);
          resolve([appListNew,appIconsNew,appCountersNew]);

        });
      });
    
}

contextBridge.exposeInMainWorld('file',{
    select: () => addApp(),
    get : () => getApps()
});
addApps();
function addItem()
{

    file.get();

}   



function addApps()
{
    file.get().then(apps => 
        {
        appList = apps[0][0];
        appIcons = apps[1][0];
        appCounters = apps[2];
        if (appList == undefined)
        {
            appList = [];
        }
        appList.forEach(appName => {
            window.addEventListener('resize', function() {
                document.documentElement.style.setProperty('--screen-height',window.innerHeight / 4 + "px");
                document.documentElement.style.setProperty('--screen-width', window.innerWidth / 5 + "px");
                document.documentElement.style.setProperty('--font-size', "20px")
            
            });
            let childDiv = document.createElement(`div`);
            let iconImageDiv = document.createElement('div');
            let appNameDiv = document.createElement('div');
            let iconImage = document.createElement('img');
            let counterDiv = document.createElement('div');
            let counterDiv2 = document.createElement('div');
            if (appCounters[appName][0] >= 3600)
            {
                counterDiv.innerHTML = `Mevcut oturum: ${(appCounters[appName][0]/3600).toFixed(0)} saat`;
            }
            else
            {
                counterDiv.innerHTML = `Mevcut oturum: ${(appCounters[appName][0]/60).toFixed(0)} dk`;
            }
            if (appCounters[appName][1] >= 3600)
            {

                counterDiv2.innerHTML = `Toplam oturum: ${(appCounters[appName][1]/3600).toFixed(0)} saat`
            }
            else
            {
                counterDiv2.innerHTML = `Toplam oturum: ${(appCounters[appName][1]/60).toFixed(0)} dk`

            }
            const appsBodyDiv = document.getElementById('appsBodyDiv');
            appNameDiv.addEventListener("dblclick",function() {
                var val=this.innerHTML;
                var input=document.createElement("input");
                input.value=val;
                input.style.width = "100px";
                input.onblur=function(){
                    var val=this.value;
                    this.parentNode.innerHTML=val;
                }
                this.innerHTML="";
                this.appendChild(input);
                input.focus();
            });
            appNameDiv.id = "appNameDiv";
            appNameDiv.innerHTML = appName.split(".")[0];
            iconImage.src = appIcons[appName];
            childDiv.id = "childDiv";
            iconImageDiv.id = "iconImageDiv";
            iconImageDiv.appendChild(iconImage);
            childDiv.appendChild(iconImageDiv);
            childDiv.appendChild(appNameDiv);
            childDiv.appendChild(counterDiv);
            childDiv.appendChild(counterDiv2);
            appsBodyDiv.appendChild(childDiv);
            
        });
    });
        
}
function refreshItems()
{
    const appsBodyDiv = document.getElementById("appsBodyDiv");
    appsBodyDiv.innerHTML = "";
    console.log("test");
    addApps();
}

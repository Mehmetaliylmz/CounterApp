import wmi
import json
import sys
import os
# try:
#     # print(os.getenv('APPDATA'))
#     for x in sys.argv[1:]:
#         print(x)
# except Exception as e:
    # print(e)
appList = []
try:
    for process in sys.argv[1:]:
        appList.append(process)
except Exception as e:
    pass
c=wmi.WMI()
# processes = c.Win32_Process()
# for process in processes:
#     print(process)
# print(bool(c.Win32_Process(name="Spotify.exe")))

def check_process_running(processName):
    for process in processName:
        # print(process)
        if(bool(c.Win32_Process(name=process)) == True):
            try:
                with open(f"{os.getenv('APPDATA')}\\counterAppData\\data\\apps\\{process}.json","r") as f:
                    data = json.load(f)
                    data['currentSession'] += 1
                with open(f"{os.getenv('APPDATA')}\\counterAppData\\data\\apps\\{process}.json","w") as f:
                    json.dump(data,f,indent=4)
            except FileNotFoundError as e:
                with open(f"{os.getenv('APPDATA')}\\counterAppData\\data\\apps\\{process}.json","w") as f:
                    data = {"currentSession" : 0, "totalSession": 0}
                    json.dump(data,f,indent=4)

            # print(data)
        else:
            try:
                with open(f"{os.getenv('APPDATA')}\\counterAppData\\data\\apps\\{process}.json","r") as f:
                    data = json.load(f)
                    data['totalSession'] += data['currentSession']
                    data['currentSession'] = 0
                with open(f"{os.getenv('APPDATA')}\\counterAppData\\data\\apps\\{process}.json","w") as f:
                    json.dump(data,f,indent=4)
            except FileNotFoundError as e:
                with open(f"{os.getenv('APPDATA')}\\counterAppData\\data\\apps\\{process}.json","w") as f:
                    data = {"currentSession" : 0, "totalSession": 0}
                    json.dump(data,f,indent=4)

            # print("Process is not running")


check_process_running(appList)
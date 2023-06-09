import datetime
import os

def get_datetime_str():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def get_scenarious(spath=None):
    spath = os.getcwd()+"/chatDBServer/scenarios/"
    # print(os.listdir("./chatDBServer/scenarios/"))
    sfiles = os.listdir(spath)
    return sfiles
from chatDBServer.DB_wrapper import ChatDB

import os
import json

class ScenarioManager:
    def __init__(self, spath="./chatDBServer/scenarios/", ipath="./chatDBServer/scenario-img.json") -> None:
        self.spath = spath
        self.chatdb = ChatDB()
        with open(ipath, 'r') as file:
            self.img_dict = json.load(file)
 
    def get_scenarios_list(self):
        return os.listdir(self.spath)

    # 指定したファイルの読み込み
    def read_patient_scenario(self, user_id:int, room_id:int)->str:
        filename = self.get_scenario_filename(user_id, room_id)
        if filename != "":
            try:
                with open(self.spath+filename, mode="r", encoding="utf_8_sig") as f:
                    contents = f.read()
            except Exception as e:
                print(e)
            return contents
        else:
            return "Not Found"
    
    def get_scenario_filename(self, user_id:int, room_id:int) -> str:
        room = self.chatdb.read_room(room_id)
        # patient_id取得
        patient_id = room[-1] 
        user_t = self.chatdb.get_user(user_id)
        # userのdictを取得
        patient_dict =  json.loads(user_t[2])
        if str(patient_id) in patient_dict.keys():
            return patient_dict[str(patient_id)]
        else:
            print("patient_id:{0} was NOT FOUND in user:{1}".format(patient_id, user_id))
            return ""

    def get_image_from_scenario(self, sfile:str):
        if sfile in  self.img_dict.keys():
            return self.img_dict[sfile]
        else:
            return ""
    
    def extract_basic_info(self, user_id:int, room_id:int) -> dict:
        scenario = self.read_patient_scenario(user_id, room_id)
        basic_info = dict()
        for line in scenario.splitlines():
            if "氏名:" in line:
                print(line.split(":"))
                basic_info["name"] = line.split(":")[1].strip()
            if "性別:" in line:
                print(line.split(":"))
                basic_info["sex"] = line.split(":")[1].strip()
            if "年齢:" in line:
                print(line.split(":"))
                basic_info["age"] = line.split(":")[1].strip()
            if "場面設定:" in line:
                print(line.split(":"))
                basic_info["config"] = line.split(":")[1].strip()
        return basic_info
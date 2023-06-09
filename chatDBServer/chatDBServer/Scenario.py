from chatDBServer.DB_wrapper import ChatDB

import os
import json

class ScenarioManager:
    def __init__(self, spath="./chatDBServer/scenarios/") -> None:
        self.spath = spath
        self.chatdb = ChatDB()
 
    def get_scenarios_list(self):
        return os.listdir(self.spath)

    # 指定したファイルの読み込み
    def read_patient_scenario(self, user_id:int, room_id:int)->str:
        patient_id = -10
        # patient_id取得
        room = self.chatdb.read_room(room_id)
        patient_id = room[-1]       
        # userのdictを取得
        user_t = self.chatdb.get_user(user_id)
        patient_dict =  json.loads(user_t[2])
        # print(str(patient_id) in patient_dict.keys())
        if str(patient_id) in patient_dict.keys():
            filename = patient_dict[str(patient_id)]
            # print(filename)
            try:
                with open(self.spath+filename, mode="r", encoding="utf_8_sig") as f:
                    contents = f.read()
            except Exception as e:
                print(e)
            return contents
        else:
            print("patient_id:{0} was NOT FOUND in user:{1}".format(patient_id, user_id))
            return "Not Found"
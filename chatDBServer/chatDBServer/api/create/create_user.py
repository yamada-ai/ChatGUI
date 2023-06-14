from chatDBServer.DB_wrapper import ChatDB
from chatDBServer.Scenario import ScenarioManager
from chatDBServer.api.core.response import convert_for_response, bad_response
# from pokedix.domain.data_converter import convert_json
from chatDBServer.params import createUser, User, Room
from chatDBServer.utils import  get_datetime_str

import json
import os
import random

def decode_request(req:createUser):
    user = User(
        None,
        req.user_name,
        # ユーザごとのシナリオとの写像
        json.dumps(create_patient_mapping())
    )
    return user

def create_patient_mapping() -> dict:
    # シナリオのリストを取得
    smanager = ScenarioManager()
    sfiles = smanager.get_scenarios_list()
    sfiles_num = len(sfiles)
    # index_list = random.sample(list(range(files_num)), files_num)
    sfiles_sampled = random.sample(sfiles, sfiles_num)
    index_dict = dict()
    for i, sfile in enumerate(sfiles_sampled):
        index_dict[i+1] = sfile
    return index_dict

def create_patient_rooms(user:User, user_id):
    # シナリオ数に相当するルームを作成
    index_dict:dict = json.loads(user.patient_dict)
    rooms = []
    for i in index_dict.keys():
        room = Room(
            None,
            user_id,
            room_title="患者番号:{0}".format(i),
            room_created_at=get_datetime_str(),
            is_end=0,
            patient_id=i
        )
        rooms.append(room)
    return rooms

def handler(req:createUser):
    chatdb = ChatDB()
    try:
        user = decode_request(req)
        res = chatdb.create_user(user)
        patient_rooms = create_patient_rooms(user, user_id=chatdb.get_user_id(user.user_name))
        for pr in patient_rooms:
            code = chatdb.create_room(pr)
            if code["status code"] < 0:
                return convert_for_response(code)
        return convert_for_response(res)
    except Exception as e:
        print(bad_response(e))
        return bad_response(e)
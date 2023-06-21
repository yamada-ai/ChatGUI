from chatDBServer.DB_wrapper import ChatDB
from chatDBServer.Scenario import ScenarioManager
from chatDBServer.Prompt import Prompt
from chatDBServer.api.core.response import convert_for_response, bad_response
# from pokedix.domain.data_converter import convert_json
from chatDBServer.params import createChat, Chat
from chatDBServer.api._gpt_api import get_gpt_response
from chatDBServer.utils import *
import json
import os

def handler(user_id:int, room_id:int):
    smanager = ScenarioManager()
    try:
        sfile = smanager.get_scenario_filename(user_id, room_id)
        img_name = smanager.get_image_from_scenario(sfile)
        return img_name
    except Exception as e:
        print(bad_response(e))
        return bad_response(e)
        
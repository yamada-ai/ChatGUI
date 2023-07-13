from chatDBServer.DB_wrapper import ChatDB
from chatDBServer.Scenario import ScenarioManager
from chatDBServer.api.core.response import convert_for_response, bad_response
# from pokedix.domain.data_converter import convert_json
# from chatDBServer.params import createRoom, Room
from chatDBServer.utils import *
from chatDBServer.generetor import *


def handler(user_id:int, room_id:int):
    chatdb = ChatDB()
    smanager = ScenarioManager(spath="./chatDBServer/scenarios_original/")
    try:
        res = chatdb.read_chats(user_id, room_id)
        basic_info = smanager.extract_basic_info(user_id, room_id)
        return convert_for_response(basic_info)
    except Exception as e:
        print(bad_response(e))
        return bad_response(e)
        
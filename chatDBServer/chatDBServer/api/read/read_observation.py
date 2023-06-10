from chatDBServer.DB_wrapper import ChatDB
from chatDBServer.api.core.response import convert_for_response, bad_response
from chatDBServer.utils import *
from chatDBServer.generetor import *


def handler(user_id:int, room_id:int):
    chatdb = ChatDB()
    try:
        res = chatdb.read_observations(user_id, room_id)
        return convert_for_response([generate_Observation(r) for r in res])
    except Exception as e:
        print(bad_response(e))
        return bad_response(e)
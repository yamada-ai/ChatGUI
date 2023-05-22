from chatDBServer.DB_wrapper import chatDB
from chatDBServer.api.core.response import convert_for_response, bad_response
# from pokedix.domain.data_converter import convert_json
# from chatDBServer.params import createRoom, Room
from chatDBServer.utils import *


def handler(user_id:int, room_id:int):
    chatdb = chatDB()
    try:
        # room = decode_request(req)
        res = chatdb.delete_room(user_id, room_id)
        # res_json = {"pokemon":[ convert_json(r) for r in res]}
        return convert_for_response(res)
    except Exception as e:
        print(bad_response(e))
        return bad_response(e)
from chatDBServer.DB_wrapper import ChatDB
from chatDBServer.api.core.response import convert_for_response, bad_response
# from pokedix.domain.data_converter import convert_json
from chatDBServer.params import updateRoom, Room
from chatDBServer.utils import *

def decode_request(req:updateRoom):
    room = Room(
        req.room_id,
        req.user_id,
        req.new_room_title,
        None
    )
    return room


def handler(req:updateRoom):
    chatdb = ChatDB()
    try:
        room = decode_request(req)
        res = chatdb.update_room_title(room)
        # res_json = {"pokemon":[ convert_json(r) for r in res]}
        return convert_for_response(res)
    except Exception as e:
        print(bad_response(e))
        return bad_response(e)
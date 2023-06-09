from chatDBServer.DB_wrapper import ChatDB
from chatDBServer.api.core.response import convert_for_response, bad_response
# from pokedix.domain.data_converter import convert_json
# from chatDBServer.params import createRoom, Room
from chatDBServer.utils import *


def handler(user_name:str):
    chatdb = ChatDB()
    try:
        # room = decode_request(req)
        res = chatdb.get_user_id(user_name=user_name)
        # res_json = {"pokemon":[ convert_json(r) for r in res]}
        return convert_for_response({"user_id":res})
    except Exception as e:
        print(bad_response(e))
        return bad_response(e)
        
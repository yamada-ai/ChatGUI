from chatDBServer.DB_wrapper import ChatDB
from chatDBServer.api.core.response import convert_for_response, bad_response
# from pokedix.domain.data_converter import convert_json
# from chatDBServer.params import createRoom, Room
from chatDBServer.utils import *
from chatDBServer.generetor import *


# def decode_request(req:createRoom):
#     room = Room(
#         None,
#         req.user_id,
#         req.room_title,
#         get_datetime_str()
#     )
#     return room


def handler(user_id:int):
    chatdb = ChatDB()
    try:
        # room = decode_request(req)
        # 医療面接用
        res = chatdb.read_rooms_order_patientID(user_id)
        # res_json = {"pokemon":[ convert_json(r) for r in res]}
        return convert_for_response([ generate_Room(r) for r in res])
    except Exception as e:
        print(bad_response(e))
        return bad_response(e)
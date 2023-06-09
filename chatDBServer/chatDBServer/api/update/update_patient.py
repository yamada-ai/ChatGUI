from chatDBServer.DB_wrapper import ChatDB
from chatDBServer.api.core.response import convert_for_response, bad_response
# from pokedix.domain.data_converter import convert_json
from chatDBServer.params import updatePatient, Room
from chatDBServer.utils import *

def decode_request(req:updatePatient):
    room = Room(
        req.room_id,
        req.user_id,
        None,
        None,
        req.is_end,
        None
    )
    return room

def handler(req:updatePatient):
    chatdb = ChatDB()
    try:
        room = decode_request(req)
        res = chatdb.update_patient_status(room)
        # res_json = {"pokemon":[ convert_json(r) for r in res]}
        return convert_for_response(res)
    except Exception as e:
        print(bad_response(e))
        return bad_response(e)
from chatDBServer.DB_wrapper import ChatDB
from chatDBServer.Scenario import ScenarioManager
from chatDBServer.Prompt import Prompt
from chatDBServer.api.core.response import convert_for_response, bad_response
# from pokedix.domain.data_converter import convert_json
from chatDBServer.params import createObservation, Observation
from chatDBServer.api._gpt_api import get_gpt_response
from chatDBServer.utils import *
import json
import os


def decode_request(req:createObservation):
    smanager = ScenarioManager()
    prompter = Prompt()
    scenario = smanager.read_patient_scenario(req.user_id, req.room_id)

    context = []
    context.append({
        "role" : "user",
        "content" : prompter.apply_observation(scenario, req.user_text)
    })

    obs = Observation(
        obs_id=None,
        user_id=req.user_id,
        room_id=req.room_id,
        user_text=req.user_text,
        gpt_text=get_gpt_response(context),
        obs_created_at=get_datetime_str()
    )
    
    return obs


def handler(req:createObservation):
    chatdb = ChatDB()
    try:
        print(req)
        chat = decode_request(req)
        print(chat)
        res = chatdb.create_observation(chat)
        # res_json = {"pokemon":[ convert_json(r) for r in res]}
        return convert_for_response(res)
    except Exception as e:
        print(bad_response(e))
        return bad_response(e)
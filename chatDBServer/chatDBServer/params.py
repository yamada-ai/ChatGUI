from dataclasses import dataclass
from typing import List
from decimal import Decimal

@dataclass(frozen=True)
class User:
    user_id:int
    user_name:str
    patient_dict:str

@dataclass(frozen=True)
class Room:
    room_id:int
    user_id:int
    room_title: str
    room_created_at:str
    is_end:int
    patient_id:int

@dataclass(frozen=True)
class Chat:
    chat_id:int
    user_id:int
    room_id:int
    turn:int
    user_text:str
    gpt_text:str
    chat_created_at:str


# リクエストでくるbodyたち
from pydantic import BaseModel

class createUser(BaseModel):
    user_name: str

class createRoom(BaseModel):
    user_id:int
    room_title:str

class createChat(BaseModel):
    user_id:int
    room_id:int
    turn:int
    # is_bot:int
    user_text:str
    context:str
    # gpt_test:str
    # chat_created_at:str

class updateRoom(BaseModel):
    user_id:int
    room_id:int
    new_room_title:str

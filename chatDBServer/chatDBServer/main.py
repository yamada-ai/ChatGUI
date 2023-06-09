
# from pokedix.api.get_pokemon.handler import get_handler
from chatDBServer.api.create.create_user import handler as create_user_handler
from chatDBServer.api.create.create_room import handler as create_room_handler
from chatDBServer.api.create.create_chat import handler as create_chat_handler

from chatDBServer.api.read.get_user_id import handler as get_user_id_handler
from chatDBServer.api.read.read_rooms import handler as read_rooms_handler
from chatDBServer.api.read.read_chats import handler as read_chats_handler

from chatDBServer.api.update.update_room import handler as update_room_handler

from chatDBServer.api.delete.delete_room import handler as delete_room_handler

from chatDBServer.params import *


from chatDBServer.DB_wrapper import chatDB


from fastapi import FastAPI, UploadFile
from fastapi import Response
from fastapi.middleware.cors import CORSMiddleware

import speech_recognition as sr

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

db = chatDB()
db.create_all_tables()

"""
app.{HTTPメソッド}("{resource path}")
def 関数名
  return {response body}
"""


@app.get("/hello")
def hello():
    return {"message": "Hello World"}


# ユーザを追加する
@app.post("/api/user")
def create_user(req: createUser):
    # print("response", response, type(response))
    print("term", req, type(req))
    # response.headers["Access-Control-Allow-Origin"] = "*"
    # response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return create_user_handler(req)
    # return {"user_name": "hirasawa"}

# 部屋を作る
@app.post("/api/room")
def create_room(req: createRoom):
    return create_room_handler(req)


@app.post("/api/chat")
def create_chat(req : createChat):
    return create_chat_handler(req)

@app.get("/api/user/{user_name}")
def get_user_id(user_name):
    return get_user_id_handler(user_name)

@app.get("/api/room/{user_id}")
def read_rooms(user_id):
    return read_rooms_handler(user_id)

@app.get("/api/chat/{user_id}/{room_id}")
def read_rooms(user_id, room_id):
    return read_chats_handler(user_id, room_id)

# UPDATE
@app.put("/api/room")
def update_room(req: updateRoom):
    return update_room_handler(req)

# DELETE
@app.delete("/api/room/{user_id}/{room_id}")
def delete_room(user_id, room_id):
    return delete_room_handler(user_id, room_id)


# 音声認識
# @app.post("/api/transcribe")
# async def transcribe_audio(audio_blob : UploadFile):
#     print("file type", type(audio_blob))
#     print(audio_blob.filename)
#     # return {"filename": audio_blob.filename}
#     try:
#         # 音声ファイルを読み込み
#         audio = await audio_blob.read()
#         # 音声ファイルを音声認識
#         recognizer = sr.Recognizer()

#         with sr.AudioFile(audio) as source:
#             audio_data = recognizer.record(source)
#             transcription = recognizer.recognize_google(audio_data, language="ja-JP")

#         return {"transcription": transcription}
#     except Exception as e:
#         print("Error:", str(e))
#         return {"error": str(e)}

import tempfile
import os
import wave
import shutil

from pydub import AudioSegment


def convert_weba_to_wav(weba_file, wav_file):
    audio = AudioSegment.from_file(weba_file, format="webm")
    audio.export(wav_file, format="wav")


from chatDBServer.api.core.response import convert_for_response, bad_response

@app.post("/api/transcribe")
async def transcribe_audio(audio_blob: UploadFile):
    try:
        # 音声ファイルを一時ファイルに保存
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp, tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp2:
            tmp_path = tmp.name
            
            shutil.copyfileobj(audio_blob.file, tmp)
            wav_path = tmp2.name
            convert_weba_to_wav(tmp_path, wav_path)

            print(tmp_path, wav_path)   
        
        # 音声ファイルを音声認識
        recognizer = sr.Recognizer()

        with sr.AudioFile(wav_path) as source:
            audio_data = recognizer.record(source)
            transcription = recognizer.recognize_google(audio_data, language="ja-JP")

        # 一時ファイルを削除
        # os.remove(tmp_path)
        # os.remove(wav_path)

        # return {"transcription": transcription}
        return convert_for_response({"transcription": transcription})
     
    except Exception as e:
        import traceback
        print("\n\n\n")
        print("Error:", str(e))
        print(traceback.format_exc())
        print("\n\n\n")
        # return {"error": str(e)}
        return convert_for_response( {"error": str(e)})
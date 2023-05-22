- GET

- POST
    - curl -X POST -H "Content-Type: application/json" -d '{"user_name":"test1"}' localhost:8000/api/user

    - curl -X POST -H "Content-Type: application/json" -d '{"user_id":1, "room_title":"また運営が炎上してて草ww"}' localhost:8000/api/room

    - curl -X POST -H "Content-Type: application/json" -d '{"user_id":1, "room_id":1, "turn":1, "user_text":"最強のパーティ考えて", "context":"hoge"}' localhost:8000/api/chat

- PUT
    - curl -X PUT -H "Content-Type: application/json" -d '{"room_id":1, "user_id":1, "new_room_title":"	これが環境最強www(2)"}' localhost:8000/api/room

- DELETE
    - curl -X DELETE -H "Content-Type: application/json" localhost:8000/api/room/1/2

from flask import Flask, request
from flask_cors import CORS
from controllers.controllers import FileExp
from redis_config import RedisObj

from flask_socketio import SocketIO
app = Flask(__name__)


CORS(app , origins=["http://localhost:3000"])
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading" )

RedisObj.Rediconnect()

@app.route("/getuser")
def get_user():
    return FileExp.getUser()

@app.route("/getdata")
def get_data():
   return FileExp.Sendpath()

@app.route('/getpath' , methods=["POST"])
def getpath():
    return FileExp.get_directory(request)
    

@app.route("/rename" , methods=["PATCH"])
def Renamepath():
    return FileExp.renamepath(request)

 
@app.route('/delete' , methods=["DELETE"])
def delete():
    return FileExp.Del(request)


@app.route('/copy' , methods=["PUT"])
def copy():
    return FileExp.Copyfile(request)
    
@app.route('/move' , methods=["PUT"])
def move():
    return FileExp.move(request)
    

@socketio.on("searchfiles")
def search(data):
    search = data["searched"]
   
    sid = request.sid 
    socketio.start_background_task(FileExp.searchFiles, search, sid , socketio)


@app.route('/encryptfiles' , methods=["POST"])
def encrypt():
    return FileExp.encryptFiles(request)

@app.route('/decryptfiles' , methods=["POST"])
def decrypt():
    return FileExp.decryptFiles(request)

app.run(debug=True)
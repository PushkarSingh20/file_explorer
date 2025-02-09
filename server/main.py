from flask import Flask, request
from flask_cors import CORS
from controllers.controllers import FileExp



app = Flask(__name__)


CORS(app , origins=["http://localhost:3000"])

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
    

@app.route('/search' , methods=["POST"])
def search():
    return FileExp.searchFiles(request)



@app.route('/encryptfiles' , methods=["POST"])
def encrypt():
    return FileExp.encryptFiles(request)

@app.route('/decryptfiles' , methods=["POST"])
def decrypt():
    return FileExp.decryptFiles(request)

app.run(debug=True)
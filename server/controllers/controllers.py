import os
from flask import  jsonify 
import shutil
import psutil
from cryptography.fernet import Fernet
from concurrent.futures import ThreadPoolExecutor

class FIleExplorer:

    def __init__(self):
        self.partitions  =  psutil.disk_partitions()

    def GenerateFilekey(self):
         
         fernet_key = ""
         key = Fernet.generate_key()

         keypath = os.path.join(os.getcwd()  , "key.txt")
        
         if not os.path.exists(keypath):
            with open(keypath , "wb") as file:
                 file.write(key)
                 
        
         with open(keypath , "r") as readencfile:
              key = readencfile.read()
              if key:
                fernet_key = key
         

         if not fernet_key:

          
            with open(keypath , "wb") as keyfilewrite:
                    keyfilewrite.write(key)
            fernet_key = key

        
         
         return fernet_key.strip()

    def MainThreadFind(self, args):
        root, dir_name, file_name, search = args
        
    
        result = []
        
        if search in dir_name:
            result.append({"dirname": dir_name , "root" : root  })
            
        if search in file_name:
            result.append({"filename" : file_name , "root" : root})
        
        return result 
    
    def oslistdir(self, path):
        data = os.listdir(path)
        return data

    def Sendpath(self):
        
        drive_array= []
        
        for partition in self.partitions:
        
            data = shutil.disk_usage(partition.device)

            converted_total = data.total / 1073741824
            converted_used = data.used / 1073741824
            converted_free = data.free / 1073741824
        
            fileinpath = self.oslistdir(partition.device)
            
            dict = {"partition_name": partition.device, "total": converted_total, "used": converted_used, "free": converted_free , "fileindir" : fileinpath }
            
            drive_array.append(dict)
            
        
        return jsonify(data=drive_array)
    
    def getUser(self):
         return jsonify(username=os.getlogin())
          
    def get_directory(self, request):

        try:

            pathname = request.get_json()
            datatosend = []

            data = self.oslistdir(pathname["path"])
            for i in data:
                 if os.path.isdir(f"{pathname["path"]}/{i}"):
                        datatosend.append({ "isdir": True  , "size":  os.path.getsize(f"{pathname["path"]}/{i}") , "name": i , "path": f"{pathname["path"]}/{i}" , "ext": os.path.splitext(i)[-1]})
                 else:
                       datatosend.append({ "isdir": False  , "size":  os.path.getsize(f"{pathname["path"]}/{i}") , "name": i , "path" : f"{pathname["path"]}/{i}" , "ext": os.path.splitext(i)[-1]})
            
            return jsonify(pathdata = datatosend , success= True)
        except :
            return jsonify(error="An error occured!" ,  success= False)
        
    def renamepath(self, request):
        try: 
            data = request.get_json() 
        
            full_existing = data["fullpath"] + data["name"] 
            full_new = data["fullpath"] + data["new"]
            os.rename(full_existing , full_new)

            return jsonify(message=f"Renamed {full_existing} to {full_new}")
        except:
            return jsonify(error="An error occured!")
           
    def copyFile(self, request):
            try:
                data = request.get_json()
                full_existing = data["fullpath"] + data["file"] 
                destination_path = data["endpath"]
               
                shutil.copy(full_existing, destination_path)
                
                return jsonify(message=f"{full_existing} copied to {destination_path}")
            
            except :
                return jsonify(error="An error occured!")
            
    def Del(self, request):
            try:
                data = request.get_json()
               
                for i in data["files"]:
                    if os.path.isdir(i):
                        shutil.rmtree(i)
                    else:
                            os.remove(i)
                return jsonify(message=f"All files are deleted." , success=True)
            except :
                return jsonify(error= "An error occured" , success=False)
            
    def move(self, request):
            try:
                data = request.get_json()
                for i in data["files"]:
                 
                   
                    shutil.move(i, data["destination"])
                return jsonify(message="moved successfully!" , success = True)
            except : 
                return jsonify(error="An error occured!" , success = False)

    def multiCopy(self, request):
            try:

                data = request.get_json()
             
                for i in data["files"]:
                    pathname = data["fullpath"] +  i
                    os.chmod(pathname, 0o666)

                    if os.path.isdir(pathname):
                         shutil.copytree(pathname,  data["destination"])
                    else:
                         
                        shutil.copy(pathname, data["destination"])
                return jsonify(message="copyed successfully!")
            except:
                return jsonify(error="An error occured!")
 
    def searchFiles(self , request):
        try: 
            data = request.get_json()
            search = data["searched"]
      
            findings = []

            

            for i in self.partitions:

                    
                
                    for root, dirs, files in os.walk(i.mountpoint): 
                            args = [(root, dir_name, file_name , search  ) for dir_name in dirs for file_name in files ]

                            if len(findings) >= 500:
                                break
                            
                            
                            with ThreadPoolExecutor(max_workers=12) as exe:
                                results = exe.map(self.MainThreadFind, args)
                                
                                
                                for result in results:
                                    if len(findings) >= 500:
                                        break
                                    if result:
                                        findings.extend(result) 

                                      
            return jsonify(data=findings)
        except:
            return jsonify(error="An error occured")

    def encryptFiles(self, request):

        try: 
            reqdata = request.get_json()

            files = reqdata["files"]

            key = self.GenerateFilekey()
            
            if key:
                for file in files:
                  

                    if os.path.exists(file):
                        with open(file , "rb") as File:
                            fdata = File.read()
                          
                            f = Fernet(key)
                            encryptdata = f.encrypt(fdata)
                            
                        with open(file, "wb") as wFile:
                            
                            wFile.write(encryptdata)


                return jsonify(data="Provided files encrypted!")
            else:
                return jsonify(error="Key not found!")        
  

                  
                          
        except :
             return jsonify(error= "An error occured!")
             
    def decryptFiles(self, request):
        try: 
            reqdata = request.get_json()

            files = reqdata["files"]

            key = self.GenerateFilekey()
            
            if key:
                for file in files:
                   
                    if os.path.exists(file):
                        with open(file , "rb") as File:
                            fdata = File.read()
                           
                            f = Fernet(key)
                            decrypteddata = f.decrypt(fdata)
                            
                        with open(file, "wb") as wFile:
                            
                            wFile.write(decrypteddata)


                return jsonify(data="Provided files decrypted!")
            else:
                return jsonify(error="Key not found!")
            
        except:
             return jsonify(error= "An error occured!")

FileExp = FIleExplorer()


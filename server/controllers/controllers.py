import os
from flask import  jsonify 
import shutil
import psutil
from cryptography.fernet import Fernet
from concurrent.futures import ThreadPoolExecutor
import json
import stat

ENCRYPTED_FILES_META = "encrypted_file.json"

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

    def load_encryptedfiles(self):
    
            
            if os.path.exists(ENCRYPTED_FILES_META):
                
                with open(ENCRYPTED_FILES_META , "r") as File:
                    
                    return json.load(File)
            else:
                with open(ENCRYPTED_FILES_META , "w") as F:
                    json.dump({} , F)

                return {}
      
        
    def is_alreadypresent(self , filepath):

        try: 

            encryptedfiles = self.load_encryptedfiles()
            
            if encryptedfiles.get(os.path.abspath(filepath)):
                return {"encryption_error" : False,  "found" : True}
            else:
                return {"encryption_error" : False,   "found" : False}

        except:
            
            return  {"encryption_error" : True}


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
                        
                        datatosend.append({ "isdir": True , "name": i , "path": f"{pathname["path"]}/{i}" , "ext": os.path.splitext(i)[-1]})
                 else:
                       datatosend.append({ "isdir": False  , "name": i , "path" : f"{pathname["path"]}/{i}" , "ext": os.path.splitext(i)[-1]})
            
            return jsonify(pathdata = datatosend , success= True)
        except:
            return jsonify(error="An error occured!" ,  success= False)
        
    def renamepath(self, request):
        try: 
            data = request.get_json() 
        
            full_existing =  data["name"] 
            full_new =  data["new"]
            os.rename(full_existing , full_new)

            return jsonify(message=f"Renamed {full_existing} to {full_new}" , success=True)
        except:
            return jsonify(error="An error occured!" , success=False)
    
    def SaveEncrypted(self, filepath):
        
        encrypted_files = self.load_encryptedfiles()
        encrypted_files[filepath] = True 
        
        with open(ENCRYPTED_FILES_META, "w") as f:
            json.dump(encrypted_files, f)
        
    def RmEncrypted(self, filepath) : 
        try: 
            encrypted_files = self.load_encryptedfiles()

            if os.path.abspath(filepath) in encrypted_files : 
                
                    del encrypted_files[os.path.abspath(filepath)]
                    with open(ENCRYPTED_FILES_META , "w") as f:
                        json.dump(encrypted_files , f)
        except:
            return  jsonify(success=False , message="Error in encryption_file.json!")
        
    def Del(self, request):
            try:
                data = request.get_json()
    
                for i in data["files"]:
                    if not os.access(i, os.W_OK):
                        os.chmod(i, stat.S_IWUSR)

                    if os.path.isdir(i):
                        shutil.rmtree(i)
                    else:
                            os.remove(i)
                return jsonify(message=f"All files are deleted." , success=True)
            except Exception as e:
                print(e)
                return jsonify(error= "An error occured" , success=False)
            
    def move(self, request):
            try:
                data = request.get_json()
                for i in data["files"]:
                 
                   
                    shutil.move(i, data["destination"])
                return jsonify(message="moved successfully!" , success = True)
            except : 
                return jsonify(error="An error occured!" , success = False)

    def Copyfile(self, request):
        
            try:

                data = request.get_json()
             
                for i in data["files"]:

                    pathname =   i
                    
                
                    if os.path.isdir(pathname):
                         
                         shutil.copytree(pathname,  os.path.join( data["destination"] , os.path.basename(pathname)))
                         
                    else:

                        shutil.copy(pathname,  os.path.join( data["destination"] , os.path.basename(pathname)))

                return jsonify(message="copied successfully!" , success=True)

            except:
                return jsonify(error="An error occured!" , success=False)
 
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
            
            def file_encrypt(filepath):
                try:

                    with open(filepath, "rb") as File:
                        fdata = File.read()
                    
                    f = Fernet(key)
                    encryptdata = f.encrypt(fdata)

                    with open(filepath, "wb") as wFile:
                        wFile.write(encryptdata)

                except PermissionError:
                    return jsonify(error="Permission error!", success=False)
                except Exception as e:
                     return jsonify(error="Error while encrypting!", success=False)

            if key:
                for file in files:
                    if self.is_alreadypresent(file)["encryption_error"] == True:
                        return jsonify(message="Error in encrypted_file.json", success=False)

                    elif self.is_alreadypresent(file)["found"]:
                        return jsonify(message=f"{file} Already encrypted!", success=False)



                    full_path = os.path.abspath(file)

                    if os.path.isdir(full_path):  
                        for root, _, filenames in os.walk(full_path):
                            for filename in filenames:
                                file_encrypt(os.path.join(root, filename))  
                    else:
                        file_encrypt(full_path)

                    self.SaveEncrypted(os.path.abspath(file))
                return jsonify(data="Provided files encrypted!", success=True)
            else:
                return jsonify(error="Key not found!", success=False)

        except:
            return jsonify("An error occured!", success=False)

    def decryptFiles(self, request):
        try: 

            def Decrypt(file):
                try: 
                    with open(file , "rb") as File:
                        fdata = File.read()
                            
                    f = Fernet(key)
                    decrypteddata = f.decrypt(fdata)
                                
                    with open(file, "wb") as wFile:
                                
                        wFile.write(decrypteddata)
                    
                except PermissionError:
                    return jsonify(error="Permission error!", success=False)
                except Exception as e:
                     return jsonify(error="Error while decrypting!", success=False)
                
            reqdata = request.get_json()

            files = reqdata["files"]

            key = self.GenerateFilekey()
            
            if key:
                for file in files:
                    absfillname = os.path.abspath(file)
                    if os.path.isdir(absfillname):
                        for root , _ , filenames in os.walk(absfillname):
                            for filename in filenames:
                                Decrypt(os.path.join(root,  filename))
                    if os.path.exists(absfillname):
                       Decrypt(absfillname)
                    else:
                         return jsonify(error="No such file or directory!" , success=False)
                    self.RmEncrypted(file)
                return jsonify(data="Provided files decrypted!" , success=True)
            else:
                return jsonify(error="Key not found!" , success=False)
            
        except Exception as e:
             print(e , "here")
             return jsonify(error= "An error occured!" , success=False)
    
FileExp = FIleExplorer()


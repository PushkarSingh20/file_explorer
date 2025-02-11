import redis
import json
class Redis_server:
    def __init__(self , r):
        self.r = r

    def Rediconnect(self):
        try:   
            

            if self.r.ping():
                print("Connected to Redis successfully!")
            else:
                print("Connection to Redis failed!")



        except redis.ConnectionError as e:
            print(f"Redis connection error: {e}")

    def Redis_set(self , key , values):
        
        try: 
         
            data = json.dumps(values)
            self.r.set(key , data )
            return True
        except Exception  as e:
            print(e)
            return False
        
    def Redis_get(self , key ):
        try: 
            data = self.r.get(key)
       
            if data:
                return {"data" : json.loads(data) , "error": False}
            else:
                return {"data" : None , "error": False}
        except:
            return {"error" : True}

RedisObj = Redis_server(redis.Redis(host='localhost', port=6379, decode_responses=True))


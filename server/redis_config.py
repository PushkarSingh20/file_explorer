import redis

class Redis_server:
    def Rediconnect(self):
        try:   
            r = redis.Redis(host='localhost', port=6379, decode_responses=True)

            if r.ping():
                print("Connected to Redis successfully!")
            else:
                print("Connection to Redis failed!")



        except redis.ConnectionError as e:
            print(f"Redis connection error: {e}")


RedisObj = Redis_server()


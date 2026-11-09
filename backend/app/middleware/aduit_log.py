import time
from fastapi import Request

async def log_request(req:Request,call_next):
    start_time = time.perf_counter()
    print("time:",time.time())
    print("method name:",req.method)
    print("url:",req.url)
   

    response=await call_next(req)

    time_taken=time.perf_counter()-start_time

    print("time_taken:",time_taken)
    print("Status_code:",response.status_code)

    return response
import time

from fastapi import Request
from starlette.concurrency import run_in_threadpool

from app.database import SessionLocal
from app.models import RequestLog


def save_request_log(log_data: dict):
    db = SessionLocal()

    try:
        log = RequestLog(**log_data)

        db.add(log)
        db.commit()

    except Exception as e:
        db.rollback()
        print("Failed to save request log:", e)

    finally:
        db.close()


async def log_request(req: Request, call_next):

    start_time = time.perf_counter()

    response = await call_next(req)

    time_taken = time.perf_counter() - start_time

    log_data = {
        "method": req.method,
        "path": req.url.path,
        "status_code": response.status_code,
        "process_time_ms": round(time_taken * 1000, 3),
        "client_ip": req.client.host if req.client else None
    }

    await run_in_threadpool(save_request_log, log_data)

    return response
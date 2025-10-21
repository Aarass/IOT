from datetime import datetime
from typing import List

from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    datetime: datetime
    active_energy: float


class Body(BaseModel):
    items: List[Item]


app = FastAPI()


@app.post("/items/")
async def create_item(body: Body):
    print(body)
    return body

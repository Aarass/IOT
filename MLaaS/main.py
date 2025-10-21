from datetime import datetime
from typing import List

import joblib
from fastapi import FastAPI
from pydantic import BaseModel

model = joblib.load("./training/ml_model.pkl")


class Item(BaseModel):
    id: int
    sensorId: str
    datetime: datetime
    activeEnergy: float
    globalReactivePower: float
    voltage: float
    globalIntensity: float


class Body(BaseModel):
    items: List[Item]


app = FastAPI()


@app.post("/predict")
async def create_item(body: Body):
    print(body)

    res = model.predict()
    return body

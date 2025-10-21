from datetime import datetime
from typing import List

import joblib
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel


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


model = joblib.load("./training/ml_model.pkl")
app = FastAPI()


@app.post("/predict")
async def create_item(body: Body):
    # print(body)

    items = body.items

    active_energy_values = [item.activeEnergy for item in items[:60]]

    dt = items[0].datetime
    hour = dt.hour
    day_of_week = dt.weekday()  # 0=ponedeljak, 6=nedelja

    hour_sin = np.sin(2 * np.pi * hour / 24)
    hour_cos = np.cos(2 * np.pi * hour / 24)
    dow_sin = np.sin(2 * np.pi * day_of_week / 7)
    dow_cos = np.cos(2 * np.pi * day_of_week / 7)

    final_array = np.array(
        active_energy_values + [hour_sin, hour_cos, dow_sin, dow_cos], dtype=float
    ).reshape(1, 64)

    res = model.predict(final_array)[0]
    return {"predict": res}

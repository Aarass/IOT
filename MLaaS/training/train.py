import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split

df = pd.read_csv(
    "./data.csv",
    delimiter=";",
    usecols=[
        "Date",
        "Time",
        "Global_active_power",
        "Sub_metering_1",
        "Sub_metering_2",
        "Sub_metering_3",
    ],
)

df["datetime"] = pd.to_datetime(
    df["Date"] + " " + df["Time"], format="%d/%m/%Y %H:%M:%S"
)

df = df.drop(columns=["Date", "Time"])

df["hour"] = df["datetime"].dt.hour
df["minute"] = df["datetime"].dt.minute
df["day_of_week"] = df["datetime"].dt.dayofweek

# kružna reprezentacija sata u danu (da 23h i 0h budu blizu)
df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)

# kružna reprezentacija dana u nedelji
df["dow_sin"] = np.sin(2 * np.pi * df["day_of_week"] / 7)
df["dow_cos"] = np.cos(2 * np.pi * df["day_of_week"] / 7)

df = df.drop(columns=["datetime", "hour", "minute", "day_of_week"])

df["activeEnergy"] = (
    df["Global_active_power"] * 1000 / 60
    - df["Sub_metering_1"]
    - df["Sub_metering_2"]
    - df["Sub_metering_3"]
)

df = df.drop(
    columns=[
        "Global_active_power",
        "Sub_metering_1",
        "Sub_metering_2",
        "Sub_metering_3",
    ]
)


def create_dataset(df, n_past=60, n_future=600):
    X, y = [], []
    values = df["activeEnergy"].values

    for i in range(len(values) - n_past - n_future):
        past_energy = values[i : i + n_past]

        # uzmi vreme prvog merenja u prozoru
        first_row = df.iloc[i]

        # spoji energiju + vremenske feature-e u jedan niz
        input_vector = np.concatenate(
            [
                past_energy,
                [
                    first_row["hour_sin"],
                    first_row["hour_cos"],
                    first_row["dow_sin"],
                    first_row["dow_cos"],
                ],
            ]
        )

        # target: prosečna potrošnja u narednih n_future
        future_avg = np.mean(values[i + n_past : i + n_past + n_future])

        X.append(input_vector)
        y.append(future_avg)

    return np.array(X), np.array(y)


X, y = create_dataset(df)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, shuffle=False  # vremenski red, bez mešanja
)

model = LinearRegression()
model.fit(X_train, y_train)


y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
print("MAE:", mae)

joblib.dump(model, "ml_model.pkl")

# #
# #
# #
# #
# # uzmi poslednjih 60 merenja iz tabele
# test = np.concatenate(
#     [[podniz[4] for podniz in df.values[-60:]], df.values[-60][:-1]]
# ).reshape(1, -1)
# assert len(test[0]) == 64
#
# print(test)
#
# prediction = model.predict(test)[0]
# print("Predvidjena prosecna potrosnja u narednih 10 minuta:", prediction)

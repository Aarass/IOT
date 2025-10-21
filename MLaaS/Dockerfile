FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./training/ml_model.pkl /code/app/training/ml_model.pkl
COPY ./main.py /code/app/main.py

WORKDIR /code/app
CMD ["fastapi", "run", "main.py", "--port", "8000"]

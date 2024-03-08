FROM python:3.10-slim

WORKDIR /app/
RUN apt-get update
RUN apt-get install -y build-essential gcc libc6-dev wget
RUN apt-get update && apt-get install -y --no-install-recommends libpq-dev musl-dev unzip libaio-dev postgresql-client

RUN pip install pipenv
COPY ./backend/Pipfile* ./
RUN pipenv install --verbose --system
COPY ./backend/* ./
COPY ./.env ./

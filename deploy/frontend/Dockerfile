FROM node:current-buster
WORKDIR /web/

COPY ./frontend/package* ./
RUN npm install

COPY ./frontend/ ./
COPY ./.env ./
RUN npm run build

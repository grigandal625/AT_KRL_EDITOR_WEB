FROM node:current-buster as build-stage
WORKDIR /app/

COPY ./frontend/package* ./
RUN npm install

COPY ./frontend/ ./
COPY ./.env ./
RUN ls
RUN npm run build

FROM nginx:latest as production-stage

COPY ./deploy/roles/prepare/files/nginx-frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE ${FRONTEND_PORT}
CMD ["nginx", "-g", "daemon off;"]

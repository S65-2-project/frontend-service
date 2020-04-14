FROM nginx:1.16.0-alpine

WORKDIR .

COPY ./build /var/www/

ENTRYPOINT ["nginx", "-g", "daemon off;"]
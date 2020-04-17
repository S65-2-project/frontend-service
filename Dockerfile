FROM nginx:1.16.0-alpine

COPY ./build /var/www/

ENTRYPOINT ["nginx", "-g", "daemon off;"]
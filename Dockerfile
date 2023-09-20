FROM nginx:latest

LABEL key="MVPfront"

COPY . /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
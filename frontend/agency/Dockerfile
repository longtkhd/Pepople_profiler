FROM node:12.16.1 as build-stage
WORKDIR /app

# for caching optimisations
COPY package.json ./
RUN npm install

# required to serve the react app on the live server
COPY . .
RUN npm i cross-env
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
# Copy nginx conf
RUN mkdir -p /var/www/html
RUN mkdir -p /var/www/html/assets
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/build /var/www/html/
COPY assets /var/www/html/assets

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
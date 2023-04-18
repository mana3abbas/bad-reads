FROM node:12 AS ui-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build



FROM nginx:1.15
COPY --from=ui-build /app/build /usr/share/nginx/html
COPY /nginx/default.conf /etc/nginx/conf.d/default.conf 
EXPOSE 3000

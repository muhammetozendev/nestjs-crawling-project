FROM node:18-alpine
COPY . /app
WORKDIR /app
RUN npm install
RUN npm build
EXPOSE 80
CMD ["npm", "run", "start:prod"]

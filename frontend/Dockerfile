FROM node:current-alpine3.23
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8080
CMD ["npm", "run", "dev"]
FROM node:alpine as base
WORKDIR app/
COPY package.json package-lock.json .
RUN npm install
COPY . .
EXPOSE 80
CMD ["npm", "start"]

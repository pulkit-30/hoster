FROM node:alpine
WORKDIR app/
COPY package.json .
COPY package-lock.json .
RUN npm install
EXPOSE 80
CMD ["npm", "start"]

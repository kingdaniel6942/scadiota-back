FROM node:20.5.1
WORKDIR /app/scadiota
COPY ./ ./
RUN npm install
CMD [ "npm", "start" ]
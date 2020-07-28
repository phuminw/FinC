FROM node AS finc
WORKDIR /FinC
COPY ./server/ ./
COPY ./package.json.express ./package.json
RUN npm install
EXPOSE 80
CMD node server.js
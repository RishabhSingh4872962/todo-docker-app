FROM node:20-alpine as Development

WORKDIR /develop/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine as Production

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

WORKDIR /prod/app

COPY package*.json .

RUN npm ci --only=production

COPY --from=Development /develop/app/dist ./src

CMD [ "node","src/server.js" ]

# ./app   node_modules
#         src
#         dist/src
# 
#
#
#
#
FROM node:latest as builder

WORKDIR '/app'

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile 

COPY . .

RUN yarn build


FROM nginx:latest

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html
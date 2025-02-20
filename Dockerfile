# maphub-website/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
EXPOSE 3000
# TODO make sure env files etc are not copied
CMD ["sh", "-c", "[ ! -d '.next' ] && yarn build || true; yarn start"]
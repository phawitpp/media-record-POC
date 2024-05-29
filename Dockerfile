FROM node:18-alpine

WORKDIR /recording-poc

EXPOSE 8006

COPY package.json package-lock.json ./

RUN npm install --silent

COPY . ./

CMD ["npm", "run", "dev"]
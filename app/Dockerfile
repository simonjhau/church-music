# Pull official base image
FROM node:16

# Set working directory
WORKDIR /app

COPY package.json ./

RUN npm install

COPY . ./

CMD ["npm", "start"]
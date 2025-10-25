FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY index.js ./
COPY models ./models
EXPOSE 5000
CMD ["node", "index.js"]


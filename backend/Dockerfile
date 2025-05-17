FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
ENV NODE_ENV=production
ENV DB_URL=mongodb://mongo:27017/music
RUN npm run seed:songs && npm run seed:albums
EXPOSE 3000
CMD ["npm", "run", "start"]
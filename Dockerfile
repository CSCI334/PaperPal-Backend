FROM node:lts-alpine as build
WORKDIR /backend
ENV TZ="Australia/NSW"
COPY *.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine
WORKDIR /backend
ENV TZ="Australia/NSW"
COPY --from=build /backend/package.* ./
COPY --from=build /backend/dist ./dist
COPY --from=build /backend/node_modules ./node_modules
CMD ["node", "./dist/bootstrap.js"]
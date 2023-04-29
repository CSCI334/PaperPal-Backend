FROM node:lts-alpine as build
WORKDIR /backend
ENV TZ=Australia/NSW
COPY *.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine
WORKDIR /backend
ENV TZ=Australia/NSW
COPY --from=build /backend/package.* ./
RUN npm install --production
COPY --from=build /backend/dist ./dist
CMD ["node -r", "./tsconfig-paths-bootstrap.js", "./dist/bootstrap.js"]
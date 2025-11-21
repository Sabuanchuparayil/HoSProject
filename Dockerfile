# ---------- Build Stage ----------
FROM node:22-alpine AS build
WORKDIR /app

# disable Docker caching
ARG CACHEBUST=1

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Serve Stage ----------
FROM node:22-alpine
WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist /app/dist

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "serve -s /app/dist -l $PORT"]

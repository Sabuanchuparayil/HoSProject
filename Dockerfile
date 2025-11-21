# Force rebuild
ARG RAILWAY_NOCACHE

# ---------- Build Stage ----------
FROM node:22-alpine AS build
ARG RAILWAY_NOCACHE

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Serve Stage ----------
FROM node:22-alpine
ARG RAILWAY_NOCACHE

WORKDIR /app
RUN npm install -g serve

COPY --from=build /app/dist /app/dist

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "serve -s /app/dist -l $PORT"]

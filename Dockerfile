# ---------- Build Stage ----------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Production Stage ----------
FROM node:22-alpine

WORKDIR /app

# Install a lightweight static server
RUN npm install -g serve

# Copy built dist folder
COPY --from=build /app/dist ./dist

# Expose production port
EXPOSE 5173

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "5173"]
# CACHE-BUST=1763653034

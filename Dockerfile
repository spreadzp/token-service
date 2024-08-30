FROM node:20.11.1-alpine3.19 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY ./ ./ 
RUN npm run build

FROM node:20.11.1-alpine3.19 AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist/ ./dist  
EXPOSE 3000 
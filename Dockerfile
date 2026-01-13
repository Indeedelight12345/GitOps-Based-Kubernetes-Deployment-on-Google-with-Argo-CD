# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./


RUN npm install


COPY . .

RUN npm run build


# ---------- Runtime stage ----------
FROM nginx:alpine AS runner

# Remove default nginx config (NO sudo in Docker!)
RUN rm -f /etc/nginx/conf.d/default.conf


COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

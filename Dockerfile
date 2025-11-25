FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install dependencies
RUN npm ci

# Copy source files
COPY . .

# Clean any existing build artifacts and build fresh
RUN rm -rf dist && npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
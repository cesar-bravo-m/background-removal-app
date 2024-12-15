# Use Node.js LTS version as the base image
FROM node:23-alpine

# Set working directory in container
WORKDIR /app

RUN mkdir -p /app/uploads
# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
RUN npm run build

CMD ["npm", "start"]
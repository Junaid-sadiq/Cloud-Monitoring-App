# Use Node.js base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the entire Next.js codebase
COPY . .

# Expose port 3000 for Next.js
EXPOSE 3000

# Set environment variables to ensure the app listens on all interfaces
ENV HOST 0.0.0.0
ENV PORT 3000

# Start the Next.js development server
CMD ["npm", "run", "dev"]
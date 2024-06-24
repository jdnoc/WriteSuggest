# Use the official Node.js image
FROM node:14

# Create and change to the app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the app code
COPY . .

# Build the app for production
RUN npm run build:prod

# Expose the port the app runs on
EXPOSE 3000

# Run the app
CMD ["npm", "start"]

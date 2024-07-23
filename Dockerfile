# Use the official Node.js image for development.
FROM node:18

# Set the working directory in the container.
WORKDIR /usr/src/app

# Install development dependencies.
COPY package*.json ./
RUN npm install

# Copy the rest of the application code.
COPY . .

# Install nodemon for development.
RUN npm install -g nodemon

# Expose port 3000.
EXPOSE 3000

# Command to run the application with nodemon for live reloading.
CMD [ "nodemon", "index.js" ]



# Use the official Node.js image.
FROM node:18-slim

# Set the working directory in the container.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json.
COPY package*.json ./

# Install dependencies.
RUN npm install --only=production

# Copy the rest of the application code.
COPY . .

# Expose port 3000.
EXPOSE 3000

# Command to run the application.
CMD [ "node", "index.js" ]




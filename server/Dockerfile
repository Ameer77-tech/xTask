# node-js LTS Image
FROM node:20-alpine

# working directory
WORKDIR /xTask

# Copy package.json and package-lock.json
COPY package*.json ./ 

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port your backend uses
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]



# Install node v10
FROM node:10

# Set the workdir /opt/develop/app/leaderboard
WORKDIR /opt/develop/app/leaderboard/

# Copy the package.json to workdir
COPY ./app/package.json ./

# Run npm install - install the npm dependencies
RUN npm install

# Copy application source, will copy env.docker too (useless) I need .env
COPY ./app/ .

# Copy .env.docker to workdir/.env - use the docker env
COPY ./app/env.docker ./.env

# Expose application ports - (4300 - for API and 4301 - for front end)
EXPOSE 8080 8080

# Generate build
#RUN npm run build

# Install
RUN npm install

# Start the application
CMD ["npm", "start"]

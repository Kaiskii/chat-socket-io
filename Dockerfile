# Base Node File from Docker Hub
FROM node:12.14.1 AS base

# Creates App Directory
WORKDIR /usr/src/app

# Install App Dependencies
COPY package*.json ./

# Development
RUN npm install

COPY . .

# Creating an Env Var for Port 4000
ENV port=4000

# Exposing the Port
EXPOSE ${port}

# Command npm run dev
CMD npm run dev-node
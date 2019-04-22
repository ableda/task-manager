# Task Manager Application

Simple task management application that lets you get, create, edit and delete tasks as well as filter them based on due date and completion.

Set up for local development with Vue, Express, Node, Mongo and Docker-compose. Hot Reload, SASS live compilation, among other goodies :)

## Getting Started

### Prerequisites

Docker and Docker compose (https://docs.docker.com/install/)
Node and npm (https://nodejs.org/en/download/)

### Steps to Run

1. Clone this repository

> git clone https://github.com/ableda/task-manager.git

2. Navigate into the directory task-manager and copy environment variables

> cd your-path-to/task-manager

> cp example.env .env

3. Build Docker Images

> docker-compose build

4. Run the stack :)

> docker-compose up

Your app should be running on (if using native docker):

http://localhost:8080

Be patient and wait for all for all of the NPM warnings to finish - this will only happen once.

To run in the background you can also run `docker-compose up -d`

### Configuration

There are 3 parts to this dockerized Vue app: Frontend (Vue), Backend (Node with Express), and Database (MongoDB).

The frontend is in the 'client' folder, backend in the 'server' folder, and the database is mounted to your current directory in the 'db' folder.

NPM apps are a bit tricky to install in Docker, because the binaries have to be installed in the container. Though there are several solutions to this, I prefer the approach using the 'docker/entrypoint.sh' scripts that are in the 'client' and 'server' directories.

Be sure to change the environment variables (DB_URL, API_URL) in example.env and then run
> cp example.env .env

Default should work if running on localhost.

### Testing

Make sure to build the docker images first with
> docker-compose build

##### Server
To run server tests with their own docker container
> sh test_server.sh

or locally
> cd server && npm test

##### Client
To run client unit tests
> cd client && npm run unit

e2e tests ready but not implemented (nightwatch)

### API Documentation

Swagger UI integrated into the nodejs application and in the comments of all the routes

After services are up, documentation is accessible at API_URL/api-docs (localhost:8081/api-docs if running with default configuration)

### Warnings

Warning: If you run 'npm install' locally in the server or client folders, you'll need to delete 'node_modules' before running again with the docker setup. The binaries need to be install in the container's OS to work.

## Built With

* [Vue](https://vuejs.org/) - The client web framework used
* [Express](https://github.com/expressjs/expressjs.com) - The server web framework used

## Authors

* **Alex Bleda** (https://github.com/ableda)

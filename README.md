# Task Manager Application
Vue, Express, Node, Mongo with Docker-compose setup for local development. Hot Reload, SASS live compilation, among other goodies :)

The application lets you

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

Your app should be running on (if using native docker).:

http://localhost:8080

Be patient and wait for all for all of the NPM warnings to finish - this will only happen once.


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

To run server tests
> sh test_server.sh

### Warnings

Warning: If you run 'npm install' locally in the server or client folders, you'll need to delete 'node_modules' before running again with the docker setup. The binaries need to be install in the container's OS to work.

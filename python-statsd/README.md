# App to send metrics through DogStatD

This app is using the Datadog agent in a container.

## Requirements

- Ubuntu (>= 16.04.x/Xenial)
- Docker (>= 1.9.0)
- Docker-compose ([docs to install/upgrade](https://docs.docker.com/compose/install/))

## Installation steps

### Step 1: Clone this repo

- Go to your working directory.
- Clone this repo:
    - option 1: `git clone git@github.com:nxnarbais/dd-partner-app.git`
    - option 2: `git clone https://github.com/nxnarbais/dd-partner-app`
- Move to relevant directory: `cd dd-partner-app/python-statsd`

### Step 2: Configure the containerized agent

- Copy environment file example: `cp .env.example .env`
- Edit `.env` file: `vim .env`
    - Select the relevant site: `datadoghq.com` or `datadoghq.eu`
    - Add your API key

### Step 3: Edit some parameters on the agent

- Open the `docker-compose.yaml` file: `vim docker-compose.yaml`
- On the datadog container, edit:
    - DD_HOSTNAME: the name of the host that will be displayed in the platform
    - DD_TAGS: some tags that will be associated to all the metrics, logs and apm going through the agent. (Recommended: team, owner, environment, etc.)

## Start the application

Create a docker network:

```
docker network create my-net
```
Note: If you get a `permission denied`, preface the `docker` commands with `sudo`. To avoid that going forward, you can add your user to the Unix group called docker (`sudo usermod -aG docker $USER`) and reload your terminal.

Note: If you get `'network' is not a docker command`, [upgrade Docker to >= 1.9.0](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

**Warning**: If you have an other agent running on the machine, make sure to stop it before starting this new application.

Start all the containers from the docker-compose file (Note: make sure to be in the `dd-partner-app/nodejs-dummy` directory):

```
docker-compose up -d
```

Note: If you get the following error, you must upgrade Ubuntu to >= 16.04

```
ERROR: for datadog-agent  Cannot start service datadog: OCI runtime create failed: container_linux.go:348: starting container process caused "process_linux.go:297: copying bootstrap data to pipe caused \"write init-p: broken pipe\"": unknown
```

At this point you should have two endpoints available:

- http://localhost:8081 to visualize what is inside your database
- http://localhost:8080 to see your application running


If you want to see the logs for debug

```
docker-compose logs -f
```

At that point, you should see some logs coming into the platform as well as some metrics, a host, a container, etc.

# App to get started with Datadog

This app is using the Datadog agent in a container.

## Requirements

- Node should be available
- Docker should be available (including docker-compose)

## Installation steps

### Step 1: Clone this repo

- Go to your working directory.
- Clone this repo:
    - option 1: `git clone git@github.com:nxnarbais/dd-partner-app.git`
    - option 2: `git clone https://github.com/nxnarbais/dd-partner-app`
- Move to created directory: `cd dd-partner-app`

### Step 2: Clone demoapp

- In the same directory (`dd-partner-app`), clone demo app:
    - option 1: `git clone git@github.com:benc-uk/nodejs-demoapp.git app`
    - option 2: `git clone https://github.com/benc-uk/nodejs-demoapp app`
- Move to cloned app: `cd app/`
- Install node dependencies: `npm install`
- Check that this is working well:
    - Start the app: `npm start`
    - Go to http://localhost:3000
- Now the app should work! You can stop the server with `CTRL + C`

### Step 3: Configure the containerized agent

- Go back to parent directory: `cd ..` (`dd-partner-app` directory)
- Copy environment file example: `cp .env.example .env`
- Edit `.env` file: `vim .env`
    - Select the relevant site: `datadoghq.com` or `datadoghq.eu`
    - Add you API key

### Step 4: Check the project structure

Note: not all the files are shown here

```
- dd-partner-app
    - app
        - server.js
        - route.js
        - etc.
    - .env
    - .env.example
    - .gitignore
    - docker-compose.yaml
    - mongo-init.js
    - README.md
```

### Step 5: Edit some parameters on the agent

- Open the `docker-compose.yaml` file: `vim docker-compose.yaml`
- On the datadog container, edit:
    - DD_HOSTNAME: the name of the host that will be displayed in the platform
    - DD_TAGS: some tags that will be associated to all the metrics, logs and apm going through the agent. (Recommended: team, owner, environment, etc.)

## Start the application

Create a docker network:

```
docker network create my-net
```

**Warning**: If you have an other agent running on the machine, make sure to stop it before starting this new application.

Start all the containers from the docker-compose file (Note: make sure to be in the `dd-partner-app` directory):

```
docker-compose up -d
```

At this point you should have two endpoints available:

- http://localhost:8081 to visualize what is inside your database
- http://localhost:8080 to see your application running


If you want to see the logs for debug

```
docker-compose logs -f
```

At that point, you should see some logs coming into the platform as well as some metrics, a host, a container, etc.

## Instrument APM

To start to see some traces within the Datadog platform, you will need to instrument the application.

```
cd app/
npm install --save dd-trace
```

Go into `server.js` and add:

```
const tracer = require('dd-trace').init()
```

(Note: This code could be added below the first debug line: `console.log('### Node.js demo app starting...');`)

At this point, you should see some services in the APM service page: [US](https://app.datadoghq.com/apm/services) [EU](https://app.datadoghq.eu/apm/services)

### Going further with APM

Some additional parameters can be added on the tracer. You can for instance replace the tracer initialization by:

```
const tracer = require('dd-trace').init({
  logInjection: true,
  analytics: true,
  runtimeMetrics: true,
  tags: {
    serviceteam: "dogdemo"
  },
})
```

### Trace search and analytics

It is also possible to enable trace search and analytics to enable additional functionnalities inside the platform. [Documentation](https://docs.datadoghq.com/tracing/trace_search_and_analytics/?tab=nodejs)

### Log injection

The log injection enable the library to inject the trace_id to link the logs to the trace itself. For the application chosen here, it uses a log library called morgan whereas Datadog currently support Winston OOTB. [Documentation](https://docs.datadoghq.com/tracing/advanced/connect_logs_and_traces/?tab=nodejs)

To make it work, you can look at adding the trace_id manually and parse it in the pipeline within the platform or you can change the log library from morgan to winston.

### Runtime metrics

The datadog agent can also collect some runtime metrics. This feature is currently in beta for NodeJs. [Documentation](https://docs.datadoghq.com/tracing/advanced/runtime_metrics/?tab=nodejs)


## Additional tips

### Docker tips

Kill the app and restart it:

```
docker-compose down
docker-compose up -d
```

Go to the application on localhost:8080 and click on links to generate traces

## TODO

- Add notes on how to configure log ingestion
- Add dashboards, log pipelines, etc. to inject into environment
- Add script to generate traffic
- Add section to setup custom metrics


# App to get started with Datadog

This app is using the Datadog agent in a container.

## Requirements

- Ubuntu (>= 16.04.x/Xenial)
- Node
- Docker (>= 1.9.0)
- Docker-compose ([docs to install/upgrade](https://docs.docker.com/compose/install/))

## Installation steps

### Step 1: Clone this repo

- Go to your working directory.
- Clone this repo:
    - option 1: `git clone git@github.com:nxnarbais/dd-partner-app.git`
    - option 2: `git clone https://github.com/nxnarbais/dd-partner-app`
- Move to relevant directory: `cd dd-partner-app/nodejs-dummy`

### Step 2: Clone demoapp

- In the same directory (`dd-partner-app/nodejs-dummy`), clone demo app:
    - option 1: `git clone git@github.com:benc-uk/nodejs-demoapp.git app`
    - option 2: `git clone https://github.com/benc-uk/nodejs-demoapp app`
- Move to cloned app source directory: `cd app/src`
- Install node dependencies: `npm install`
- Check that this is working well:
    - Start the app: `npm start`
    - Go to http://localhost:3000
- Now the app should work! You can stop the server with `CTRL + C`

### Step 3: Configure the containerized agent

- Go back to parent directory: `cd ../..` (`dd-partner-app/nodejs-dummy` directory)
- Copy environment file example: `cp .env.example .env`
- Edit `.env` file: `vim .env`
    - Select the relevant site: `datadoghq.com` or `datadoghq.eu`
    - Add your API key

### Step 4: Check the project structure

Note: not all the files are shown here

```
- dd-partner-app/nodejs-dummy
    - app
      - src
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

## Instrument APM

To start to see some traces within the Datadog platform, you will need to instrument the application.

```
cd app/src
npm install --save dd-trace
```

Go into `server.js` and add:

```
const tracer = require('dd-trace').init()
```

(Note: This code could be added below the first debug line: `console.log('### Node.js demo app starting...');`)

Make some requests to the application:

```
curl http://localhost:8080
curl http://localhost:8080/weather
curl http://localhost:8080/todo
```

At this point, you should see some services in the APM service page: [US](https://app.datadoghq.com/apm/services) [EU](https://app.datadoghq.eu/apm/services)

### Going further with APM

Some additional parameters can be added on the tracer. You can for instance replace the tracer initialization by:

```
const tracer = require('dd-trace').init({
  logInjection: true, // Enable connection between logs and apm through the trace_id. This requires to use the supported library: https://docs.datadoghq.com/tracing/advanced/connect_logs_and_traces/?tab=nodejs
  analytics: true, // Enable trace search and analytics
  runtimeMetrics: true, // Enable runtime metrics
  tags: {
    serviceteam: "dogdemo"
  },
});
```

#### Trace search and analytics

It is also possible to enable trace search and analytics to enable additional functionnalities inside the platform. [Documentation](https://docs.datadoghq.com/tracing/trace_search_and_analytics/?tab=nodejs)

#### Log injection

The log injection enable the library to inject the trace_id to link the logs to the trace itself. For automated trace injection, Datadog supports the Winston library. [Documentation](https://docs.datadoghq.com/tracing/advanced/connect_logs_and_traces/?tab=nodejs).

These are a few steps to implement it within the app:

- Go to the app directory: `cd app/src`
- Install winston: `npm install winston`
- Create `wlogger.js` file with the content below:

```
const winston = require('winston');
const wlogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ]
});
module.exports = wlogger;
```

- Import this winston logger in `server.js`:

```
const wlogger = require('./wlogger');
```

- Comment the line with `app.use(logger('dev'));`
- Setup the morgan library to use winston for logging (this should be added below the commented line above):

```
class MyStream {
  write(text) {
      wlogger.info(text)
  }
}
let myStream = new MyStream()
app.use(logger('combined', { stream: myStream }));
```

At this point all the logs sent via morgan will use Winston and the dd-trace library will automatically insert the trace_id.

In addition, this application output some information via console.log, you can override this to use Winston as well.

For instance on the main `server.js` file:

- Open again the `server.js` file: `vim app/src/server.js`
- Replace the line: ``console.error(`### ERROR: ${err.message}`);`` with: ``wlogger.error(`### ERROR: ${err.message}`);``

Or on the todo module:

- Open the `todo/utils.js` file: `vim app/src/todo/utils.js`
- Import the wlogger.js file:

```
const wlogger = require('../wlogger');
```

- Replace the console.log lines with the Winston logger:

```
const wlogger = require('../wlogger');

class Utils {
  //
  // Try to send back the underlying error code and message
  //
  sendError(res, err, code = 500) {
    // console.dir(err);
    // console.log(`### Error with API ${JSON.stringify(err)}`); 
    wlogger.error(`### Error with API ${JSON.stringify(err)}`);
    let statuscode = code;
    if(err.code > 1) statuscode = err.code;

    // App Insights
    const appInsights = require("applicationinsights");    
    if(appInsights.defaultClient) appInsights.defaultClient.trackException({exception: err});
    
    res.status(statuscode).send(err);
    return;
  }

  //
  // Just sends data
  //
  sendData(res, data) {
    // App Insights
    const appInsights = require("applicationinsights");    
    if(appInsights.defaultClient) appInsights.defaultClient.trackEvent({name: "dataEvent", properties: {data: JSON.stringify(data)}});
    
    res.status(200).send(data)
    return;    
  }
}

module.exports = new Utils();
```

Additional logging can be added in other places to add additional information.

##### Setup a pipeline within Datadog

Most logs have a specific format from Winston, a pipeline can be created with a grok parser. Here is the parsing rule that can be set:

```
genericRule \:\:ffff\:%{ipv4:network.client.ip}\s+-\s+-\s+\[%{date("dd/MMM/yyyy:HH:mm:ss Z"):date}\]\s+\"%{word:http.method}\s+%{notSpace:http.url}\s+%{notSpace:http.version}\"\s+%{integer:http.status_code}\s+%{integer:token_1}?-?\s+\"%{notSpace:http.from_url}\"\s+\"%{data:browser.info}\"
```

#### Runtime metrics

The datadog agent can also collect some runtime metrics. This feature is currently in beta for NodeJs. [Documentation](https://docs.datadoghq.com/tracing/advanced/runtime_metrics/?tab=nodejs)

### Even further with RUM: Real User Monitoring

To get started, just follow the instructions to generate a token for RUM ([here is the doc](https://docs.datadoghq.com/real_user_monitoring/installation/?tab=eu)).

Then make sure you select the right datacenter (eu or com) and add the advised few code lines such as the one below for eu in the file `_foot.ejs` located in `dd-partner-app/nodejs-dummy/app/views/_foot.ejs`. This will have to be added before the `</html>` tag.

```
<script
  src="https://www.datadoghq-browser-agent.com/datadog-rum-eu.js"
  type="text/javascript">
</script>
<script>
  window.DD_RUM && window.DD_RUM.init({
    clientToken: '<CLIENT_TOKEN>',
    applicationId: '<APPLICATION_ID>',
    sampleRate: 100
  });
</script>
```

### What about sending some metrics?

To send custom application metrics into Datadog, the easiest way is to use [DogStatsD](https://docs.datadoghq.com/developers/dogstatsd/).

The agent in the docker-compose file is already configured to receive those metrics. So to get started, follow the instruction below.

- Install dependency. On `app/src/` run `npm install --save node-dogstatsd`
- In `server.js` instantiate dogstatsd by adding the line below:

```
// Setup Datadog node runtime metrics and statsD
const StatsD = require('node-dogstatsd').StatsD;
const dogstatsd = new StatsD(process.env.DD_AGENT_HOST,process.env.DD_STATSD_AGENT_PORT);
```

- Create now a middleware to count the number of page viewed by adding the snippet below before instantiating any route (e.g. before `// Routes & controllers`):

```
// On every page, this middleware will be applied
// This middleware will create a counter that increment on each call
app.use((req, res, next) => {
  dogstatsd.increment('nodejs.page.views'); // Create a metric in Datadog
  next();
});
```

As an example you can also, add this code snippet to `app/src/todo/routes.js` in the POST `/api/todo` before `let result = await db.collection(COLLECTION).insertOne(todo)`:

```
const { title, type, done } = todo;
dogstatsd.gauge('nodejs.todo.payload_size', title.length, [`type:${type}`, `done:${done}`]);
dogstatsd.increment('nodejs.todo.payload_type.count', 1, [`type:${type}`, `done:${done}`]);
```

This will publish the size of the todo content as a gauge to the Datadog platform and count the number of todo per type. Of course do not forget to instantiate dogstatsd on this file.

## Additional tips

### Docker tips

Kill the app and restart it:

```
docker-compose down
docker-compose up -d
```

or simpler:

```
docker-compose restart
```

Go to the application on http://localhost:8080 and click on links to generate traces

### Create traffic

If you app has a public url, it is possible to create traffic with some browser and api tests.

## TODO

To improve this repository for more advanced exercices:

- Add notes on how to configure log ingestion
- Add dashboards, log pipelines, etc. to inject into environment
- Add script to generate traffic
- Add section to setup custom metrics


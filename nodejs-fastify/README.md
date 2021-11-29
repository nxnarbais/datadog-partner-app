# NodeJS Fastify

## Get Started

### App

1. Make sure you have NodeJS installed
1. Run `npm i` to install dependencies
1. Run `curl localhost:3000` to check that everything is working

### Datadog

1. Make sure docker is installed
1. Copy and edit `.env` file `cp .env.example .env`
1. Run `docker compose up`
1. Run `curl localhost:3000` to check that everything is working
1. Check on your Datadog org to see if the host appears

## Workshop

### Step 0: Test Routes

Check that `curl localhost:3000/health` does not generate span or hit within the Datadog UI thanks to the option set at the agent level. This could be used to exclude noisy endpoints that do not represent the actual user experience.

Check that `curl localhost:3000/route404` is creating a hit as well as a span with `http.status_code:404`. Note that it does not generate an error since it is the expected behavior.

### Step 1: Install APM

You will be following [doc](https://docs.datadoghq.com/tracing/setup_overview/setup/nodejs/)

1. Install the APM library

On `./server.js`, search for `UNCOMMENT #1` and uncomment the few lines below:
```js
// This line must come before importing any instrumented module.
const tracer = require('dd-trace').init();
```

Check the that the spans appear with:
- `curl localhost:3000`
- `curl localhost:3000/route1`
- `curl localhost:3000/route2`
- `curl localhost:3000/route3`

### Step 2: Add a custom attribute

On `./server.js`, search for `UNCOMMENT #2` and uncomment the few lines below:

```js
// This will add the location as an attribute of the span
// This attribute can be made searchable on Trace Search and Analytics
// since it is set on the root span
const addSpanWithLocation = (location) => {
  // UNCOMMENT #2
  const span = tracer.scope().active();
  if (span) {
    const parent = span.context()._trace.started[0];
    parent.setTag('location', location);
  }
};
```

Check the spans include a `location` attribute with:
- `curl localhost:3000/route1`
- `curl localhost:3000/route2`
- `curl localhost:3000/route3`

### Step 3: Track a method and name a span


On `./server.js`, search for `UNCOMMENT #3` and uncomment the few lines below:

```js
const processSomething = async () => {
  // UNCOMMENT #3
  const traceOptions = {};
  const resProcessed = await tracer.trace('process.something', traceOptions, async () => {
    const resProcessed = await callToExternalService();
    const activeSpan = tracer.scope().active();
    activeSpan.setTag('result', resProcessed);
    return resProcessed;
  });
  console.log("Result from external service " + JSON.stringify(resProcessed));
  return resProcessed
}
```

This will wrap my function `callToExternalService` into a new span that I'll be able to visualize in my flamegraph. This could be useful to clearly highlight methods that can take a long time (e.g. read a file) or method that repeat a lot such as within a loop.

Check the new span available with:
- `curl localhost:3000/route1`

### Step 4: Create a service

On `./server.js`, search for `UNCOMMENT #4` and uncomment the few lines below:

```js
const authenticateWithToken = async (userToken) => {
  // UNCOMMENT #4
  const traceOptions = {
    service: "fake_auth_service",
    resource: "fake_auth_service.verify_id_token",
  };
  const userDetails = await tracer.trace('user.autentication', traceOptions, async () => {
    const userDetails = (await callToAuthService(userToken)).data;
    const activeSpan = tracer.scope().active();
    activeSpan.setTag('user', userDetails);
    return userDetails;
  });
  console.log("Authentication " + JSON.stringify(userDetails));
  return userDetails
}
```

This will create a new service called `fake_auth_service` with its complete service overview page and the metric associated. This could be interesting to track third party libraries or endpoints to check if their performances are as expected. This also add a new item in the service map view.

Check the new span and service available with:
- `curl localhost:3000/route2`
- `curl localhost:3000/route3`

### Step 5: Connect logs to spans

On `./server.js`, search for `UNCOMMENT #5` and uncomment the few lines below:

```js
  logInjection: true
```

Fastify has log enabled and is using pino, the traceId will then automatically be added to the logs.

Check on all the endpoints and see some logs appearing:
- `curl localhost:3000/route1`
- `curl localhost:3000/route2`
- `curl localhost:3000/route3`

### Step 6: Trace Proxy

NGINX is already running and you can access the app through `curl localhost:8888`. To get the traces from the proxy follow [this doc](https://docs.datadoghq.com/tracing/setup_overview/proxy_setup/?tab=nginx#nginx-configuration).
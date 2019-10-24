# App to get started with Datadog

This app is using the Datadog agent in a container.

## Requirements

- Node should be available
- Docker should be available (including docker-compose)

## Installation steps

Go to working directory

```
git clone git@github.com:benc-uk/nodejs-demoapp.git app
cd app/
npm install
npm start
```

See if the app works already

```
cp .env.example .env
```

Edit the API key with your own

## Start the application

```
docker-compose up -d
```

If you want to see the logs for debug

```
docker-compose logs -f
```

At that point, you should see some logs coming into the platform as well as some metrics, a host, a container, etc.


## Instrument APM

```
cd app
npm install --save dd-trace
```

Go into `server.js` and add:

```
const tracer = require('dd-trace').init()
```

Kill the app and restart it:

```
docker-compose down
docker-compose up -d
```

Go to the application on localhost:8080 and click on links to generate traces








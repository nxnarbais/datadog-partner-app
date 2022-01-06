Partner NodeJS Serverless App
=============================

## Get started

### Prerequisites

1. Have the AWS integration setup with the lambda forwarder

### Real get started

1. `cp .env.example .env` and fill with relevant Datadog api key and forwarder ARN
1. `npm i` to install node packages
1. `sls deploy --verbose` to deploy app

Then just test it and go to the multiple endpoints:
- GET /
- GET /test
- GET /list

## Additional commands to know

- `sls deploy function -f api` to redeploy only the function and not the other objects
- `sls remove` to delete everything related to this serverless deployment

## TODO

- Make this folder a proper workshop with steps to complete
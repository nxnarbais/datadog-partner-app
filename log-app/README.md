Log App
=========

## Purpose

Dummy app that generate a bunch of logs. The purpose is to test the various log features available in the Datadog agent.

## Get started

1. Copy `.env.example` to `.env` and fill with relevant credentials
1. Edit the content of `logs.txt` with the list of logs to generate.
1. Start the app with `docker compose up`
1. Generate logs with `curl http://localhost:3000`

## Development

### Fastify App

1. Edit the content of `logs.txt` with the list of logs to generate.
2. Start the app with `node server`
3. Generate logs with `curl http://localhost:3000`
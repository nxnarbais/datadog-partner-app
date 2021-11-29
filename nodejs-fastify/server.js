// UNCOMMENT #1
// // This line must come before importing any instrumented module.
// const tracer = require('dd-trace').init({
//   // logInjection: true, // UNCOMMENT #5
// });

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

// This will add the location as an attribute of the span
// This attribute can be made searchable on Trace Search and Analytics
// since it is set on the root span
const addSpanWithLocation = (location) => {
  // UNCOMMENT #2
  // const span = tracer.scope().active();
  // if (span) {
  //   const parent = span.context()._trace.started[0];
  //   parent.setTag('location', location);
  // }
};

const callToExternalService = () => { return { list: ["rantanplan","idefix"], total_count: 300, page: 1} };
const processSomething = async () => {
  let resProcessed = undefined
  // UNCOMMENT #3
  // const traceOptions = {};
  // resProcessed = await tracer.trace('process.something', traceOptions, async () => {
  //   const resProcessed = await callToExternalService();
  //   const activeSpan = tracer.scope().active();
  //   activeSpan.setTag('result', resProcessed);
  //   return resProcessed;
  // })
  return resProcessed
}

const callToAuthService = (userToken) => {
  if (userToken > 3) {
    throw new Error('User does not exist');
  }
  return { userId: userToken + 42 }
}
const authenticateWithToken = async (userToken) => {
  let userDetails = undefined
  // UNCOMMENT #4
  // const traceOptions = {
  //   service: "fake_auth_service",
  //   resource: "fake_auth_service.verify_id_token",
  // };
  // userDetails = await tracer.trace('user.autentication', traceOptions, async () => {
  //   const userDetails = await callToAuthService(userToken);
  //   const activeSpan = tracer.scope().active();
  //   activeSpan.setTag('user', userDetails);
  //   return userDetails;
  // });
  return userDetails
}

fastify.get('/route1', async (request, reply) => {
  addSpanWithLocation("Paris")
  const resProcessed = await processSomething()
  request.log.info("Result from external service " + JSON.stringify(resProcessed));
  return { route: '1' }
})

fastify.get('/route2', async (request, reply) => {
  addSpanWithLocation("Berlin")
  const userDetails = await authenticateWithToken(1)
  request.log.info("Authentication " + JSON.stringify(userDetails));
  return { route: '2' }
})

fastify.get('/route3', async (request, reply) => {
  addSpanWithLocation("Cairo")
  const userDetails = await authenticateWithToken(10)
  request.log.info("Authentication " + JSON.stringify(userDetails));
  return { route: '3' }
})

fastify.get('/health', async (request, reply) => {
  return { status: 'ok' }
})

// Run the server!
const start = async () => {
  try {
    // await fastify.listen(3000)
    await fastify.listen(3000, '0.0.0.0') // Add 0.0.0.0 for Docker
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
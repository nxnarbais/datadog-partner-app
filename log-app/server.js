// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const fs = require('fs')
const readline = require('readline');

const DELAY_BW_LOGS = 1000; // in ms

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function processLineByLine() {
  const fileStream = fs.createReadStream('./logs.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  let lineNumber = 1
  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line ${lineNumber} from file: ${line}`);
    lineNumber++;
    await sleep(DELAY_BW_LOGS);
  }
}

// Declare a route
fastify.get('/', async (request, reply) => {
	// try {
  //   const data = fs.readFileSync('./logs.txt', 'utf8')
  //   console.log(data)
  // } catch (err) {
  //   console.error(err)
  // }
  await processLineByLine();
  return { hello: 'world' }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
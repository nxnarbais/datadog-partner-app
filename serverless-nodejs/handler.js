"use strict";
const tracer = require("dd-trace");

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME

// submit a custom span named "sleep"
const sleep = tracer.wrap("sleep", (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
});

const params = {
  TableName: TableName,
  /* Item properties will depend on your application concerns */
  Item: {
     email: 'test@mail.com',
  }
}

async function createItem(){
  try {
    const traceOptions = {
      service: "partner-serverless-dynamodb",
      resource: "putItem usersTable",
    };
    const operationName = "aws.custom.dynamodb";
    const res = await tracer.trace(operationName, traceOptions, async () => {
      const activeSpan = tracer.scope().active();
      activeSpan.setTag('params', params);
      return await docClient.put(params).promise();
    });
  } catch (err) {
    return err;
  }
}

module.exports.my_hello_fn = async (event) => {
  console.info("EVENT\n" + JSON.stringify(event, null, 2))
  await createItem()

  const span = tracer.scope().active();
  span.setTag('customer_id', '123456');

  await sleep(100);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        version: "123",
        message: "Go Serverless v2.0! Your function executed successfully!",
        input: event,
        env_var: process.env
      },
      null,
      2
    ),
  };
};

module.exports.list = async (event) => {
  const items = await docClient
    .scan({
      TableName,
    })
    .promise()
  return { statusCode: 200, body: JSON.stringify(items) }
};

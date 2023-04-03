const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));

const dynamo = new AWS.DynamoDB();
const lambda = new AWS.Lambda();

exports.handler = async function (event: any) {
  console.log("request:", JSON.stringify(event, undefined, 2));

  await dynamo
    .updateItem({
      TableName: process.env.HITS_TABLE_NAME,
      Key: { path: { S: event.path } },
      UpdateExpression: "ADD hits :incr",
      ExpressionAttributeValues: { ":incr": { N: "1" } },
    })
    .promise();

  const resp = await lambda
    .invoke({
      FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
      Payload: JSON.stringify(event),
    })
    .promise();

  console.log("downstream response: ", JSON.stringify(resp, undefined, 2));

  return JSON.parse(resp.Payload);
};

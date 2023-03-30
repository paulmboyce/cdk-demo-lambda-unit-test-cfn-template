import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
const { Lambda, DynamoDB } = require("aws-sdk");

const dynamo = new DynamoDB();
const lambda = new Lambda();

exports.handler = async function (
  event: APIGatewayEvent,
  ctx: Context
): Promise<APIGatewayProxyResult> {
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

  const result: APIGatewayProxyResult = JSON.parse(resp.Payload);
  return result;
};

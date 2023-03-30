import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

exports.handler = async function (
  event: APIGatewayEvent,
  ctx: Context
): Promise<APIGatewayProxyResult> {
  console.log("request:", JSON.stringify(event, undefined, 2));

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello, CDK! BABY You've hit ${event.path}\n`,
  };
  return response;
};

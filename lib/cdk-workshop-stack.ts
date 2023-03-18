import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { join } from "path";

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }

  helloLambda = new lambda.Function(this, addPrefix("HelloHandler"), {
    runtime: lambda.Runtime.NODEJS_16_X,
    code: lambda.Code.fromAsset(join(__dirname, "../lambda")),
    handler: "hello.handler",
  });

  api = new apigw.LambdaRestApi(this, addPrefix("GatewayEndpoint"), {
    handler: this.helloLambda,
  });
}
const addPrefix = (id: string): string => APP_ID_PREFIX.concat(id);
const APP_ID_PREFIX = "DemoApp";

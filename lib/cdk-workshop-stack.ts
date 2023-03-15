import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import * as lambda from "aws-cdk-lib/aws-lambda";
import { join } from "path";

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }

  hello = new lambda.Function(this, "HelloHandler", {
    functionName: appLabel("HelloHandler"),
    runtime: lambda.Runtime.NODEJS_16_X,
    code: lambda.Code.fromAsset(join(__dirname, "../lambda")),
    handler: "hello.handler",
  });
}
const appLabel = (id: string): string => APP_ID_PREFIX.concat(id);
const APP_ID_PREFIX = "DemoApp_";

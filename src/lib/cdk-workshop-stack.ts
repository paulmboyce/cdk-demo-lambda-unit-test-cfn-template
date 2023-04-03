import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { join } from "path";
import { HitCounter } from "../construct/hitcounter";
import { TableViewer } from "cdk-dynamo-table-viewer";

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const helloLambda = new lambda.Function(this, addPrefix("HelloHandler"), {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset(join(__dirname, "../lambda")),
      handler: "hello.handler",
    });

    const hitCounterLambda = new HitCounter(this, "Hitcounter", {
      downstreamLambda: helloLambda,
    });

    const viewer = new TableViewer(this, "TableViewer:HitsTable:Name", {
      table: hitCounterLambda.dynamoTable,
      title: "TableViewer:HitsTable:Hits",
      sortBy: "-hits",
    });

    const api = new apigw.LambdaRestApi(this, addPrefix("GatewayEndpoint"), {
      handler: hitCounterLambda.handler,
    });
  }
}

const addPrefix = (id: string): string => APP_ID_PREFIX.concat(id);
const APP_ID_PREFIX = "DemoApp";

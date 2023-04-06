import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { join } from "path";
import { HitCounter } from "../construct/hitcounter";
import { TableViewer } from "cdk-dynamo-table-viewer";

export class CdkWorkshopStack extends cdk.Stack {
  public readonly out_GatewayUrl: cdk.CfnOutput;
  public readonly out_TableUrl: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloLambda = new lambda.Function(this, addPrefix("HelloHandler"), {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset(join(__dirname, "../lambda")),
      handler: "hello.handler",
    });

    const hitCounterLambda = new HitCounter(this, "Hitcounter", {
      downstreamLambda: helloLambda,
    });

    const viewer = new TableViewer(this, "TableViewer:HitsTable", {
      table: hitCounterLambda.dynamoTable,
      title: "TableViewer:HitsTable:Hits",
      sortBy: "-hits",
    });

    const api = new apigw.LambdaRestApi(this, addPrefix("GatewayEndpoint"), {
      handler: hitCounterLambda.handler,
    });

    this.out_GatewayUrl = new cdk.CfnOutput(this, "GatewayURL", {
      value: api.url,
    });
    this.out_TableUrl = new cdk.CfnOutput(this, "TableViewerURL", {
      value: viewer.endpoint,
    });
  }
}

const addPrefix = (id: string): string => APP_ID_PREFIX.concat(id);
const APP_ID_PREFIX = "DemoApp";

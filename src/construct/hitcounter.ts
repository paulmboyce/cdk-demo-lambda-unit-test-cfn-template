import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as ddb from "aws-cdk-lib/aws-dynamodb";
import { join } from "path";

export interface HitCounterProps {
  downstreamLambda: lambda.IFunction;
}

export class HitCounter extends Construct {
  public readonly handler: lambda.Function;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    const dynamoTable = new ddb.Table(this, "HitsTable", {
      partitionKey: { name: "path", type: ddb.AttributeType.STRING },
    });

    const nodeModulesLayer = new lambda.LayerVersion(this, "MyLayer", {
      code: lambda.Code.fromAsset(join(__dirname, "../../src/layers")),
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
      // license: 'Apache-2.0',
      description: "A layer for node_modules",
    });

    this.handler = new lambda.Function(this, "HitCounterLambdaFuncion", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(join(__dirname, "../lambda")),
      handler: "hitcounter.handler",
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstreamLambda.functionName,
        HITS_TABLE_NAME: dynamoTable.tableName,
      },
      tracing: lambda.Tracing.ACTIVE,
      layers: [nodeModulesLayer],
    });
    dynamoTable.grantReadWriteData(this.handler);
    props.downstreamLambda.grantInvoke(this.handler);
  }
}

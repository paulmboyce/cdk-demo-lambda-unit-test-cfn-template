import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as ddb from "aws-cdk-lib/aws-dynamodb";
import { join } from "path";
import { RemovalPolicy } from "aws-cdk-lib";

export interface HitCounterProps {
  downstreamLambda: lambda.IFunction;
}

export class HitCounter extends Construct {
  public readonly handler: lambda.Function;
  public readonly dynamoTable: ddb.Table;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    this.dynamoTable = new ddb.Table(this, "HitsTable", {
      tableName: "Hits",
      partitionKey: { name: "path", type: ddb.AttributeType.STRING },
      billingMode: ddb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
      removalPolicy: RemovalPolicy.DESTROY, // Not for Production!
    });

    const nodeModulesLayer = new lambda.LayerVersion(this, "MyLayer", {
      code: lambda.Code.fromAsset(join(__dirname, "../../src/layers")),
      compatibleRuntimes: [lambda.Runtime.NODEJS_16_X],
      // license: 'Apache-2.0',
      description: "A layer for node_modules",
    });

    this.handler = new lambda.Function(this, "HitCounterLambdaFuncion", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset(join(__dirname, "../lambda")),
      handler: "hitcounter.handler",
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstreamLambda.functionName,
        HITS_TABLE_NAME: this.dynamoTable.tableName,
      },
      tracing: lambda.Tracing.ACTIVE,
      layers: [nodeModulesLayer],
    });
    this.dynamoTable.grantReadWriteData(this.handler);
    props.downstreamLambda.grantInvoke(this.handler);
  }
}

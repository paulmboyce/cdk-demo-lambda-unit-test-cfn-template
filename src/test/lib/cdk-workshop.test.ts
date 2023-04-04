import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as CdkWorkshop from "../../lib/cdk-workshop-stack";

describe("Test CDK", () => {
  let app: cdk.App, stack: cdk.Stack, template: Template;

  beforeAll(() => {
    app = new cdk.App();
    stack = new CdkWorkshop.CdkWorkshopStack(app, "MyTestStack");
    template = Template.fromStack(stack);
  });

  test("One Lambda Function, hello.handler", () => {
    const lambdaLogicalIds = Object.keys(
      template.findResources("AWS::Lambda::Function")
    );
    console.log(lambdaLogicalIds);

    expect(lambdaLogicalIds).toContain("DemoAppHelloHandlerE21FDEA4");
    expect(lambdaLogicalIds).toContain(
      "HitcounterHitCounterLambdaFuncionA66335E6"
    );
    // THEN
    template.resourceCountIs("AWS::Lambda::Function", 3);
    template.resourcePropertiesCountIs(
      "AWS::Lambda::Function",
      {
        Runtime: "nodejs16.x",
      },
      2
    );
    template.hasResourceProperties("AWS::Lambda::Function", {
      Handler: "hello.handler",
    });
    template.hasResourceProperties("AWS::Lambda::Function", {
      Handler: "hitcounter.handler",
    });
  });

  test("One DynamoDB Table Function,", () => {
    template.resourceCountIs("AWS::DynamoDB::Table", 1);

    const dynamoDBTableLogicalIds = Object.keys(
      template.findResources("AWS::DynamoDB::Table")
    );
    expect(dynamoDBTableLogicalIds[0]).toBe("HitcounterHitsTableEFC5A5B3");

    // console.log(
    //   template.findResources("AWS::DynamoDB::Table").HitcounterHitsTableEFC5A5B3
    //     .Properties
    // );

    template.hasResourceProperties("AWS::DynamoDB::Table", {
      AttributeDefinitions: [
        {
          AttributeName: "path",
          AttributeType: "S",
        },
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    });
  });

  test("One API Gateway,", () => {
    template.resourceCountIs("AWS::ApiGateway::RestApi", 2);
    template.allResourcesProperties("AWS::ApiGateway::Method", {
      HttpMethod: "ANY",
      AuthorizationType: "NONE",
      Integration: {
        Type: "AWS_PROXY",
      },
    });
  });
});

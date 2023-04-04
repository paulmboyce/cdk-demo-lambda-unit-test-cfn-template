import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as CdkWorkshop from "../../lib/cdk-workshop-stack";

describe("Logical Ids", () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let template: Template;

  beforeAll(() => {
    app = new cdk.App();
    stack = new CdkWorkshop.CdkWorkshopStack(app, "MyTestStack");
    template = Template.fromStack(stack);
  });

  test("Lambda Logical Name is HitcounterHitCounterLambdaFuncionA66335E6", () => {
    const lambdaLogicalIds = Object.keys(
      template.findResources("AWS::Lambda::Function")
    );
    expect(lambdaLogicalIds).toContain(
      "HitcounterHitCounterLambdaFuncionA66335E6"
    );
  });

  test("DynamoDB Table Name and Logical Name", () => {
    template.resourceCountIs("AWS::DynamoDB::Table", 1);
    const ddbLogicalIds = Object.keys(
      template.findResources("AWS::DynamoDB::Table")
    );
    template.hasResourceProperties("AWS::DynamoDB::Table", {
      TableName: "Hits",
    });
    expect(ddbLogicalIds[0]).toBe("HitcounterHitsTableEFC5A5B3");
  });
});

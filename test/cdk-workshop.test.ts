import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as CdkWorkshop from "../lib/cdk-workshop-stack";

test("One Lambda Function, hello.handler", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CdkWorkshop.CdkWorkshopStack(app, "MyTestStack");
  const template = Template.fromStack(stack);
  // THEN
  template.resourceCountIs("AWS::Lambda::Function", 1);
  template.hasResourceProperties("AWS::Lambda::Function", {
    // FunctionName: "DemoApp_HelloHandler",
    Runtime: "nodejs16.x",
    Handler: "hello.handler",
  });

  template.resourceCountIs("AWS::ApiGateway::RestApi", 1);
  template.allResourcesProperties("AWS::ApiGateway::Method", {
    HttpMethod: "ANY",
    AuthorizationType: "NONE",
    Integration: {
      Type: "AWS_PROXY",
    },
  });
});

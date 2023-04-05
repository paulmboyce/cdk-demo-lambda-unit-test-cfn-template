import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as pipelines from "aws-cdk-lib/pipelines";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const pipeline = new pipelines.CodePipeline(this, "Pipeline", {
      synth: new pipelines.ShellStep("Synth", {
        // Use a connection created using the AWS console to authenticate to GitHub
        // Other sources are available.
        input: pipelines.CodePipelineSource.connection(
          "paulmboyce/cdk-demo-lambda-unit-test-cfn-template",
          "main",
          {
            connectionArn:
              "arn:aws:codestar-connections:eu-north-1:369368976179:connection/07b479f0-988e-4277-8186-bac11eb752d3", // Created using the AWS console * });',
          }
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });
  }
}

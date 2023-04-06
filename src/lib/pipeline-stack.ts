import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as pipelines from "aws-cdk-lib/pipelines";
import { CdkWorkshopStack } from "./cdk-workshop-stack";

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

        commands: [
          "bash ./scripts/pipeline/install-layer.sh",
          "npm ci",
          "npm run build",
          "npm run test",
          "npx cdk synth",
        ],
      }),
    });

    const stage = new CdkWorkshopStage(this, "Deploy");
    const deployStage = pipeline.addStage(stage);
    deployStage.addPost(
      new pipelines.CodeBuildStep("TestViewerEndpoint", {
        projectName: "TestViewerEndpoint",
        envFromCfnOutputs: {
          ENDPOINT_URL: stage.out_TableUrl,
        },
        commands: ["curl --show-error --silent --fail $ENDPOINT_URL"],
      })
    );
  }
}

class CdkWorkshopStage extends cdk.Stage {
  public readonly out_GatewayUrl: cdk.CfnOutput;
  public readonly out_TableUrl: cdk.CfnOutput;
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const stack = new CdkWorkshopStack(this, "APP-CdkWorkshopStack");
    this.out_GatewayUrl = stack.out_GatewayUrl;
    this.out_TableUrl = stack.out_TableUrl;
  }
}

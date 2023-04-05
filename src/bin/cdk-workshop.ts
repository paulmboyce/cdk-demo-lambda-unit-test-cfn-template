#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();
// new CdkWorkshopStack(app, "CdkWorkshopStack");
// CdkWorkshopStack: WILL BE DEPLOYED BY THE PIPELINE
// Run cdk deploy one time for initial deployment.
// Then subsequent git push will deploy.
new PipelineStack(app, "CICDPipeineStack");

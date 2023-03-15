import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
}
const appLabel = (id: string): string => APP_ID_PREFIX.concat(id);
const APP_ID_PREFIX = "CdkWorkshop";

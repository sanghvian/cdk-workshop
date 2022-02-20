import { HitCounter } from './hitcounter';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import {TableViewer} from 'cdk-dynamo-table-viewer'
import {Construct} from 'constructs'

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.NODEJS_14_X, // execution environment
      code: lambda.Code.fromAsset('lambda'), // code loaded from "lambda" directory
      handler: "hello.handler"   // file is "hello", function is "handler"
    });

    const helloWithCounter = new HitCounter(this, 'HelloWithCounter', {
      downstream:hello
    })

    // defines an API Gateway REST API resource backed by our "hello" function.
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler:helloWithCounter.handler
    })

    new TableViewer(this, "ViewHitCounter", {
      title: "Hello hits",
      table:helloWithCounter.table
    })
  }
}
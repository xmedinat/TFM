import core = require("@aws-cdk/core");
import {RestApi, LambdaIntegration} from "@aws-cdk/aws-apigateway";
import {Function, Runtime, Code} from "@aws-cdk/aws-lambda";
import {Certificate} from '@aws-cdk/aws-certificatemanager';

export class CaptionPredictor extends core.Construct {

  constructor(scope: core.Construct, id: string) {
    super(scope, id);
  
    const lambdaFunction = this.createLambdaFunction();
    const api = this.createApiGateway();
    this.integrateLambdaWithApiGateway(lambdaFunction, api);
  }


  private createLambdaFunction(): Function{
    const handler = new Function(this, "TextPredictor", {
      runtime: Runtime.PYTHON_3_8,
      code: Code.fromAsset("lambda/lambda_code.zip"),
      handler: "lambda_handler.handler",
      environment: {'executionEnv': 'dev'},
      memorySize: 512,
      timeout: core.Duration.seconds(15)
    });

    return handler;
  }

  private createApiGateway(): RestApi{
    const certificateArn = this.node.tryGetContext('CERTIFICATE_ARN');
    const domainName = this.node.tryGetContext('DOMAIN_NAME')
    const certificate = Certificate.fromCertificateArn(this, 'ArnParameter', certificateArn);

    const api = new RestApi(this, "ImageCaptionPredictor-api", {
      restApiName: "ImageCaptionPredictor",
      description: "Endpoint to generate captions for image.",
      domainName: {
        domainName: domainName,
        certificate: certificate,
      }
    });

    return api;
  }

  private integrateLambdaWithApiGateway(lambdaFunction: Function, api: RestApi){
    const predictDescription = new LambdaIntegration(lambdaFunction, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    const predict = api.root.addResource('predict');
    predict.addMethod("POST", predictDescription);
  }
}

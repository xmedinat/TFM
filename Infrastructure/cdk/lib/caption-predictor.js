"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@aws-cdk/core");
const aws_apigateway_1 = require("@aws-cdk/aws-apigateway");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const aws_certificatemanager_1 = require("@aws-cdk/aws-certificatemanager");
class CaptionPredictor extends core.Construct {
    constructor(scope, id) {
        super(scope, id);
        const lambdaFunction = this.createLambdaFunction();
        const api = this.createApiGateway();
        this.integrateLambdaWithApiGateway(lambdaFunction, api);
    }
    createLambdaFunction() {
        const handler = new aws_lambda_1.Function(this, "TextPredictor", {
            runtime: aws_lambda_1.Runtime.PYTHON_3_8,
            code: aws_lambda_1.Code.fromAsset("lambda/lambda_code.zip"),
            handler: "lambda_handler.handler",
            environment: { 'executionEnv': 'dev' },
            memorySize: 512,
            timeout: core.Duration.seconds(15)
        });
        return handler;
    }
    createApiGateway() {
        const certificate = aws_certificatemanager_1.Certificate.fromCertificateArn(this, 'ArnParameter', "CERTIFICATE_ARN");
        const api = new aws_apigateway_1.RestApi(this, "ImageCaptionPredictor-api", {
            restApiName: "ImageCaptionPredictor",
            description: "Endpoint to generate captions for image.",
            domainName: {
                domainName: "test.TFM",
                certificate: certificate,
            }
        });
        return api;
    }
    integrateLambdaWithApiGateway(lambdaFunction, api) {
        const predictDescription = new aws_apigateway_1.LambdaIntegration(lambdaFunction, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' }
        });
        const predict = api.root.addResource('predict');
        predict.addMethod("POST", predictDescription);
    }
}
exports.CaptionPredictor = CaptionPredictor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdGlvbi1wcmVkaWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjYXB0aW9uLXByZWRpY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF1QztBQUN2Qyw0REFBbUU7QUFDbkUsb0RBQTREO0FBQzVELDRFQUE0RDtBQUU1RCxNQUFhLGdCQUFpQixTQUFRLElBQUksQ0FBQyxTQUFTO0lBRWxELFlBQVksS0FBcUIsRUFBRSxFQUFVO1FBQzNDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDbkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBR08sb0JBQW9CO1FBQzFCLE1BQU0sT0FBTyxHQUFHLElBQUkscUJBQVEsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ2xELE9BQU8sRUFBRSxvQkFBTyxDQUFDLFVBQVU7WUFDM0IsSUFBSSxFQUFFLGlCQUFJLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDO1lBQzlDLE9BQU8sRUFBRSx3QkFBd0I7WUFDakMsV0FBVyxFQUFFLEVBQUMsY0FBYyxFQUFFLEtBQUssRUFBQztZQUNwQyxVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVPLGdCQUFnQjtRQUV0QixNQUFNLFdBQVcsR0FBRyxvQ0FBVyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUU1RixNQUFNLEdBQUcsR0FBRyxJQUFJLHdCQUFPLENBQUMsSUFBSSxFQUFFLDJCQUEyQixFQUFFO1lBQ3pELFdBQVcsRUFBRSx1QkFBdUI7WUFDcEMsV0FBVyxFQUFFLDBDQUEwQztZQUN2RCxVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLFVBQVU7Z0JBQ3RCLFdBQVcsRUFBRSxXQUFXO2FBQ3pCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRU8sNkJBQTZCLENBQUMsY0FBd0IsRUFBRSxHQUFZO1FBQzFFLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxrQ0FBaUIsQ0FBQyxjQUFjLEVBQUU7WUFDL0QsZ0JBQWdCLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSx5QkFBeUIsRUFBRTtTQUNwRSxDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoRCxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2hELENBQUM7Q0FDRjtBQWhERCw0Q0FnREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29yZSA9IHJlcXVpcmUoXCJAYXdzLWNkay9jb3JlXCIpO1xyXG5pbXBvcnQge1Jlc3RBcGksIExhbWJkYUludGVncmF0aW9ufSBmcm9tIFwiQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXlcIjtcclxuaW1wb3J0IHtGdW5jdGlvbiwgUnVudGltZSwgQ29kZX0gZnJvbSBcIkBhd3MtY2RrL2F3cy1sYW1iZGFcIjtcclxuaW1wb3J0IHtDZXJ0aWZpY2F0ZX0gZnJvbSAnQGF3cy1jZGsvYXdzLWNlcnRpZmljYXRlbWFuYWdlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FwdGlvblByZWRpY3RvciBleHRlbmRzIGNvcmUuQ29uc3RydWN0IHtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNvcmUuQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQpO1xyXG4gIFxyXG4gICAgY29uc3QgbGFtYmRhRnVuY3Rpb24gPSB0aGlzLmNyZWF0ZUxhbWJkYUZ1bmN0aW9uKCk7XHJcbiAgICBjb25zdCBhcGkgPSB0aGlzLmNyZWF0ZUFwaUdhdGV3YXkoKTtcclxuICAgIHRoaXMuaW50ZWdyYXRlTGFtYmRhV2l0aEFwaUdhdGV3YXkobGFtYmRhRnVuY3Rpb24sIGFwaSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVMYW1iZGFGdW5jdGlvbigpOiBGdW5jdGlvbntcclxuICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgRnVuY3Rpb24odGhpcywgXCJUZXh0UHJlZGljdG9yXCIsIHtcclxuICAgICAgcnVudGltZTogUnVudGltZS5QWVRIT05fM184LFxyXG4gICAgICBjb2RlOiBDb2RlLmZyb21Bc3NldChcImxhbWJkYS9sYW1iZGFfY29kZS56aXBcIiksXHJcbiAgICAgIGhhbmRsZXI6IFwibGFtYmRhX2hhbmRsZXIuaGFuZGxlclwiLFxyXG4gICAgICBlbnZpcm9ubWVudDogeydleGVjdXRpb25FbnYnOiAnZGV2J30sXHJcbiAgICAgIG1lbW9yeVNpemU6IDUxMixcclxuICAgICAgdGltZW91dDogY29yZS5EdXJhdGlvbi5zZWNvbmRzKDE1KVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGhhbmRsZXI7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUFwaUdhdGV3YXkoKTogUmVzdEFwaXtcclxuXHJcbiAgICBjb25zdCBjZXJ0aWZpY2F0ZSA9IENlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybih0aGlzLCAnQXJuUGFyYW1ldGVyJywgXCJDRVJUSUZJQ0FURV9BUk5cIik7XHJcblxyXG4gICAgY29uc3QgYXBpID0gbmV3IFJlc3RBcGkodGhpcywgXCJJbWFnZUNhcHRpb25QcmVkaWN0b3ItYXBpXCIsIHtcclxuICAgICAgcmVzdEFwaU5hbWU6IFwiSW1hZ2VDYXB0aW9uUHJlZGljdG9yXCIsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkVuZHBvaW50IHRvIGdlbmVyYXRlIGNhcHRpb25zIGZvciBpbWFnZS5cIixcclxuICAgICAgZG9tYWluTmFtZToge1xyXG4gICAgICAgIGRvbWFpbk5hbWU6IFwidGVzdC5URk1cIixcclxuICAgICAgICBjZXJ0aWZpY2F0ZTogY2VydGlmaWNhdGUsXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBhcGk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGludGVncmF0ZUxhbWJkYVdpdGhBcGlHYXRld2F5KGxhbWJkYUZ1bmN0aW9uOiBGdW5jdGlvbiwgYXBpOiBSZXN0QXBpKXtcclxuICAgIGNvbnN0IHByZWRpY3REZXNjcmlwdGlvbiA9IG5ldyBMYW1iZGFJbnRlZ3JhdGlvbihsYW1iZGFGdW5jdGlvbiwge1xyXG4gICAgICByZXF1ZXN0VGVtcGxhdGVzOiB7IFwiYXBwbGljYXRpb24vanNvblwiOiAneyBcInN0YXR1c0NvZGVcIjogXCIyMDBcIiB9JyB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBwcmVkaWN0ID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3ByZWRpY3QnKTtcclxuICAgIHByZWRpY3QuYWRkTWV0aG9kKFwiUE9TVFwiLCBwcmVkaWN0RGVzY3JpcHRpb24pO1xyXG4gIH1cclxufVxyXG4iXX0=
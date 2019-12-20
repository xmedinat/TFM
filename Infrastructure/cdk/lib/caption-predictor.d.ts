import core = require("@aws-cdk/core");
export declare class CaptionPredictor extends core.Construct {
    constructor(scope: core.Construct, id: string);
    private createLambdaFunction;
    private createApiGateway;
    private integrateLambdaWithApiGateway;
}

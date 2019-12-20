import cdk = require('@aws-cdk/core');
import caption_predictor = require('./caption-predictor');

export class CaptionPredictorStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new caption_predictor.CaptionPredictor(this, 'ImageCaptionPredictor');
    
  }
}

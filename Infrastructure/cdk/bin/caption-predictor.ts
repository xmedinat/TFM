#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CaptionPredictorStack } from '../lib/caption-predictor-stack';

const app = new cdk.App();
const captionPredictorStack = new CaptionPredictorStack(app, 'CaptionPredictorStack');

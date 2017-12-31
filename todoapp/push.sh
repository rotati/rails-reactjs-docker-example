#!/bin/sh
set -x

aws s3 sync build/ s3://todoapp-rotati/
aws cloudfront create-invalidation --distribution-id ESW15RIW6DZLE --paths "/*"
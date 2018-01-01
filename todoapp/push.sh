#!/bin/sh
set -x

npm run build && aws s3 sync build/ s3://todoapp-rotati-staging/
# aws cloudfront create-invalidation --distribution-id ESW15RIW6DZLE --paths "/*"
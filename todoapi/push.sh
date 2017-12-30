#!/bin/sh
set -x

LC=$(git rev-parse --short HEAD)
docker build -f Dockerfile -t rotati/todoapi:${LC} .
docker push rotati/todoapi:${LC}
#!/bin/bash

set -xeuo pipefail

TAG="1.0.0"

aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/d0l7r8j1
docker build -t personal-website-v3 .
docker tag personal-website-v3 public.ecr.aws/d0l7r8j1/personal-website-v3:${TAG}
docker push public.ecr.aws/d0l7r8j1/personal-website-v3:${TAG}
#!/bin/bash

set -xeuo pipefail

TAG=${1:-latest}

REPO=public.ecr.aws/d0l7r8j1

aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${REPO}
docker build -t personal-website-v3 .
docker tag personal-website-v3 ${REPO}/personal-website-v3:${TAG}
docker tag personal-website-v3 ${REPO}/personal-website-v3:latest
docker push ${REPO}/personal-website-v3:${TAG}
docker push ${REPO}/personal-website-v3:latest
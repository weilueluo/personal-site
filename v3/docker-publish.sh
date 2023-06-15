#!/bin/bash

set -xeuo pipefail


AWS_REGION=us-east-1
DOCKER_REGISTRY=public.ecr.aws/d0l7r8j1

PS=personal-website-v3

aws ecr-public get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $DOCKER_REGISTRY

docker build -t $PS .

docker tag $PS $DOCKER_REGISTRY/$PS\:latest

docker push $DOCKER_REGISTRY/$PS\:latest
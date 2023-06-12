terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "eu-west-2"
}

module "v1" {
  source = "./v1"
}

module "v2" {
  source = "./v2"
}

module "v3" {
  source = "./v3"
}
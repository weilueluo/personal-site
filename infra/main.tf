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
  source          = "./v1"
  resource_prefix = "v1"
}

module "v2" {
  source          = "./v2"
  resource_prefix = "v2"
}

module "v3" {
  source          = "./v3"
  resource_prefix = "v3"

  # lb_account_id = "652711504416" # for "eu-west-2" region, check https://docs.aws.amazon.com/elasticloadbalancing/latest/application/enable-access-logging.html
  region      = "eu-west-2"
  domain_name = "llwll.net"
  image       = "public.ecr.aws/d0l7r8j1/personal-website-v3:latest"
}

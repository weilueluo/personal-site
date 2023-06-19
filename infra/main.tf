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
  bucket_name = "luoweilue-personal-website-v1"
}

module "v2" {
  source = "./v2"
  bucket_name = "luoweilue-personal-website-v2"
}

module "v3" {
  source = "./v3"
  lb_account_id = "652711504416"  # for "eu-west-2" region, check https://docs.aws.amazon.com/elasticloadbalancing/latest/application/enable-access-logging.html
} 
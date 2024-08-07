terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  # NOTE: create this bucket manually first
  backend "s3" {
    bucket = "terraform-state-personal-website"
    key    = "terraform.tfstate"
    region = "eu-west-2"
  }
}

locals {
  region      = "eu-west-2"
  domain_name = "wll.dev"
}

provider "aws" {
  region = local.region
}

module "v1" {
  source          = "./site_static"
  resource_prefix = "v1-lwl"
  domain_name     = "v1.${local.domain_name}"
  zone_name       = local.domain_name
}

module "v2" {
  source          = "./site_static"
  resource_prefix = "v2-lwl"
  domain_name     = local.domain_name
  zone_name       = local.domain_name
}

# module "v3" {
#   source          = "./site_dynamic/v2"
#   resource_prefix = "v3"
#   domain_name     = local.domain_name
#   zone_name       = local.domain_name

#   image             = var.image
#   port              = 3000
#   health_check_path = "/api/health"
#   cpu               = 256
#   memory            = 512
#   # lb_account_id = "652711504416" # for "eu-west-2" region, check https://docs.aws.amazon.com/elasticloadbalancing/latest/application/enable-access-logging.html
# }

module "db" {
  source = "./modules/dynamo"

  resource_prefix = "v3"
  partition_key = {
    name = "name"
    type = "S"
  }
  sort_key = {
    name = "time"
    type = "N"
  }
}

# requires updating the .env.local file for the cognito pool id
module "cognito" {
  source          = "./modules/cognito"
  resource_prefix = "v3"
  dynamodb_arn    = module.db.arn
}

module "v3" {
  source          = "./site_dynamic/v3"
  resource_prefix = "v3"
  cidr_block      = "10.10.0.0/16"
  # image = "public.ecr.aws/d0l7r8j1/personal-website-v3:latest"
  domain_name = "v2.${local.domain_name}"
  zone_name   = local.domain_name

  image = var.image
  port  = 3000
  # health_check_path = "/api/health"
  # cpu               = 256
  # memory            = 512
  # lb_account_id = "652711504416" # for "eu-west-2" region, check https://docs.aws.amazon.com/elasticloadbalancing/latest/application/enable-access-logging.html
}

module "luoweilue_com_redirect" {
  source = "./redirect"

  from_domain = "luoweilue.com"
  to_domain   = local.domain_name
}

module "weilueluo_com_redirect" {
  source = "./redirect"

  from_domain = "weilueluo.com"
  to_domain   = local.domain_name
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

locals {
  region      = "eu-west-2"
  domain_name = "llwll.net"
}

provider "aws" {
  region = local.region
}

module "v1" {
  source          = "./site_static"
  resource_prefix = "v1"
  domain_name     = "v1.${local.domain_name}"
  zone_name       = local.domain_name
}

module "v2" {
  source          = "./site_static"
  resource_prefix = "v2"
  domain_name     = "v2.${local.domain_name}"
  zone_name       = local.domain_name
}

module "v3" {
  source          = "./site_dynamic"
  resource_prefix = "v3"
  domain_name     = local.domain_name
  zone_name       = local.domain_name

  image             = "public.ecr.aws/d0l7r8j1/personal-website-v3:0.0.1"
  port              = 3000
  health_check_path = "/api/health"
  cpu               = 256
  memory            = 512
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
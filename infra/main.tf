terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = local.region
}

module "v1" {
  source              = "./site_static"
  resource_prefix     = "v1"
  domain_name         = "v1.${local.domain_name}"
  zone_name           = local.domain_name
  ssl_certificate_arn = aws_acm_certificate.v1_v2.arn
}

module "v2" {
  source              = "./site_static"
  resource_prefix     = "v2"
  domain_name         = "v2.${local.domain_name}"
  zone_name           = local.domain_name
  ssl_certificate_arn = aws_acm_certificate.v1_v2.arn
}

module "v3" {
  source          = "./site_dynamic"
  resource_prefix = "v3"

  # lb_account_id = "652711504416" # for "eu-west-2" region, check https://docs.aws.amazon.com/elasticloadbalancing/latest/application/enable-access-logging.html
  domain_name = local.domain_name

  image             = "public.ecr.aws/d0l7r8j1/personal-website-v3:1.0.0"
  container_port    = 3000
  health_check_path = "/api/health"
}

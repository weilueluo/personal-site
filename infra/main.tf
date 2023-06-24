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
  source              = "./static_site"
  resource_prefix     = "v1"
  ssl_certificate_arn = aws_acm_certificate.v1_v2.arn
  domain_name         = "v1.${local.domain_name}"
  zone_name           = local.domain_name
}

module "v2" {
  source              = "./static_site"
  resource_prefix     = "v2"
  ssl_certificate_arn = aws_acm_certificate.v1_v2.arn
  domain_name         = "v2.${local.domain_name}"
  zone_name           = local.domain_name
}

module "v3" {
  source          = "./v3"
  resource_prefix = "v3"

  # lb_account_id = "652711504416" # for "eu-west-2" region, check https://docs.aws.amazon.com/elasticloadbalancing/latest/application/enable-access-logging.html
  region            = local.region
  domain_name       = local.domain_name
  image             = "public.ecr.aws/d0l7r8j1/personal-website-v3:1.0.0"
  container_port    = 3000
  health_check_path = "/api/health"
}

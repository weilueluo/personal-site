provider "aws" {
  region = "us-east-1"
  alias  = "ue1"
}

data "aws_route53_zone" "zone" {
  name = local.domain_name
}

resource "aws_acm_certificate" "v1_v2" {

  # v1 and v2 uses bucket and hosted in cloudfront, so we need to use us-east-1
  provider = aws.ue1

  domain_name               = local.domain_name
  subject_alternative_names = ["*.${local.domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "dns_validation" {
  for_each = {
    for dvo in aws_acm_certificate.v1_v2.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.zone.zone_id
}
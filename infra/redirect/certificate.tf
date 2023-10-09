provider "aws" {
  region = "us-east-1"
  alias  = "ue1"
}

resource "aws_acm_certificate" "redirect" {

  # static site uses bucket and hosted in cloudfront, so we need to use us-east-1
  provider = aws.ue1

  domain_name               = var.from_domain
  subject_alternative_names = ["*.${var.from_domain}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

data "aws_route53_zone" "from_domain" {
  name = var.from_domain
}

resource "aws_route53_record" "dns_validation" {
  for_each = {
    for dvo in aws_acm_certificate.redirect.domain_validation_options : dvo.domain_name => {
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
  zone_id         = data.aws_route53_zone.from_domain.zone_id
}

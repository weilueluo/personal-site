// route53 redirect to cloudfront

data "aws_route53_zone" "from_domain_zone" {
  name = var.from_domain
}

resource "aws_route53_record" "redirect_to_cloudfront_a" {
  zone_id = data.aws_route53_zone.from_domain_zone.zone_id
  name    = var.from_domain
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.distribution.domain_name
    zone_id                = aws_cloudfront_distribution.distribution.hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "redirect_to_cloudfront_aaaa" {
  zone_id = data.aws_route53_zone.from_domain_zone.zone_id
  name    = var.from_domain
  type    = "AAAA"
  alias {
    name                   = aws_cloudfront_distribution.distribution.domain_name
    zone_id                = aws_cloudfront_distribution.distribution.hosted_zone_id
    evaluate_target_health = true
  }
}

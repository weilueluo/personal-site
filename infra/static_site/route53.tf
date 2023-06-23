data "aws_route53_zone" "zone" {
  name = var.zone_name
}

resource "aws_route53_record" "redirect" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.ss.domain_name
    zone_id                = aws_cloudfront_distribution.ss.hosted_zone_id
    evaluate_target_health = false
  }
}

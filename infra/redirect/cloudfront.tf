// cloudfront redirect to s3

locals {
  s3_origin_id = "${var.from_domain}-to-${var.to_domain}-s3-origin-id"
}

data "aws_region" "current" {}

// we need a distribution to validate ssl certificate
// otherwise https redirect will not work
// if you only need http redirect, you can point route53 to s3 bucket directly
resource "aws_cloudfront_distribution" "distribution" {
  origin {
    // https://github.com/aws/aws-sdk-js/issues/2368#issuecomment-440756994
    // if we want to use s3-website endpoint, we should use custom origin
    domain_name = aws_s3_bucket_website_configuration.redirect.website_endpoint
    origin_id   = local.s3_origin_id
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled = true

  aliases = [var.from_domain]

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.s3_origin_id
    viewer_protocol_policy = "redirect-to-https"

    # https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-caching-optimized
    cache_policy_id = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # caching disabled policy, redirect does not need caching
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.redirect.arn
    ssl_support_method  = "sni-only"
  }
}

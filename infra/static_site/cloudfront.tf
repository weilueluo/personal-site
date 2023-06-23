locals {
  s3_origin_id = "${var.resource_prefix}-s3-origin-id"
}

resource "aws_cloudfront_distribution" "ss" {
  origin {
    domain_name              = aws_s3_bucket.ss.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.ss.id
    origin_id                = local.s3_origin_id
  }

  enabled             = true
  default_root_object = "index.html"

  logging_config {
    include_cookies = true
    bucket          = "${aws_s3_bucket.logging.id}.s3.amazonaws.com" # fk man, this is so stupid
  }

  aliases = [var.domain_name]

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.s3_origin_id
    viewer_protocol_policy = "allow-all"

    # https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-caching-optimized
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6" # caching optimized policy
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.ssl_certificate_arn
    ssl_support_method  = "sni-only"
  }
}


resource "aws_cloudfront_origin_access_control" "ss" {
  name                              = "${var.resource_prefix}-access-control"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

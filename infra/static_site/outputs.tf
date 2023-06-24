

output "bucket_name" {
  value = aws_s3_bucket_website_configuration.ss.bucket
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.ss.domain_name
}

output "domain_name" {
  value = var.domain_name
}

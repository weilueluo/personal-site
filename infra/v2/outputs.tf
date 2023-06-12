

output "v2_website_doamin" {
  value = aws_s3_bucket_website_configuration.v2.website_domain
}

output "v2_website_endpoint" {
  value = aws_s3_bucket_website_configuration.v2.website_endpoint
}
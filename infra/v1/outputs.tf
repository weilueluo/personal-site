

output "v1_website_doamin" {
  value = aws_s3_bucket_website_configuration.v1.website_domain
}

output "v1_website_endpoint" {
  value = aws_s3_bucket_website_configuration.v1.website_endpoint
}
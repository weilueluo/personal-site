

output "v2_bucket_name" {
  value = aws_s3_bucket_website_configuration.v2.bucket
}

output "v2_website_endpoint" {
  value = aws_s3_bucket_website_configuration.v2.website_endpoint
}
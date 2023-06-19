

output "v1_bucket_name" {
  value = aws_s3_bucket_website_configuration.v1.bucket
}

output "v1_website_endpoint" {
  value = aws_s3_bucket_website_configuration.v1.website_endpoint
}
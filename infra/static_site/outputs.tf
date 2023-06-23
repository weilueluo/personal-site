

output "bucket_name" {
  value = aws_s3_bucket_website_configuration.ss.bucket
}

output "website_endpoint" {
  value = aws_s3_bucket_website_configuration.ss.website_endpoint
}
output "from" {
  value = var.from_domain
}

output "to" {
  value = var.to_domain
}

output "bucket_website_config" {
  value = aws_s3_bucket_website_configuration.redirect
}

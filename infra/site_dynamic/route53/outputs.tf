output "ssl_certificate_arn" {
  value = aws_acm_certificate.domain_name_cert.arn
}

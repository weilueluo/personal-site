
# output "access_logs_bucket" {
#   value = aws_s3_bucket.access_logs.bucket
# }

output "target_group_arn" {
  value = aws_lb_target_group.v3.arn
}

output "load_balancer_dns_name" {
  value = aws_alb.v3.dns_name
}

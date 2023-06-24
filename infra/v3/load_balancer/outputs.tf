


output "target_group_arn" {
  value       = aws_lb_target_group.v3.arn
  description = "used by ecs task to register itself as target"
}

output "lb_name" {
  value = aws_alb.v3.name
}

output "lb_zone_id" {
  value       = aws_alb.v3.zone_id
  description = "used by route53 to create the A/AAAA record"
}

output "lb_dns_name" {
  value       = aws_alb.v3.dns_name
  description = "used by route53 to create the A/AAAA record"
}

output "health_check_path" {
  value = aws_lb_target_group.v3.health_check[0].path
}

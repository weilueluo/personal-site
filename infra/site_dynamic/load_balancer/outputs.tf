
output "tg_arn" {
  value       = aws_lb_target_group.lb_tg.arn
  description = "used by ecs task to register itself as target"
}

output "lb_name" {
  value = aws_alb.lb.name
}

output "lb_zone_id" {
  value       = aws_alb.lb.zone_id
  description = "used by route53 to create the A/AAAA record"
}

output "lb_dns_name" {
  value       = aws_alb.lb.dns_name
  description = "used by route53 to create the A/AAAA record"
}

output "health_check_path" {
  value = aws_lb_target_group.lb_tg.health_check[0].path
}


output "dns_name" {
  value = aws_alb.v3.dns_name
}

output "name" {
  value = aws_alb.v3.name
}

// for ecs to reigster as a target
output "target_group_arn" {
  value = aws_lb_target_group.v3.arn
}

// for route53 to create an A/AAAA record
output "lb_zone_id" {
  value = aws_alb.v3.zone_id
}

// for route53 to create an A/AAAA record
output "lb_dns_name" {
  value = aws_alb.v3.dns_name
}

output "target_group" {
  value = aws_lb_target_group.v3.name
}

output "health_check" {
  value = aws_lb_target_group.v3.health_check
}

output "security_group" {
  value = aws_security_group.v3_load_balancer_security_group.name
}

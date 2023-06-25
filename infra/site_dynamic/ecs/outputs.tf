output "cluster_name" {
  value = aws_ecs_cluster.cluster.name
}

output "service_name" {
  value = aws_ecs_service.service.name
}

output "container_name" {
  value = local.container_name
}

output "service_sg_id" {
  value       = aws_security_group.service.id
  description = "security group id for the ECS service, used to allow traffic from the load balancer"
}

output "image" {
  value = var.image
}
output "vpc_id" {
  value       = aws_vpc.v3.id
  description = "used by load balancer and ecs to create resources in the vpc"
}

output "subnet_1_id" {
  value       = aws_subnet.v3_1.id
  description = "used by load balancer and ecs to create resources in the subnet"
}

output "subnet_2_id" {
  value       = aws_subnet.v3_2.id
  description = "used by load balancer and ecs to create resources in the subnet"
}

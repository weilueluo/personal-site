output "vpc_id" {
  value       = aws_vpc.vpc.id
  description = "used by load balancer and ecs to create resources in the vpc"
}

output "public_subnet_1_id" {
  value       = aws_subnet.public_1.id
  description = "used by load balancer and ecs to create resources in the subnet"
}

output "public_subnet_2_id" {
  value       = aws_subnet.public_2.id
  description = "used by load balancer and ecs to create resources in the subnet"
}
output "vpc_id" {
  value = aws_vpc.v3.id
}

output "subnet_1_id" {
  value = aws_subnet.v3_1.id
}

output "subnet_2_id" {
  value = aws_subnet.v3_2.id
}

output "internet_gateway_arn" {
    value = aws_internet_gateway.v3.arn
}

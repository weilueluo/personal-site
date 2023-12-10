output "aws_instance_public_dns" {
  value = aws_instance.instance.public_dns
}

output "aws_instance_public_ip" {
  value = aws_instance.instance.public_ip
}

output "aws_instance_key_name" {
  value = aws_key_pair.key_pair.key_name
}

output "aws_vpc_cidr" {
  value = aws_vpc.vpc.cidr_block
}

output "aws_subnet_cidr" {
  value = aws_subnet.subnet.cidr_block
}

# output "aws_key_pair_private_key" {
#   value     = tls_private_key.key.private_key_pem
#   sensitive = true
# }

output "availability_zone_name" {
  value = data.aws_availability_zones.zones.names[0]
}

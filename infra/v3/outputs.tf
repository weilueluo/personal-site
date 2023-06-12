
output "ec2_public_ip" {
  value = aws_instance.v3.public_ip
}
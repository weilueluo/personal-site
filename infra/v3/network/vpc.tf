resource "aws_vpc" "v3" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  tags = {
    Name = "v3"
  }
}

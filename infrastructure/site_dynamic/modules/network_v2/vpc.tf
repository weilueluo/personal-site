resource "aws_vpc" "vpc" {
  cidr_block = var.vpc_cidr

  // required for nodeJs to resolve host names
  // otherwise you will get something like "Invariant: failed to start render worker Error: getaddrinfo ENOTFOUND xxxxxx-xxx"
  enable_dns_hostnames = true
  tags = {
    Name = var.resource_prefix
  }
}
data "aws_availability_zones" "zones" {
  state = "available"
}

resource "aws_vpc" "vpc" {
  cidr_block = var.cidr_block

  // required for nodeJs to resolve host names
  // otherwise you will get something like "Invariant: failed to start render worker Error: getaddrinfo ENOTFOUND xxxxxx-xxx"
  enable_dns_hostnames = true

  tags = {
    Name = var.resource_prefix
  }
}

resource "aws_internet_gateway" "gateway" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = var.resource_prefix
  }
}


resource "aws_subnet" "subnet" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.cidr_block
  availability_zone = data.aws_availability_zones.zones.names[0]

  map_public_ip_on_launch = true

  tags = {
    Name = var.resource_prefix
  }
}

// route all traffic to internet
resource "aws_route_table" "table" {
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gateway.id
  }

  tags = {
    Name = "${var.resource_prefix}"
  }
}

resource "aws_route_table_association" "association" {
  subnet_id      = aws_subnet.subnet.id
  route_table_id = aws_route_table.table.id
}



resource "aws_eip" "public_2_eip" {
  tags = {
    Name = var.resource_prefix
  }
}

resource "aws_nat_gateway" "public_2_nat" {
  allocation_id = aws_eip.public_2_eip.id
  subnet_id     = aws_subnet.public_2.id

  depends_on = [aws_internet_gateway.ig]

  tags = {
    Name = var.resource_prefix
  }
}

///////////////////////////////////////////////////////////////////////////

resource "aws_subnet" "public_2" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.public_subnet_2_cidr
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "${var.resource_prefix}-public-subnet-2"
  }
}

resource "aws_route_table" "public_2" {
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ig.id // route all traffic to internet
  }

  tags = {
    Name = "${var.resource_prefix}-public-route-table-2"
  }
}

resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public_2.id
}

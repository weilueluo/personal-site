
resource "aws_eip" "public_1_eip" {
  tags = {
    Name = var.resource_prefix
  }
}

resource "aws_nat_gateway" "public_1_nat" {
  allocation_id = aws_eip.public_1_eip.id
  subnet_id     = aws_subnet.public_1.id

  depends_on = [aws_internet_gateway.ig]

  tags = {
    Name = var.resource_prefix
  }
}

///////////////////////////////////////////////////////////////////////////

resource "aws_subnet" "public_1" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.public_subnet_1_cidr
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "${var.resource_prefix}-public-subnet-1"
  }
}

resource "aws_route_table" "public_1" {
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ig.id // route all traffic to internet
  }

  tags = {
    Name = "${var.resource_prefix}-public-route-table-1"
  }
}

resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public_1.id
}

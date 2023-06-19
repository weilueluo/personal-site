resource "aws_internet_gateway" "v3" {
  vpc_id = aws_vpc.v3.id

  tags = {
    Name = var.resource_prefix
  }
}

resource "aws_route_table" "v3" {
  vpc_id = aws_vpc.v3.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.v3.id
  }
  tags = {
    Name = var.resource_prefix
  }
}

resource "aws_route_table_association" "v3_1" {
  subnet_id      = aws_subnet.v3_1.id
  route_table_id = aws_route_table.v3.id
}

resource "aws_route_table_association" "v3_2" {
  subnet_id      = aws_subnet.v3_2.id
  route_table_id = aws_route_table.v3.id
}

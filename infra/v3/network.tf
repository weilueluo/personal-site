
resource "aws_vpc" "v3" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "v3"
  }
}

resource "aws_subnet" "v3" {
  vpc_id     = aws_vpc.v3.id
  cidr_block = "10.0.1.0/24"

  tags = {
    Name = "v3"
  }
}


resource "aws_route_table" "v3" {
  vpc_id = aws_vpc.v3.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.v3.id
  }
  tags = {
    "Name" = "v3"
  }
}

resource "aws_internet_gateway" "v3" {
  vpc_id = aws_vpc.v3.id

  tags = {
    Name = "v3"
  }
}

resource "aws_route_table_association" "v3" {
  subnet_id      = aws_subnet.v3.id
  route_table_id = aws_route_table.v3.id
}

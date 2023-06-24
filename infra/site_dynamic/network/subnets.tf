data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_subnet" "v3_1" {
  vpc_id            = aws_vpc.v3.id
  cidr_block        = var.subnet_1_cidr
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "${var.resource_prefix}-subnet-1"
  }
}

resource "aws_subnet" "v3_2" {
  vpc_id            = aws_vpc.v3.id
  cidr_block        = var.subnet_2_cidr
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "${var.resource_prefix}-subnet-2"
  }
}

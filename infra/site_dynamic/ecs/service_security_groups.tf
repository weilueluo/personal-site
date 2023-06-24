resource "aws_security_group" "service" {
  name        = "${var.resource_prefix}-ecs-service-sg"
  description = "Allow personal website v3 traffic"
  vpc_id      = var.vpc_id

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    description = "Container traffic"
    from_port   = var.port
    to_port     = var.port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Prefix = var.resource_prefix
  }

  lifecycle {
    create_before_destroy = true
  }
}

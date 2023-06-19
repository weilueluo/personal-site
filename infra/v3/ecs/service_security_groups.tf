resource "aws_security_group" "v3_ecs_service" {
  name        = "v3_ecs_service_security_group"
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
    description = "NextJs"
    from_port   = var.container_port
    to_port     = var.container_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "v3"
  }

  lifecycle {
    create_before_destroy = true
  }
}

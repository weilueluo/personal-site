

resource "aws_security_group" "lb_sg" {
  name   = "${var.resource_prefix}-lb-sg"
  vpc_id = var.vpc_id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description     = "Allow HTTP from/to target group"
    from_port       = var.target_port
    to_port         = var.target_port
    protocol        = "tcp"
    security_groups = var.target_sg
  }

  lifecycle {
    create_before_destroy = true
  }
}

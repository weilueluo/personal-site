

resource "aws_security_group" "v3_load_balancer_security_group" {
  name   = "v3_load_balancer_security_group"
  vpc_id = var.vpc_id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description     = "HTTP"
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = var.egress_security_groups
  }

  lifecycle {
    create_before_destroy = true
  }
}

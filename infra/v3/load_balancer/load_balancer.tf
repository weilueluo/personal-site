resource "aws_alb" "v3" {
  name               = var.name
  internal           = false
  load_balancer_type = "application"
  ip_address_type    = "ipv4"

  subnets = var.subnets

  security_groups = [aws_security_group.v3_load_balancer_security_group.id]

  # enable_deletion_protection = true

  # access_logs {
  #   bucket  = aws_s3_bucket.access_logs.bucket
  #   enabled = true
  # }
}

resource "aws_lb_listener" "v3" {
  load_balancer_arn = aws_alb.v3.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.v3.arn
  }
}

resource "aws_lb_target_group" "v3" {
  name        = "v3-load-balancer-target-group"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path = "/api/health"
  }
}



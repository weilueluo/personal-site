resource "aws_alb" "v3" {
  name               = "${var.resource_prefix}-lb"
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

resource "aws_lb_target_group" "v3" {
  name        = "${var.resource_prefix}-lb-tg"
  port        = var.target_container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path = "/api/health"
  }
}


resource "aws_lb_listener" "HTTPS" {
  load_balancer_arn = aws_alb.v3.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.ssl_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.v3.arn
  }
}

resource "aws_lb_listener" "HTTP" {
  load_balancer_arn = aws_alb.v3.arn
  port              = 80
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.v3.arn
  }
}

moved {
  from = aws_lb_listener.v3
  to   = aws_lb_listener.HTTP
}




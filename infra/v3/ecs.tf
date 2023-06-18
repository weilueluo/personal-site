resource "aws_ecs_task_definition" "v3" {
  family                   = "v3-family"
  cpu                      = 256
  memory                   = 512
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.v3_task_execution_role.arn

  container_definitions = jsonencode([{
    name  = "v3_task_definition"
    image = "public.ecr.aws/d0l7r8j1/personal-website-v3:ep"
    portMappings = [
      {
        containerPort = 3000
        hostPort      = 3000
        protocol      = "tcp"
      }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-create-group : "true",
        awslogs-group         = "personal-website-v3"
        awslogs-region        = "eu-west-2"
        awslogs-stream-prefix = "personal-website-v3"
      }
    }
    essential = true
  }])
}

resource "aws_ecs_cluster" "v3" {
  name = "cluster-v3"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "v3" {
  cluster_name = aws_ecs_cluster.v3.name

  capacity_providers = ["FARGATE"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE"
  }
}

resource "aws_ecs_service" "v3" {
  name            = "v3_service"
  cluster         = aws_ecs_cluster.v3.id
  task_definition = aws_ecs_task_definition.v3.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  # wait_for_steady_state = true

  network_configuration {
    subnets          = [aws_subnet.v3.id]
    assign_public_ip = true
    security_groups  = [aws_security_group.allow_tls.id]
  }

  # load_balancer {
  #   target_group_arn = aws_lb_target_group.foo.arn
  #   container_name   = "mongo"
  #   container_port   = 8080
  # }
}

resource "aws_security_group" "v3" {
  name        = "v3"
  description = "Allow personal website v3 traffic"
  vpc_id      = aws_vpc.v3.id

  ingress {
    description = "TLS from VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    description = "NextJs"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "v3"
  }
}

moved {
  from = aws_security_group.allow_tls
  to   = aws_security_group.v3
}

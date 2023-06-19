resource "aws_ecs_task_definition" "v3" {
  family                   = "v3-family"
  cpu                      = 256
  memory                   = 512
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.v3_task_execution_role.arn

  container_definitions = jsonencode([{
    name  = local.container_name
    image = var.image
    portMappings = [
      {
        containerPort = var.container_port
        hostPort      = var.container_port
        protocol      = "tcp"
      }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-create-group  = "true",
        awslogs-group         = "personal-website-v3-log-group"
        awslogs-region        = "eu-west-2"
        awslogs-stream-prefix = "personal-website-v3-stream"
      }
    }
    essential = true
  }])
}

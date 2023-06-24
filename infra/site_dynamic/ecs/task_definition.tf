data "aws_region" "current" {}

resource "aws_ecs_task_definition" "task_definition" {
  family                   = "${var.resource_prefix}-family"
  cpu                      = var.cpu
  memory                   = var.memory
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.task_execution.arn

  container_definitions = jsonencode([{
    name  = local.container_name
    image = var.image
    portMappings = [
      {
        containerPort = var.port
        hostPort      = var.port
        protocol      = "tcp"
      }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-create-group  = "true",
        awslogs-group         = "${var.resource_prefix}-lg"
        awslogs-region        = data.aws_region.current.name
        awslogs-stream-prefix = var.resource_prefix
      }
    }
    essential = true
  }])
}

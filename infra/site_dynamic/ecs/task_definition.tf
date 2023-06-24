data "aws_region" "current" {}

resource "aws_ecs_task_definition" "v3" {
  family                   = "${var.resource_prefix}-family"
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
        awslogs-group         = "${var.resource_prefix}-lg"
        awslogs-region        = data.aws_region.current.name
        awslogs-stream-prefix = var.resource_prefix
      }
    }
    essential = true
  }])
}

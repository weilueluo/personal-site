resource "aws_ecs_service" "service" {
  name            = "${var.resource_prefix}-service"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.task_definition.arn
  desired_count   = 1
  launch_type     = "FARGATE"


  network_configuration {
    subnets          = var.subnets
    assign_public_ip = true
    security_groups  = [aws_security_group.service.id]
  }

  wait_for_steady_state = true

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  lifecycle {
    replace_triggered_by = [aws_security_group.service]
  }

  load_balancer {
    target_group_arn = var.tg_arn
    container_name   = local.container_name
    container_port   = var.port
  }
}


resource "aws_ecs_service" "v3" {
  name            = "v3_service"
  cluster         = aws_ecs_cluster.v3.id
  task_definition = aws_ecs_task_definition.v3.arn
  desired_count   = 1
  launch_type     = "FARGATE"


  network_configuration {
    subnets          = var.service_subnets
    assign_public_ip = true
    security_groups  = [aws_security_group.v3_ecs_service.id]
  }

  wait_for_steady_state = true

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  lifecycle {
    replace_triggered_by = [aws_security_group.v3_ecs_service]
  }

  load_balancer {
    target_group_arn = var.load_balancer_target_group_arn
    container_name   = local.container_name
    container_port   = var.container_port
  }
}


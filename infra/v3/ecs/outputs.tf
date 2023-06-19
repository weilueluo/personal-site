output "cluster_name" {
  value = aws_ecs_cluster.v3.name
}

output "service_name" {
  value = aws_ecs_service.v3.name
}

output "service_security_group" {
  value = aws_security_group.v3_ecs_service.name
}

output "task_definition_family" {
  value = aws_ecs_task_definition.v3.family
}

output "container_name" {
  value = local.container_name
}

output "task_execution_role" {
  value = aws_iam_role.v3_task_execution_role.name
}

output "service_security_group_id" {
  value = aws_security_group.v3_ecs_service.id
}

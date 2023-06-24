data "aws_iam_policy_document" "v3_assume_role_policy_document" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "v3_task_execution_role" {
  name               = "${var.resource_prefix}-task-execution-role"
  assume_role_policy = data.aws_iam_policy_document.v3_assume_role_policy_document.json

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
    "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess",
  ]
}

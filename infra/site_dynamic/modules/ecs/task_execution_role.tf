data "aws_iam_policy_document" "ecs_task_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "ecs_task_pull_from_ecr" {
  statement {
    actions = [
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer",
      "ecr:GetAuthorizationToken"
    ]
    effect    = "Allow"
    resources = ["*"]
  }
}


resource "aws_iam_role" "task_execution" {
  name               = "${var.resource_prefix}-task-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
    "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
  ]

  inline_policy {
    name   = "allow-pull-from-ecr"
    policy = data.aws_iam_policy_document.ecs_task_pull_from_ecr.json
  }
}

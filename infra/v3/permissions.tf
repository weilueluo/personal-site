data "aws_iam_policy_document" "v3_assume_role_policy_document" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "v3_pull_container_policy_document" {
  statement {
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
      "ecr:PutImage"
    ]
    effect    = "Allow"
    resources = ["*"]
  }
}

resource "aws_iam_role" "v3_task_execution_role" {
  name               = "v3_task_execution_role"
  assume_role_policy = data.aws_iam_policy_document.v3_assume_role_policy_document.json

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
    "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess",
  ]

  inline_policy {
    name   = "v3_pull_container_policy"
    policy = data.aws_iam_policy_document.v3_pull_container_policy_document.json
  }
}

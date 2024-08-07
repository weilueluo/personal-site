resource "aws_backup_plan" "plan" {
  name = "${var.resource_prefix}_backup_plan"

  rule {
    rule_name         = "${var.resource_prefix}_backup_rule"
    target_vault_name = aws_backup_vault.vault.name
    schedule          = "cron(0 0 * * ? *)" # daily at midnight

    lifecycle {
      delete_after = 14 # delete after 14 days
    }
  }
}

resource "aws_backup_vault" "vault" {
  name = "${var.resource_prefix}_backup_vault"
  tags = {
    resource_prefix = var.resource_prefix
  }
}

resource "aws_backup_selection" "selection" {
  name         = "${var.resource_prefix}_backup_selection"
  plan_id      = aws_backup_plan.plan.id
  resources    = [aws_dynamodb_table.table.arn]
  iam_role_arn = aws_iam_role.role.arn
}

data "aws_iam_policy_document" "document" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["backup.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "role" {
  name               = "${var.resource_prefix}_backup_role"
  assume_role_policy = data.aws_iam_policy_document.document.json
}

resource "aws_iam_role_policy_attachment" "attachment" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
  role       = aws_iam_role.role.name
}

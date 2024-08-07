resource "aws_cognito_identity_pool" "pool" {
  identity_pool_name               = "${var.resource_prefix}_identity_pool"
  allow_unauthenticated_identities = true

  tags = {
    resource_prefix = var.resource_prefix
  }
}

resource "aws_cognito_identity_pool_roles_attachment" "attachment" {
  identity_pool_id = aws_cognito_identity_pool.pool.id
  roles = {
    "unauthenticated" = aws_iam_role.role.arn
  }
}

resource "aws_iam_role" "role" {
  name               = "${var.resource_prefix}_cognito_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
  inline_policy {
    name   = "dynamo"
    policy = data.aws_iam_policy_document.dynamo.json
  }
}


data "aws_iam_policy_document" "dynamo" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchGetItem",
      "dynamodb:DescribeTable",
      "dynamodb:ListTables",
      "dynamodb:PutItem",
    ]
    resources = [var.dynamodb_arn]
  }
  statement {
    effect = "Deny"
    actions = [
      "dynamodb:UpdateItem", # I want create item but not update item, not sure if this works
      "dynamodb:DeleteItem"
    ]
    resources = [var.dynamodb_arn]
  }
}


data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = ["cognito-identity.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "cognito-identity.amazonaws.com:aud"
      values   = [aws_cognito_identity_pool.pool.id]
    }
  }
}

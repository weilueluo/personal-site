locals {
  table_name = "${var.resource_prefix}-table"
}

resource "aws_dynamodb_table" "table" {
  name         = local.table_name
  billing_mode = "PAY_PER_REQUEST"
  table_class  = "STANDARD"
  hash_key     = var.partition_key.name
  range_key    = var.sort_key.name

  attribute {
    name = var.partition_key.name
    type = var.partition_key.type
  }

  attribute {
    name = var.sort_key.name
    type = var.sort_key.type
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name = local.table_name
  }
}

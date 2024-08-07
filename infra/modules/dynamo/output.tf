

output "arn" {
  value = aws_dynamodb_table.table.arn
}

output "table_name" {
  value = aws_dynamodb_table.table.name
}
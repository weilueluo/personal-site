
# resource "aws_s3_bucket" "access_logs" {
#   bucket = var.access_logs_bucket
# }

# resource "aws_s3_bucket_server_side_encryption_configuration" "v3" {
#   bucket = aws_s3_bucket.access_logs.id

#   rule {
#     apply_server_side_encryption_by_default {
#       sse_algorithm     = "aws:kms"
#     }
#   }
# }

# data "aws_iam_policy_document" "allow_load_balancer_access" {
#   statement {
#     sid = "AllowLoadBalancerAccessS3AccessLogs"
#     principals {
#       type        = "AWS"
#       identifiers = ["arn:aws:iam::${var.lb_account_id}:root"]
#     }
#     actions = ["s3:PutObject"]
#     resources = [
#       aws_s3_bucket.access_logs.arn,
#       "${aws_s3_bucket.access_logs.arn}/*"
#     ]
#   }
# }

# resource "aws_s3_bucket_policy" "access_logs" {
#   bucket = aws_s3_bucket.access_logs.id
#   policy = data.aws_iam_policy_document.allow_load_balancer_access.json
# }



resource "aws_s3_bucket" "logging" {
  bucket = "${var.resource_prefix}-lwl-personal-website-logging"
}

resource "aws_s3_bucket_policy" "logging" {
  bucket = aws_s3_bucket.logging.id
  policy = data.aws_iam_policy_document.logging.json
}

resource "aws_s3_bucket_public_access_block" "logging" {
  bucket = aws_s3_bucket.logging.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "logging" {
  bucket = aws_s3_bucket.logging.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "logging" {
  bucket = aws_s3_bucket.logging.id
  acl    = "private"

  depends_on = [aws_s3_bucket_ownership_controls.logging]
}

data "aws_iam_policy_document" "logging" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    actions   = ["s3:GetObject", "s3:PutObject"]
    resources = ["arn:aws:s3:::${aws_s3_bucket.logging.id}/*"]
    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn"
      values   = [aws_cloudfront_distribution.ss.arn]
    }
  }
}

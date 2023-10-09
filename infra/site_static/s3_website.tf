
resource "aws_s3_bucket" "ss" {
  bucket = "${var.resource_prefix}-static-website"
}

resource "aws_s3_bucket_website_configuration" "ss" {
  bucket = aws_s3_bucket.ss.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "ss" {
  bucket = aws_s3_bucket.ss.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "ss" {
  bucket = aws_s3_bucket.ss.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_policy" "ss" {
  bucket = aws_s3_bucket.ss.id
  policy = data.aws_iam_policy_document.ss.json
}

resource "aws_s3_bucket_acl" "ss" {
  bucket = aws_s3_bucket.ss.id
  acl    = "private"

  depends_on = [aws_s3_bucket_ownership_controls.ss]
}

data "aws_iam_policy_document" "ss" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    actions   = ["s3:GetObject"]
    resources = ["arn:aws:s3:::${aws_s3_bucket.ss.id}/*"]
    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn"
      values   = [aws_cloudfront_distribution.ss.arn]
    }
  }
}

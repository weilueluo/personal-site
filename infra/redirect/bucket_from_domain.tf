// s3 redirect to target domain

resource "aws_s3_bucket" "from_domain_bucket" {
  bucket = var.from_domain

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_website_configuration" "redirect" {
  bucket = aws_s3_bucket.from_domain_bucket.id

  redirect_all_requests_to {
    host_name = var.to_domain
  }
}

resource "aws_s3_bucket_public_access_block" "access_block" {
  bucket = aws_s3_bucket.from_domain_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "ownership_controls" {
  bucket = aws_s3_bucket.from_domain_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_policy" "policy" {
  bucket = aws_s3_bucket.from_domain_bucket.id
  policy = data.aws_iam_policy_document.allow_cloudfront_access.json
}

resource "aws_s3_bucket_acl" "private_acl" {
  bucket = aws_s3_bucket.from_domain_bucket.id
  acl    = "private"
}

data "aws_iam_policy_document" "allow_cloudfront_access" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    actions   = ["s3:GetObject"]
    resources = ["arn:aws:s3:::${aws_s3_bucket.from_domain_bucket.id}/*"]
    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn"
      values   = [aws_cloudfront_distribution.distribution.arn]
    }
  }
}


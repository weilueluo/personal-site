
resource "aws_s3_bucket" "v1" {
  bucket = "luoweilue-personal-website-v1"
}

resource "aws_s3_bucket_website_configuration" "v1" {
  bucket = aws_s3_bucket.v1.id

  index_document {
    suffix = "index.html"
  }
}

# below are configs to make it publicly available

resource "aws_s3_bucket_policy" "v1" {
  bucket = aws_s3_bucket.v1.id
  policy = data.aws_iam_policy_document.v1.json
}

data "aws_iam_policy_document" "v1" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    actions   = ["s3:GetObject"]
    resources = ["arn:aws:s3:::${aws_s3_bucket.v1.id}/*"]
  }
}


resource "aws_s3_bucket_ownership_controls" "v1" {
  bucket = aws_s3_bucket.v1.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "v1" {
  bucket = aws_s3_bucket.v1.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "v1" {
  depends_on = [
    aws_s3_bucket_ownership_controls.v1,
    aws_s3_bucket_public_access_block.v1,
  ]

  bucket = aws_s3_bucket.v1.id
  acl    = "public-read"
}
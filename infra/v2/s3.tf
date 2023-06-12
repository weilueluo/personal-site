
resource "aws_s3_bucket" "v2" {
  bucket = "luoweilue-personal-website-v2"
}

resource "aws_s3_bucket_website_configuration" "v2" {
  bucket = aws_s3_bucket.v2.id

  index_document {
    suffix = "index.html"
  }
}

# below are configs to make it publicly available

resource "aws_s3_bucket_policy" "v2" {
  bucket = aws_s3_bucket.v2.id
  policy = data.aws_iam_policy_document.v2.json
}

data "aws_iam_policy_document" "v2" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    actions   = ["s3:GetObject"]
    resources = ["arn:aws:s3:::${aws_s3_bucket.v2.id}/*"]
  }
}


resource "aws_s3_bucket_ownership_controls" "v2" {
  bucket = aws_s3_bucket.v2.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "v2" {
  bucket = aws_s3_bucket.v2.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "v2" {
  depends_on = [
    aws_s3_bucket_ownership_controls.v2,
    aws_s3_bucket_public_access_block.v2,
  ]

  bucket = aws_s3_bucket.v2.id
  acl    = "public-read"
}
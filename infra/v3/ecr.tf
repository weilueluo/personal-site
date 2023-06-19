resource "aws_ecr_repository" "v3" {
  name                 = "personal-website-v3"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}
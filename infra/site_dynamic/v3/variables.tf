variable "resource_prefix" {}

variable "instance_type" {
  default = "t3.micro"
}

variable "cidr_block" {}

variable "image" {}

variable "port" {
  type = number
}

variable "domain_name" {}

variable "zone_name" {}

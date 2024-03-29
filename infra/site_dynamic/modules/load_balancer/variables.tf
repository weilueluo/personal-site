variable "resource_prefix" {
  type = string
}

variable "subnets" {
  type = list(string)
}

variable "target_sg" {
  type = list(string)
}

variable "vpc_id" {
  type = string
}

# variable "lb_account_id" {
#   type = string
# }

variable "target_port" {
  type = number
}

variable "ssl_certificate_arn" {
  type = string
}

variable "health_check_path" {
  type = string
}

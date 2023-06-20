variable "resource_prefix" {
  type = string
}

variable "subnets" {
  type = list(string)
}

variable "target_security_groups" {
  type = list(string)
}

variable "vpc_id" {
  type = string
}

# variable "lb_account_id" {
#   type = string
# }

variable "target_container_port" {
  type = number
}

variable "ssl_certificate_arn" {
  type = string
}
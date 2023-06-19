

variable "name" {
  type = string
}

variable "access_logs_bucket" {
  type = string
}

variable "subnets" {
  type = list(string)
}

variable "egress_security_groups" {
  type = list(string)
}

variable "vpc_id" {
  type = string
}

variable "lb_account_id" {
  type = string
}

variable "container_port" {
  type = number
}

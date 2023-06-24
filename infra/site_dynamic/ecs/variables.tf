variable "vpc_id" {
  type = string
}

variable "service_subnets" {
  type = list(string)
}

variable "image" {
  type = string
}

variable "target_group_arn" {
  type = string
}

variable "container_port" {
  type = number
}

variable "resource_prefix" {
  type = string
}

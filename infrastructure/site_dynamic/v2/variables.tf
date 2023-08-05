# variable "lb_account_id" {
#   type = string
# }

variable "resource_prefix" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "zone_name" {
  type        = string
  description = "zone name to create records and certificate for ssl"
}

variable "image" {
  type        = string
  description = "pulled to run in fargate container"
}

variable "health_check_path" {
  type = string
}

variable "port" {
  type        = number
  description = "port to expose in fargate container, also connected to target group"
}

variable "cpu" {
  type = number
}

variable "memory" {
  type = number
}

variable "vpc_id" {
  type = string
}

variable "subnets" {
  type = list(string)
}

variable "image" {
  type = string
}

variable "tg_arn" {
  type        = string
  description = "target group arn to connect to load balancer"
}

variable "port" {
  type = number
}

variable "resource_prefix" {
  type = string
}

variable "cpu" {
  type = number
}

variable "memory" {
  type = number
}
variable "vpc_id" {
  type = string
}

variable "service_subnets" {
  type = list(string)
}

variable "image" {
  type = string
}

variable "cluster_name" {
  type = string
}

variable "load_balancer_target_group_arn" {
  type = string
}

variable "container_port" {
  type = number
}
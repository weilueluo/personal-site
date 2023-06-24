variable "from_domain" {
  type        = string
  description = "domain to redirect from, you must have a hosted zone for it"
}

variable "to_domain" {
  type = string
}

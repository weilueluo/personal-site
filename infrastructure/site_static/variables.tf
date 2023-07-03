variable "resource_prefix" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "zone_name" {
  type        = string
  description = "zone name to host the site, will create records in it"
}

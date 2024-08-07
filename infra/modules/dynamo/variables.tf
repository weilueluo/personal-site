variable "resource_prefix" {

}

variable "partition_key" {
  type = object({
    name = string
    type = string
  })
}

variable "sort_key" {
  type = object({
    name = string
    type = string
  })
}



output "v1" {
  value = module.v1
}

output "v2" {
  value = module.v2
}

output "v3" {
  value = module.v3
}


output "redirect" {
  value = tomap({
    "luoweilue.com" : module.luoweilue_com_redirect,
    "weilueluo.com" : module.weilueluo_com_redirect
  })
}

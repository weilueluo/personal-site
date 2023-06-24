module "network" {
  source = "./network"

  vpc_cidr        = "10.1.0.0/16"
  resource_prefix = var.resource_prefix

  subnet_1_cidr = "10.1.1.0/24"
  subnet_2_cidr = "10.1.2.0/24"
}

module "load_balancer" {
  source = "./load_balancer"

  vpc_id          = module.network.vpc_id
  resource_prefix = var.resource_prefix

  subnets                = [module.network.subnet_1_id, module.network.subnet_2_id]
  target_security_groups = [module.ecs.service_security_group_id]
  target_container_port  = var.container_port
  ssl_certificate_arn    = module.route53.ssl_certificate_arn
  health_check_path      = var.health_check_path
  # lb_account_id          = var.lb_account_id
}

module "route53" {
  source = "./route53"

  domain_name = var.domain_name
  lb_dns_name = module.load_balancer.lb_dns_name
  lb_zone_id  = module.load_balancer.lb_zone_id
}

module "ecs" {
  source = "./ecs"

  vpc_id          = module.network.vpc_id
  resource_prefix = var.resource_prefix

  image            = var.image
  container_port   = var.container_port
  service_subnets  = [module.network.subnet_1_id, module.network.subnet_2_id]
  target_group_arn = module.load_balancer.target_group_arn
}

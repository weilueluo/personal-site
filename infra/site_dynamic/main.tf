module "network" {
  source = "./network"

  resource_prefix       = var.resource_prefix
  vpc_cidr              = "10.1.0.0/16"
  public_subnet_1_cidr  = "10.1.1.0/24"
  public_subnet_2_cidr  = "10.1.2.0/24"
  private_subnet_1_cidr = "10.1.3.0/24"
  private_subnet_2_cidr = "10.1.4.0/24"
}

module "load_balancer" {
  source = "./load_balancer"

  vpc_id          = module.network.vpc_id
  resource_prefix = var.resource_prefix

  subnets             = [module.network.public_subnet_1_id, module.network.public_subnet_2_id]
  target_sg           = [module.ecs.service_sg_id]
  target_port         = var.port
  ssl_certificate_arn = module.route53.ssl_certificate_arn
  health_check_path   = var.health_check_path
  # lb_account_id          = var.lb_account_id
}

module "route53" {
  source = "./route53"

  domain_name = var.domain_name
  zone_name   = var.zone_name
  lb_dns_name = module.load_balancer.lb_dns_name
  lb_zone_id  = module.load_balancer.lb_zone_id
}

module "ecs" {
  source = "./ecs"

  vpc_id          = module.network.vpc_id
  resource_prefix = var.resource_prefix

  image   = var.image
  port    = var.port
  subnets = [module.network.private_subnet_1_id, module.network.private_subnet_2_id]
  tg_arn  = module.load_balancer.tg_arn
  cpu     = var.cpu
  memory  = var.memory
}

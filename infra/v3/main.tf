locals {
  container_port = 3000
}

module "network" {
  source = "./network"

  vpc_cidr      = "10.1.0.0/16"
  subnet_1_cidr = "10.1.1.0/24"
  subnet_2_cidr = "10.1.2.0/24"
}

module "ecs" {
  source = "./ecs"

  cluster_name                   = "v3_cluster"
  vpc_id                         = module.network.vpc_id
  service_subnets                = [module.network.subnet_1_id, module.network.subnet_2_id]
  image                          = "public.ecr.aws/d0l7r8j1/personal-website-v3:latest"
  container_port                 = local.container_port
  load_balancer_target_group_arn = module.load_balancer.target_group_arn
}

module "load_balancer" {
  source = "./load_balancer"

  vpc_id                 = module.network.vpc_id
  name                   = "v3-load-balancer"
  access_logs_bucket     = "v3-load-balancer-access-logs"
  subnets                = [module.network.subnet_1_id, module.network.subnet_2_id]
  egress_security_groups = [module.ecs.service_security_group_id]
  lb_account_id          = var.lb_account_id
  container_port         = local.container_port
}

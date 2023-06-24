<!-- BEGIN_TF_DOCS -->
## Requirements

No requirements.

## Providers

No providers.

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_ecs"></a> [ecs](#module\_ecs) | ./ecs | n/a |
| <a name="module_load_balancer"></a> [load\_balancer](#module\_load\_balancer) | ./load_balancer | n/a |
| <a name="module_network"></a> [network](#module\_network) | ./network | n/a |
| <a name="module_route53"></a> [route53](#module\_route53) | ./route53 | n/a |

## Resources

No resources.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_cpu"></a> [cpu](#input\_cpu) | n/a | `number` | n/a | yes |
| <a name="input_domain_name"></a> [domain\_name](#input\_domain\_name) | n/a | `string` | n/a | yes |
| <a name="input_health_check_path"></a> [health\_check\_path](#input\_health\_check\_path) | n/a | `string` | n/a | yes |
| <a name="input_image"></a> [image](#input\_image) | pulled to run in fargate container | `string` | n/a | yes |
| <a name="input_memory"></a> [memory](#input\_memory) | n/a | `number` | n/a | yes |
| <a name="input_port"></a> [port](#input\_port) | port to expose in fargate container, also connected to target group | `number` | n/a | yes |
| <a name="input_resource_prefix"></a> [resource\_prefix](#input\_resource\_prefix) | n/a | `string` | n/a | yes |
| <a name="input_zone_name"></a> [zone\_name](#input\_zone\_name) | zone name to create records and certificate for ssl | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_ecs"></a> [ecs](#output\_ecs) | n/a |
| <a name="output_load_balancer"></a> [load\_balancer](#output\_load\_balancer) | n/a |
| <a name="output_network"></a> [network](#output\_network) | n/a |
| <a name="output_route53"></a> [route53](#output\_route53) | n/a |
<!-- END_TF_DOCS -->
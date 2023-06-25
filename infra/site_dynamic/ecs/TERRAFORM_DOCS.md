<!-- BEGIN_TF_DOCS -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_ecs_cluster.cluster](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_cluster) | resource |
| [aws_ecs_cluster_capacity_providers.v3](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_cluster_capacity_providers) | resource |
| [aws_ecs_service.service](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_service) | resource |
| [aws_ecs_task_definition.task_definition](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition) | resource |
| [aws_iam_role.task_execution](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_security_group.service](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_iam_policy_document.ecs_task_assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.ecs_task_pull_from_ecr](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_region.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_cpu"></a> [cpu](#input\_cpu) | n/a | `number` | n/a | yes |
| <a name="input_image"></a> [image](#input\_image) | n/a | `string` | n/a | yes |
| <a name="input_memory"></a> [memory](#input\_memory) | n/a | `number` | n/a | yes |
| <a name="input_port"></a> [port](#input\_port) | n/a | `number` | n/a | yes |
| <a name="input_resource_prefix"></a> [resource\_prefix](#input\_resource\_prefix) | n/a | `string` | n/a | yes |
| <a name="input_subnets"></a> [subnets](#input\_subnets) | n/a | `list(string)` | n/a | yes |
| <a name="input_tg_arn"></a> [tg\_arn](#input\_tg\_arn) | target group arn to connect to load balancer | `string` | n/a | yes |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | n/a | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_cluster_name"></a> [cluster\_name](#output\_cluster\_name) | n/a |
| <a name="output_container_name"></a> [container\_name](#output\_container\_name) | n/a |
| <a name="output_image"></a> [image](#output\_image) | n/a |
| <a name="output_service_name"></a> [service\_name](#output\_service\_name) | n/a |
| <a name="output_service_sg_id"></a> [service\_sg\_id](#output\_service\_sg\_id) | security group id for the ECS service, used to allow traffic from the load balancer |
<!-- END_TF_DOCS -->
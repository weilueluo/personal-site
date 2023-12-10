<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 4.0 |

## Providers

No providers.

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_luoweilue_com_redirect"></a> [luoweilue\_com\_redirect](#module\_luoweilue\_com\_redirect) | ./redirect | n/a |
| <a name="module_v1"></a> [v1](#module\_v1) | ./site_static | n/a |
| <a name="module_v2"></a> [v2](#module\_v2) | ./site_static | n/a |
| <a name="module_v3"></a> [v3](#module\_v3) | ./site_dynamic/v3 | n/a |
| <a name="module_weilueluo_com_redirect"></a> [weilueluo\_com\_redirect](#module\_weilueluo\_com\_redirect) | ./redirect | n/a |

## Resources

No resources.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_image"></a> [image](#input\_image) | n/a | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_redirect"></a> [redirect](#output\_redirect) | n/a |
| <a name="output_v1"></a> [v1](#output\_v1) | n/a |
| <a name="output_v2"></a> [v2](#output\_v2) | n/a |
| <a name="output_v3"></a> [v3](#output\_v3) | n/a |
<!-- END_TF_DOCS -->
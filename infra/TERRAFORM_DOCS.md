<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 4.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 4.67.0 |
| <a name="provider_aws.ue1"></a> [aws.ue1](#provider\_aws.ue1) | 4.67.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_v1"></a> [v1](#module\_v1) | ./static_site | n/a |
| <a name="module_v2"></a> [v2](#module\_v2) | ./static_site | n/a |
| <a name="module_v3"></a> [v3](#module\_v3) | ./v3 | n/a |

## Resources

| Name | Type |
|------|------|
| [aws_acm_certificate.v1_v2](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/acm_certificate) | resource |
| [aws_route53_record.dns_validation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_zone.zone](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/route53_zone) | data source |

## Inputs

No inputs.

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_v1"></a> [v1](#output\_v1) | n/a |
| <a name="output_v2"></a> [v2](#output\_v2) | n/a |
| <a name="output_v3"></a> [v3](#output\_v3) | n/a |
<!-- END_TF_DOCS -->
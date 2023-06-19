# Infra


### Utilities
**get task arns**
```bash
aws ecs list-tasks --cluster cluster_name_or_arn | jq '.taskArns[0]'
```
**get network interface**
```bash
aws ecs describe-tasks --cluster cluster_name_or_arn --tasks task_arn | jq '.tasks[0].attachments[0].details[1]'
```

**get public/private ip**
```bash
aws ec2 describe-network-interfaces --network-interface-ids eni_id | jq '.NetworkInterfaces[0].PrivateIpAddresses[0]'
```
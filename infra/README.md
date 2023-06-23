# Infra
This infra package contains code for hosting personal website v1/v2/v3 on aws.
- **v1** and **v2** are static sites, meaning that they can be hosted in s3 bucket.
- **v3** is not static and requires a server to run.

### Deployment Steps
1. Setup AWS credentials locally.
2. Modify `infra/main.tf` to suit your needs.
3. Modify and run `docker-publish.sh` in `v3` folder to build the docker image and upload to correct docker repository.
4. `terraform plan -out "plan.json"`.
5. `terraform apply "plan.json"`.
6. Upload `v1` and `v2` static files to respective bucket
   1. `v1`'s files are located in `v1/src/public`.
   2. `v2`'s files are located in `v2/out`.
   - Terraform outputs contains bucket name.
   - You may need to follow instruction to compile and get those files.

#### Notes
For the url you want to deploy v3, you should have a hosted zone.

- If you see error in apply: AccessControlListNotSupported, just plan and apply again

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
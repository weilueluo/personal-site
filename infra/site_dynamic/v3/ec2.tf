# key pair for ssh
resource "tls_private_key" "key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "key_pair" {
  key_name   = "${var.resource_prefix}-key-pair"
  public_key = tls_private_key.key.public_key_openssh

  tags = {
    Name = "${var.resource_prefix}"
  }

  # output key for ssh use
  provisioner "local-exec" {
    command = <<EOF
echo """${tls_private_key.key.private_key_pem}""" > ${path.root}/${aws_key_pair.key_pair.key_name}.pem
chmod 400 ${path.root}/${aws_key_pair.key_pair.key_name}.pem
EOF
  }
}

# get a docker ami
data "aws_ami" "ami" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["*docker_amazon_linux_2-*"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

data "template_file" "user_data" {
  template = file("${path.module}/user_data.tpl")
  vars = {
    image = "${var.image}"
    port  = "${var.port}"
  }
}

# instance
resource "aws_instance" "instance" {
  ami             = data.aws_ami.ami.id
  instance_type   = var.instance_type
  subnet_id       = aws_subnet.subnet.id
  security_groups = [aws_security_group.security_group.id]

  associate_public_ip_address = true
  key_name                    = aws_key_pair.key_pair.key_name
  user_data                   = data.template_file.user_data.rendered

  tags = {
    Name = var.resource_prefix
  }

  depends_on = [aws_internet_gateway.gateway]
}


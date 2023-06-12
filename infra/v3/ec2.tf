



# aws ssh stuff

resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh"
  description = "Allow SSH"

  ingress {
    description = "Allow SSH inbound traffic"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    description = "Allow all outbound traffic by default"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

resource "aws_key_pair" "v3" {
  key_name   = "personal-website-v3-ssh-key"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDYYtmmKp59m42b1C40CULtE5zOkUA0kuoEsMzz6no/dmv2aniNftClc6VZ+sdJqp+Wi/uw4fFDutQCgUG0yupoJmxtNJ2NKEVWm+JMLNvKcfgq1EEVY1tYw/WdiyIIqRNgFd9gnAQIIQgRC1mGiXHMYKHoDmo6nxvZKEO2+VrzxqJU2kxyVZF1cQrh6RFdJU+pLR98T7p2Db32/FyE8OvTefOYd3Np663FUrXbofO0vxKJKPdUV4kfKxaUfBMhSMc5EeA+v0da4PYcM7tdYWAdyWkpY1Ctzp/NefT8z2HtY0FI/p/0jdsm1RP6jMZ40nAsVEXUww5WMjS1AzjuMIYyU7lJwr7SHDREi/GRc1n7xSU0pnTeltlW7a+eDqcSe/fFUjA5C8lfm7CDy8rlKEuaTfH6CqZRc0ENpMM7sNp7DSlqp+UpiT0OLdoi5ur5ZPFgB5eUqW9AMfGSPl+fseVdOmeWVjgMTLhON616D5a+/iuSc4ZBK+WvnZ1Qmlkzb0E= luoweilue@LUOWEILUE-PC"
}

#  instance

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_instance" "v3" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t3.micro"
  key_name                    = aws_key_pair.v3.key_name
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.allow_ssh.id]
}
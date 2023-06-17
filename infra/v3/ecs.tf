data "aws_iam_policy_document" "v3_assume_role_policy_document" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "v3_pull_container_policy_document" {
  statement {
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
      "ecr:PutImage"
    ]
    effect = "Allow"
    resources = ["*"]
  }
}

# resource "aws_iam_policy" "v3_pull_container_policy" {
#   name   = "v3_pull_container_policy"
#   path   = "/"
#   policy = data.aws_iam_policy_document.v3_pull_container_policy_document.json
# }

# resource "aws_iam_policy" "v3_assume_role_policy" {
#   name = "v3_assume_role_policy"
#   policy = data.aws_iam_policy_document.v3_assume_role_policy_document.json
# }


resource "aws_iam_role" "v3_task_execution_role" {
    name = "v3_task_execution_role"
    assume_role_policy = data.aws_iam_policy_document.v3_assume_role_policy_document.json

    managed_policy_arns = [
      "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
      "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess",
    ]

    inline_policy {
      name = "v3_pull_container_policy"
      policy = data.aws_iam_policy_document.v3_pull_container_policy_document.json
    }
}


resource "aws_ecs_task_definition" "v3" {
  family = "v3-family"
  cpu = 256
  memory = 512
  requires_compatibilities = ["FARGATE"]
  network_mode = "awsvpc"
  execution_role_arn = aws_iam_role.v3_task_execution_role.arn

  container_definitions = jsonencode([{
    name = "v3_task_definition"
    image = "public.ecr.aws/d0l7r8j1/personal-website-v3:ep"
    portMappings = [
      {
        containerPort = 3000
        hostPort = 3000
        protocol = "tcp"
      }
    ]
    # environment = [{
    #   name = "SPRING_PROFILES_ACTIVE"
    #   value = "prod"
    # }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-create-group: "true",
        awslogs-group = "personal-website-v3"
        awslogs-region = "eu-west-2"
        awslogs-stream-prefix = "personal-website-v3"
      }
    }
    essential = true
  }])
}

resource "aws_cloudwatch_log_group" "v3" {
  name = "log-group-v3"
}

resource "aws_ecs_cluster" "v3" {
  name = "cluster-v3"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "v3" {
  cluster_name = aws_ecs_cluster.v3.name

  capacity_providers = ["FARGATE"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE"
  }
}




resource "aws_ecs_service" "v3" {
  name            = "v3_service"
  cluster         = aws_ecs_cluster.v3.id
  task_definition = aws_ecs_task_definition.v3.arn
  desired_count   = 1
  launch_type = "FARGATE"

  # wait_for_steady_state = true

  network_configuration {
    subnets = [aws_subnet.v3.id]
    assign_public_ip = true
    security_groups = [aws_security_group.allow_tls.id]
  }

  # load_balancer {
  #   target_group_arn = aws_lb_target_group.foo.arn
  #   container_name   = "mongo"
  #   container_port   = 8080
  # }
}

resource "aws_vpc" "v3" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "v3"
  }
}

resource "aws_subnet" "v3" {
  vpc_id     = aws_vpc.v3.id
  cidr_block = "10.0.1.0/24"

  tags = {
    Name = "v3"
  }
}


resource "aws_route_table" "v3" {
  vpc_id = aws_vpc.v3.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.v3.id
  }
  tags = {
    "Name" = "v3"
  }
}

resource "aws_internet_gateway" "v3" {
  vpc_id = aws_vpc.v3.id

  tags = {
    Name = "v3"
  }
}

resource "aws_route_table_association" "v3" {
  subnet_id      = aws_subnet.v3.id
  route_table_id = aws_route_table.v3.id
}



resource "aws_security_group" "allow_tls" {
  name        = "allow_tls"
  description = "Allow TLS inbound traffic"
  vpc_id      = aws_vpc.v3.id

  ingress {
    description      = "TLS from VPC"
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    # ipv6_cidr_blocks = [aws_vpc.v3.ipv6_cidr_block]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    description      = "NextJs"
    from_port        = 3000
    to_port          = 3000
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_tls"
  }
}
#!/bin/bash

service docker start
docker pull ${image}
docker run -p 80:${port} ${image}
#!/bin/sh
mkdir -p /data/db
mkdir -p /data/elasticsearch
mkdir -p /data/redis
mkdir -p /data/logs

docker run -d -p 27017:27017 -v /data/db:/data/db --name mongodb dockerfile/mongodb mongod --smallfiles
docker run -d -p 9200:9200 -p 9300:9300 -v /data/elasticsearch:/data --name elasticsearch rossonero/elasticsearch
docker run -d -p 6379:6379 -v /data/redis:/data --name redis dockerfile/redis
docker run -d -p 80:8080 -v /data/logs:/data --link mongodb:mongodb --link redis:redis --link elasticsearch:elasticsearch --name web rossonero/compass_web:1.0.0

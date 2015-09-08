#!/bin/sh
mkdir -p /data/db
mkdir -p /data/elasticsearch
mkdir -p /data/redis
mkdir -p /data/logs

docker run -d -p 27017:27017 -v /data/db:/data/db --name mongodb lingpin/mongodb mongod --smallfiles
docker run -d -p 9200:9200 -p 9300:9300 -v /data/elasticsearch:/data --name elasticsearch lingpin/elasticsearch:1.3.1.1
docker run -d -p 6379:6379 -v /data/redis:/data --name redis dockerfile/redis
docker run -d -p 8080:8080 --name parser lingpin/parser:1.0.6
docker run -d -p 80:80 -v /data/logs:/data -v /data/assets:/compass/assets --link mongodb:mongodb --link redis:redis --link elasticsearch:elasticsearch --link parser:parser --name web lingpin/web:1.0.40
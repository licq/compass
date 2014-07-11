FROM dockerfile/nodejs

RUN npm install -g pm2
ENV NODE_ENV production
ENV PORT 80
ENV LOG_FILE /data/compass.log
WORKDIR /compass
VOLUME ["/data"]
EXPOSE 80
ADD dist/ /compass
ADD node_modules/ /compass/node_modules
CMD ["pm2","start","server.js","-i","max","--no-daemon"]

FROM dockerfile/nodejs

RUN npm install -g pm2
ENV NODE_ENV production
ADD dist/ /compass
RUN cd /compass && npm install --production
WORKDIR /compass
VOLUME ["/data"]
ENV LOG_FILE /data/compass.log
CMD ["pm2","start","server.js","-i","max","--no-daemon"]
EXPOSE 8080

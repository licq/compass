FROM lingpin/nodejs

RUN npm install -g pm2
ENV NODE_ENV production
ENV PORT 80
ENV LOG_FILE /data/compass.log
WORKDIR /compass
VOLUME ["/data"]
VOLUME ["/compass/assets"]
EXPOSE 80
ADD dist/ /compass
RUN npm install --production
CMD ["pm2","start","pm2.json","--no-daemon"]

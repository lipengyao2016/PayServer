FROM node
# 维护者信息
MAINTAINER lipy "lipy@163.com"
# 将Dockerfile上下文中的nginx.repo复制到容器中的yum源位置

# Create app directory
RUN mkdir -p /home/node/PayServer
WORKDIR /home/node/PayServer

# Bundle app source
COPY . /home/node/PayServer
RUN   npm config set registry https://registry.npm.taobao.org \
    && npm install \
    && /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' >/etc/timezone

EXPOSE 6001
CMD [ "node", "server.js" ]
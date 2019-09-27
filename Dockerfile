FROM node:10-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/

RUN yarn

# Bundle app source
COPY . /usr/src/app
RUN yarn run build

ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 80
EXPOSE 80
CMD ["npm", "run", "start" ]

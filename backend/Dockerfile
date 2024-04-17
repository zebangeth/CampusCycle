# esbuild stage
FROM node:18-alpine as esbuild
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
RUN npm install passport-custom
COPY . .
RUN npm run build

# node stage
FROM node:18-alpine as node
WORKDIR /home/node/app
COPY --from=esbuild /home/node/app/dist/ ./dist/
# Copy package.json and package-lock.json for installing production dependencies
COPY --from=esbuild /home/node/app/package*.json ./

ENV GITLAB_CLIENT_ID=fcf776638ff60425d7c3348eb1a64427015a239eab5022ba678291d6b1aa2635
ENV GITLAB_CLIENT_SECRET=gloas-0adbffa6657fac89b20fd84745fb55de1b3af8e6a7fd7349c3c988cea128352c
ENV GITLAB_ADMIN_GROUP_ID=admingroup
ENV MONGODB_URI=mongodb+srv://zoe:12345@cluster0.pfvmjxp.mongodb.net/CampusCycle
ENV PORT=3000
ENV SESSION_SECRET=<my-session-secret>
ENV NODE_ENV=development
ENV DISABLE_SECURITY=alpha

# Install only production dependencies
RUN npm install --only=production
RUN npm install passport-custom
ENTRYPOINT [ "node", "dist/server.js" ]
EXPOSE 3000

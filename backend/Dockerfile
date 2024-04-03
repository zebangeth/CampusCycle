# esbuild stage
FROM node:18-alpine as esbuild
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# node stage
FROM node:18-alpine as node
WORKDIR /home/node/app
COPY --from=esbuild /home/node/app/dist/ ./dist/
# Copy package.json and package-lock.json for installing production dependencies
COPY --from=esbuild /home/node/app/package*.json ./
# Install only production dependencies
RUN npm install --only=production
ENTRYPOINT [ "node", "dist/server.js" ]
EXPOSE 3000

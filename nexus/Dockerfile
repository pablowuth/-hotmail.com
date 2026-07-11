FROM node:22-slim

WORKDIR /app

COPY package.json ./
COPY config ./config
COPY src ./src
COPY openapi.json ./
COPY workspaces ./workspaces

RUN mkdir -p data

ENV NEXUS_PROFILE=cloud
ENV NEXUS_HOST=0.0.0.0

EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "const p=process.env.PORT||8787;fetch('http://127.0.0.1:'+p+'/v1/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/index.js"]

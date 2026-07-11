FROM node:22-slim

WORKDIR /app/nexus

COPY nexus/package.json ./
COPY nexus/config ./config
COPY nexus/src ./src
COPY nexus/openapi.json ./
COPY workspaces /app/workspaces

RUN mkdir -p data

ENV NEXUS_PROFILE=cloud
ENV NEXUS_HOST=0.0.0.0
ENV NEXUS_PORT=8787

EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8787/v1/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/index.js"]

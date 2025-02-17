FROM node:22

# Install basic development tools
RUN apt update && apt install -y less git procps

# Ensure default `node` user has access to `workspace` folder
RUN mkdir -p /workspace && chown -R node:node /workspace

# Set the default user
USER node

WORKDIR /workspace
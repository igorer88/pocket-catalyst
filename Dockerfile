# syntax=docker/dockerfile:1.4

# Define build arguments for Node.js version, pnpm registry, system user, and group ID
ARG APP_NAME=pocket-catalyst
ARG UI_FOLDER=client
ARG NODE_VERSION=lts-alpine
ARG NPM_REGISTRY=https://registry.npmjs.org/
ARG YARN_REGISTRY=https://registry.npmjs.org/
ARG PNPM_REGISTRY=https://registry.npmjs.org/

# Base stage with platform specification and Node.js version argument
FROM --platform=$TARGETPLATFORM node:${NODE_VERSION} AS base
ARG UI_FOLDER

# Set environment variables
ENV API_PORT=3000 \
  SYSTEM_USER=system \
  SYSTEM_GROUP=system \
  SYSTEM_UID=2000 \
  SYSTEM_GID=2000

# Install Corepack and enable it
RUN corepack enable

# Install pnpm globally using the registry argument
RUN npm install -g pnpm @nestjs/cli --registry=$PNPM_REGISTRY --force

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Set the appropriate registry for pnpm
RUN if [ -n "$NPM_REGISTRY" ]; then pnpm config set registry "$NPM_REGISTRY"; \
  elif [ -n "$YARN_REGISTRY" ]; then pnpm config set registry "$YARN_REGISTRY"; \
  else pnpm config set registry "$PNPM_REGISTRY"; \
  fi

# Create a new group and user specified by SYSTEM_USER, SYSTEM_GROUP, SYSTEM_GID, and SYSTEM_UID arguments
RUN addgroup -g $SYSTEM_GID -S $SYSTEM_GROUP \
  && adduser -u $SYSTEM_UID -G $SYSTEM_GROUP -S $SYSTEM_USER

# Expose the API port defined by the environment variable
EXPOSE ${API_PORT}

# --- Stage 2: Dependencies ---
FROM base AS deps
ARG UI_FOLDER
# Copy only package manager configuration files to leverage Docker cache.
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json ./
COPY ${UI_FOLDER}/package.json ./${UI_FOLDER}/
# Install all dependencies, including dev dependencies
RUN pnpm fetch && pnpm install -r --offline

# --- Stage 3: Development Image ---
FROM base AS dev
# Set NODE_ENV to development
ENV NODE_ENV=development
# Copy the rest of the application code with ownership set to SYSTEM_USER
COPY --chown=${SYSTEM_USER}:${SYSTEM_USER} . .
# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/${UI_FOLDER}/node_modules ./${UI_FOLDER}/node_modules
USER ${SYSTEM_USER}
# Set ENTRYPOINT and CMD for development environment
ENTRYPOINT ["pnpm", "run"]
CMD ["start:dev"]

# --- Stage 4: Build ---
FROM deps AS build
ENV NODE_ENV=production
COPY . .
RUN pnpm build

# --- Stage 5: Production Image ---
FROM base AS prod
ARG UI_FOLDER
# Set NODE_ENV to production
ENV NODE_ENV=production
# Copy only production dependencies and build artifacts
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build /app/${UI_FOLDER}/package.json ./${UI_FOLDER}/
ENV CI=true
RUN pnpm fetch && pnpm install --prod -r --offline
# Copy build artifacts
COPY --from=build /app/dist ./dist
COPY --from=build /app/${UI_FOLDER}/dist ./dist/${UI_FOLDER}/dist
USER ${SYSTEM_USER}
# Set ENTRYPOINT and CMD for production environment
ENTRYPOINT ["pnpm", "run"]
CMD ["start:prod"]

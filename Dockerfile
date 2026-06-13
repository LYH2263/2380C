# Build stage
FROM docker.io/library/node:20-alpine AS builder

WORKDIR /app

# 安装构建依赖
RUN apk add --no-cache openssl libc6-compat

# 设置 npm 镜像
RUN npm config set registry https://registry.npmmirror.com

# 设置 Prisma 引擎下载镜像（解决国内网络无法访问 binaries.prisma.sh 的问题）
ENV PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma

# 复制 package 文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm install

# 生成 Prisma Client
RUN npx prisma generate

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# Production stage
FROM docker.io/library/node:20-alpine AS runner

WORKDIR /app

# 安装运行时依赖
RUN apk add --no-cache openssl libc6-compat

# 设置 npm 镜像
RUN npm config set registry https://registry.npmmirror.com

# 复制必要文件
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

# 安装生产运行时需要的依赖
RUN npm install --omit=dev

# 设置环境变量
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# 启动应用
CMD ["node", ".output/server/index.mjs"]

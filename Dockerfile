# 构建阶段
FROM node:20-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源码
COPY . .

# 构建应用
RUN pnpm run build

# 生产阶段
FROM caddy:alpine

# 复制 Caddy 配置
COPY Caddyfile /etc/caddy/Caddyfile

# 复制构建产物
COPY --from=builder /app/dist /usr/share/caddy

# 暴露端口
EXPOSE 80

# Caddy 默认启动命令
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]

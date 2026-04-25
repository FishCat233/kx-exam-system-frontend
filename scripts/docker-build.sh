#!/bin/bash
#
# Docker 构建脚本 - 用于构建和运行前端应用容器
#
# 用法: ./docker-build.sh [选项]
#
# 选项:
#   -t, --tag <string>    镜像标签 (默认: kx-exam-frontend:latest)
#   -p, --port <int>      主机端口映射 (默认: 80)
#   -r, --run             构建后运行容器
#   -c, --clean           构建前清理旧的镜像和容器
#   -h, --help            显示此帮助信息
#
# 示例:
#   ./docker-build.sh
#   ./docker-build.sh -t "myapp:v1.0" -p 8080 -r
#   ./docker-build.sh -c -r

set -e

# 默认参数
TAG="kx-exam-frontend:latest"
PORT=80
RUN=false
CLEAN=false

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# 显示帮助信息
show_help() {
    cat << EOF
Docker 构建脚本 - kx-exam-system-frontend

用法: ./docker-build.sh [选项]

选项:
    -t, --tag <string>    镜像标签 (默认: kx-exam-frontend:latest)
    -p, --port <int>      主机端口映射 (默认: 80)
    -r, --run             构建后运行容器
    -c, --clean           构建前清理旧的镜像和容器
    -h, --help            显示此帮助信息

示例:
    ./docker-build.sh
    ./docker-build.sh -t "myapp:v1.0" -p 8080 -r
    ./docker-build.sh -c -r
EOF
}

# 检查 Docker 是否安装
check_docker() {
    if command -v docker &> /dev/null; then
        local docker_version
        docker_version=$(docker --version)
        echo -e "${GREEN}✓ Docker 已安装: $docker_version${NC}"
        return 0
    else
        echo -e "${RED}✗ Docker 未安装或未添加到 PATH${NC}"
        echo -e "${YELLOW}请先安装 Docker: https://docs.docker.com/get-docker/${NC}"
        return 1
    fi
}

# 清理旧的镜像和容器
clean_old_images() {
    local image_tag=$1

    echo -e "\n${YELLOW}正在清理旧的镜像和容器...${NC}"

    # 停止并删除使用该镜像的容器
    local containers
    containers=$(docker ps -a --filter "ancestor=$image_tag" --format "{{.ID}}" 2>/dev/null || true)
    if [ -n "$containers" ]; then
        echo -e "${GRAY}  停止并删除旧容器...${NC}"
        echo "$containers" | xargs -r docker stop 2>/dev/null || true
        echo "$containers" | xargs -r docker rm 2>/dev/null || true
    fi

    # 删除旧镜像
    local image_exists
    image_exists=$(docker images "$image_tag" --format "{{.ID}}" 2>/dev/null || true)
    if [ -n "$image_exists" ]; then
        echo -e "${GRAY}  删除旧镜像...${NC}"
        docker rmi "$image_tag" 2>/dev/null || true
    fi

    echo -e "${GREEN}✓ 清理完成${NC}"
}

# 构建 Docker 镜像
build_image() {
    local image_tag=$1

    echo -e "\n${CYAN}开始构建 Docker 镜像: $image_tag${NC}"
    echo -e "${GRAY}----------------------------------------${NC}"

    local start_time
    start_time=$(date +%s)

    if ! docker build -t "$image_tag" .; then
        echo -e "${RED}✗ 镜像构建失败${NC}"
        exit 1
    fi

    local end_time
    end_time=$(date +%s)
    local duration=$((end_time - start_time))
    local minutes=$((duration / 60))
    local seconds=$((duration % 60))

    echo -e "${GRAY}----------------------------------------${NC}"
    echo -e "${GREEN}✓ 镜像构建成功! (耗时: ${minutes}分${seconds}秒)${NC}"
    echo -e "${GRAY}  镜像标签: $image_tag${NC}"
}

# 运行 Docker 容器
run_container() {
    local image_tag=$1
    local host_port=$2

    echo -e "\n${CYAN}启动容器...${NC}"

    local container_name
    container_name="kx-exam-frontend-$(shuf -i 1000-9999 -n 1)"

    if ! docker run -d \
        --name "$container_name" \
        -p "${host_port}:80" \
        --restart unless-stopped \
        "$image_tag"; then
        echo -e "${RED}✗ 容器启动失败${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ 容器启动成功!${NC}"
    echo -e "${GRAY}  容器名称: $container_name${NC}"
    echo -e "${GRAY}  访问地址: http://localhost:$host_port${NC}"
    echo -e "\n${YELLOW}查看日志: docker logs -f $container_name${NC}"
    echo -e "${YELLOW}停止容器: docker stop $container_name${NC}"
}

# 解析参数
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -t|--tag)
                TAG="$2"
                shift 2
                ;;
            -p|--port)
                PORT="$2"
                shift 2
                ;;
            -r|--run)
                RUN=true
                shift
                ;;
            -c|--clean)
                CLEAN=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                echo -e "${RED}未知选项: $1${NC}"
                show_help
                exit 1
                ;;
        esac
    done
}

# 主函数
main() {
    # 解析参数
    parse_args "$@"

    echo -e "${CYAN}
╔══════════════════════════════════════════════════════════════╗
║     KX Exam System Frontend - Docker 构建脚本               ║
╚══════════════════════════════════════════════════════════════╝
${NC}"

    # 检查 Docker
    if ! check_docker; then
        exit 1
    fi

    # 获取脚本所在目录的父目录（项目根目录）
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

    # 切换到项目根目录
    cd "$PROJECT_ROOT"

    # 清理旧镜像
    if [ "$CLEAN" = true ]; then
        clean_old_images "$TAG"
    fi

    # 构建镜像
    build_image "$TAG"

    # 运行容器
    if [ "$RUN" = true ]; then
        run_container "$TAG" "$PORT"
    else
        echo -e "\n${YELLOW}提示: 使用 -r 参数可以自动运行容器${NC}"
        echo -e "${GRAY}      手动运行: docker run -d -p ${PORT}:80 $TAG${NC}"
    fi

    echo -e "\n${GREEN}完成!${NC}"
}

# 执行主函数
main "$@"

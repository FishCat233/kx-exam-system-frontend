#Requires -Version 5.1
<#
.SYNOPSIS
    Docker 构建脚本 - 用于构建和运行前端应用容器

.DESCRIPTION
    该脚本用于构建 kx-exam-system-frontend 的 Docker 镜像，并可选地运行容器。
    支持自定义镜像标签、端口映射等功能。

.PARAMETER Tag
    镜像标签，默认为 "kx-exam-frontend:latest"

.PARAMETER Port
    主机端口映射，默认为 80

.PARAMETER Run
    构建后是否运行容器

.PARAMETER Clean
    构建前是否清理旧的镜像和容器

.PARAMETER Help
    显示帮助信息

.EXAMPLE
    .\docker-build.ps1
    使用默认参数构建镜像

.EXAMPLE
    .\docker-build.ps1 -Tag "myapp:v1.0" -Port 8080 -Run
    构建指定标签的镜像，并映射到主机的 8080 端口，构建完成后运行容器

.EXAMPLE
    .\docker-build.ps1 -Clean -Run
    清理旧镜像后构建，并运行容器
#>

[CmdletBinding()]
param(
    [Parameter()]
    [string]$Tag = "kx-exam-frontend:latest",

    [Parameter()]
    [int]$Port = 80,

    [Parameter()]
    [switch]$Run,

    [Parameter()]
    [switch]$Clean,

    [Parameter()]
    [switch]$Help
)

# 显示帮助信息
function Show-Help {
    Write-Host @"
Docker 构建脚本 - kx-exam-system-frontend

用法: .\docker-build.ps1 [选项]

选项:
    -Tag <string>    镜像标签 (默认: kx-exam-frontend:latest)
    -Port <int>      主机端口映射 (默认: 80)
    -Run             构建后运行容器
    -Clean           构建前清理旧的镜像和容器
    -Help            显示此帮助信息

示例:
    .\docker-build.ps1
    .\docker-build.ps1 -Tag "myapp:v1.0" -Port 8080 -Run
    .\docker-build.ps1 -Clean -Run
"@ -ForegroundColor Cyan
}

# 检查 Docker 是否安装
function Test-Docker {
    try {
        $dockerVersion = docker --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Docker 已安装: $dockerVersion" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Error "✗ Docker 未安装或未添加到 PATH"
        Write-Host "请先安装 Docker: https://docs.docker.com/get-docker/" -ForegroundColor Yellow
        return $false
    }
    return $false
}

# 清理旧的镜像和容器
function Clear-OldImages {
    param([string]$ImageTag)

    Write-Host "`n正在清理旧的镜像和容器..." -ForegroundColor Yellow

    # 停止并删除使用该镜像的容器
    $containers = docker ps -a --filter "ancestor=$ImageTag" --format "{{.ID}}" 2>$null
    if ($containers) {
        Write-Host "  停止并删除旧容器..." -ForegroundColor Gray
        $containers | ForEach-Object {
            docker stop $_ 2>$null | Out-Null
            docker rm $_ 2>$null | Out-Null
        }
    }

    # 删除旧镜像
    $imageExists = docker images $ImageTag --format "{{.ID}}" 2>$null
    if ($imageExists) {
        Write-Host "  删除旧镜像..." -ForegroundColor Gray
        docker rmi $ImageTag 2>$null | Out-Null
    }

    Write-Host "✓ 清理完成" -ForegroundColor Green
}

# 构建 Docker 镜像
function Build-Image {
    param([string]$ImageTag)

    Write-Host "`n开始构建 Docker 镜像: $ImageTag" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Gray

    $startTime = Get-Date

    docker build -t $ImageTag .

    if ($LASTEXITCODE -ne 0) {
        Write-Error "✗ 镜像构建失败"
        exit 1
    }

    $endTime = Get-Date
    $duration = $endTime - $startTime

    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host "✓ 镜像构建成功! (耗时: $($duration.ToString('mm\:ss')))" -ForegroundColor Green
    Write-Host "  镜像标签: $ImageTag" -ForegroundColor Gray
}

# 运行 Docker 容器
function Start-Container {
    param(
        [string]$ImageTag,
        [int]$HostPort
    )

    Write-Host "`n启动容器..." -ForegroundColor Cyan

    $containerName = "kx-exam-frontend-$(Get-Random -Minimum 1000 -Maximum 9999)"

    docker run -d `
        --name $containerName `
        -p ${HostPort}:80 `
        --restart unless-stopped `
        $ImageTag

    if ($LASTEXITCODE -ne 0) {
        Write-Error "✗ 容器启动失败"
        exit 1
    }

    Write-Host "✓ 容器启动成功!" -ForegroundColor Green
    Write-Host "  容器名称: $containerName" -ForegroundColor Gray
    Write-Host "  访问地址: http://localhost:$HostPort" -ForegroundColor Gray
    Write-Host "`n查看日志: docker logs -f $containerName" -ForegroundColor Yellow
    Write-Host "停止容器: docker stop $containerName" -ForegroundColor Yellow
}

# 主函数
function Main {
    # 显示帮助
    if ($Help) {
        Show-Help
        exit 0
    }

    Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║     KX Exam System Frontend - Docker 构建脚本               ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

    # 检查 Docker
    if (-not (Test-Docker)) {
        exit 1
    }

    # 获取脚本所在目录的父目录（项目根目录）
    $scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
    $projectRoot = Split-Path -Parent $scriptPath

    # 切换到项目根目录
    Push-Location $projectRoot

    try {
        # 清理旧镜像
        if ($Clean) {
            Clear-OldImages -ImageTag $Tag
        }

        # 构建镜像
        Build-Image -ImageTag $Tag

        # 运行容器
        if ($Run) {
            Start-Container -ImageTag $Tag -HostPort $Port
        } else {
            Write-Host "`n提示: 使用 -Run 参数可以自动运行容器" -ForegroundColor Yellow
            Write-Host "      手动运行: docker run -d -p ${Port}:80 $Tag" -ForegroundColor Gray
        }
    }
    finally {
        Pop-Location
    }

    Write-Host "`n完成!" -ForegroundColor Green
}

# 执行主函数
Main

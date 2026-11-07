# CertGen Studio

> 批量奖状生成器 + 内置 AI 助手 —— 纯静态前端 + Cloudflare Pages Functions 代理，零构建、零依赖。

[![Platform](https://img.shields.io/badge/Platform-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Runtime](https://img.shields.io/badge/Runtime-Pages%20Functions-orange)](https://developers.cloudflare.com/pages/functions/)
[![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS-yellow)](https://developer.mozilla.org/docs/Web/JavaScript)
![Build](https://img.shields.io/badge/Build-none-brightgreen)

---

## 目录

- [项目简介](#项目简介)
- [在线地址](#在线地址)
- [目录结构](#目录结构)
- [技术架构](#技术架构)
- [部署指南](#部署指南)
- [环境变量](#环境变量)
- [接口文档](#接口文档)
- [日常开发](#日常开发)
- [常见问题](#常见问题)
- [版本对照](#版本对照)
- [安全须知](#安全须知)

---

## 项目简介

CertGen Studio 是一个**单文件前端**的奖状批量制作工具，同时内置了一个 AI 助手。为了让访客开箱即用、无需自备 API Key，项目通过 **Cloudflare Pages Functions** 提供 `/api/config` 与 `/api/chat` 两个后端接口：前者告知前端"站点已配置默认 Key"，后者以服务端托管的环境变量凭证转发请求到上游大模型。

本仓库同时维护两代前端，各自独立部署、互不影响：

| 版本 | 定位 | 部署地址 | 源码目录 |
| :-- | :-- | :-- | :-- |
| **v2** | 新版（主力维护） | https://keaix7.pages.dev | [`v2/`](./v2) |
| **v1** | 旧版（保留现有站点） | https://certgen-studio.pages.dev | [`v1/`](./v1) |

两代共用同一套后端实现（`functions/api/`），仅在页面交互与代码组织上有差异，详见 [版本对照](#版本对照)。

## 在线地址

| 环境 | URL | 后端状态自检 |
| :-- | :-- | :-- |
| 二代 · 生产 | https://keaix7.pages.dev | https://keaix7.pages.dev/api/config |
| 一代 · 生产 | https://certgen-studio.pages.dev | https://certgen-studio.pages.dev/api/config |

`/api/config` 返回 `{"available":true,"model":"..."}` 即表示后端与默认凭证均已就绪。

## 目录结构

```
.
├── README.md                     # 本文件
├── v1/                           # 一代（旧版）站点根目录
│   ├── index.html                # 单文件前端（≈216 KB / 3,614 行）
│   ├── README.md                 # 该版本部署说明
│   └── functions/
│       └── api/
│           ├── config.js         # GET  /api/config
│           └── chat.js           # POST /api/chat
└── v2/                           # 二代（新版）站点根目录
    ├── index.html                # 单文件前端（≈264 KB / 4,744 行）
    ├── README.md                 # 该版本部署说明
    └── functions/
        └── api/
            ├── config.js
            └── chat.js
```

仓库根目录不含任何站点文件：Cloudflare Pages 的两个项目分别以 `v1`、`v2` 为 **Root directory**，因此每个版本目录都是自包含的完整站点。

## 技术架构

```
浏览器 (单 HTML，内联 CSS/JS)
   │  GET  /api/config      ──►  Pages Function（读取环境变量，返回可用性）
   │  POST /api/chat        ──►  Pages Function（替换为服务端 Key 后转发上游）
   ▼
Cloudflare Pages (静态资源 + Functions)
   ▼
上游大模型 API（按 model 前缀路由）
```

**设计要点**

- **前端零构建**：无 npm、无打包、无框架，一个 `index.html` 即全部产物，因此构建命令用 `exit 0` 跳过构建。
- **凭证不下发**：真实 API Key 只存在于 Pages 项目环境变量中，前端仅持有占位符 `__default__`，请求到达 Functions 后由服务端替换。
- **多厂商兼容**：`chat.js` 依据请求体里的 `model` 前缀自动选择上游地址。

| `model` 前缀 | 上游服务 |
| :-- | :-- |
| `glm*`（或不匹配以下任一前缀） | 智谱 BigModel · `open.bigmodel.cn` |
| `deepseek*` | DeepSeek · `api.deepseek.com/v1` |
| `gpt*` / `o*` | OpenAI |
| `qwen*` / `qwq*` | 阿里云 DashScope（compatible-mode） |
| `gemini*` | Google Generative Language（OpenAI 兼容层） |
| `groq*` / `llama*` / `mixtral*` / `gemma*` | Groq |

**超时策略**：Functions 侧对上游请求设 15 秒 `AbortController` 超时；前端整体请求超时 30 秒（`CHAT_TIMEOUT`）。

## 部署指南

### 前置条件

- 一个 Cloudflare 账号；
- 本仓库已连接到 GitHub；
- 一个可用的上游模型 API Key（如智谱 BigModel、DeepSeek）。

### 新建 Pages 项目

1. Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** 页签 → **Connect to Git**；
2. 选择仓库 `Iessnx/CertGen-Studio`，分支 `main`；
3. 构建设置按下表填写：

| 配置项 | 值 |
| :-- | :-- |
| Framework preset | `None` |
| Build command | `exit 0` |
| Build output directory | `.` |
| **Root directory** | `v2`（二代）或 `v1`（一代） |
| Production branch | `main` |

4. 添加环境变量（见下节），点击 **Save and Deploy**。

> ⚠️ **Root directory 必须填写。** 留空会让项目直接发布仓库根目录，而根目录已不含 `index.html`，构建后访问会 404。

### 验证部署

```bash
curl https://<your-project>.pages.dev/api/config
# {"available":true,"model":"glm-4-flash-250414"}
```

返回 JSON 即表示静态站点与 Functions 均正常；若返回 HTML，说明该项目未启用 `functions/`（常见于"拖拽上传"方式创建的纯静态项目）。

## 环境变量

在每个 Pages 项目的 **Settings → Variables and secrets** 中配置，修改后需重新部署才生效。

| 变量 | 必填 | 说明 |
| :-- | :-- | :-- |
| `DEFAULT_API_KEY` | ✅ | 站点默认凭证。缺失时 `/api/config` 返回 `available:false`，前端回退为"手动填写 Key"模式 |
| `DEFAULT_MODEL` | 建议 | 默认模型名，须与 Key 的厂商匹配，例如 `glm-4-flash-250414`、`deepseek-chat` |
| `DEFAULT_API_URL` | 可选 | 覆盖默认上游地址（默认 `https://open.bigmodel.cn/api/paas/v4/chat/completions`） |

Key 与模型的对应关系：

| Key 形态 | 厂商 | 推荐 `DEFAULT_MODEL` |
| :-- | :-- | :-- |
| `32 位十六进制.随机串` | 智谱 BigModel | `glm-4-flash-250414` |
| `sk-...` | DeepSeek | `deepseek-chat` |

## 接口文档

### `GET /api/config`

返回站点默认凭证的可用性，前端据此决定是否启用"默认 Key"。

```json
{
  "available": true,
  "model": "glm-4-flash-250414"
}
```

| 字段 | 类型 | 说明 |
| :-- | :-- | :-- |
| `available` | boolean | 服务端是否已配置 `DEFAULT_API_KEY` |
| `model` | string \| undefined | 服务端指定的默认模型（未配置时省略） |

### `POST /api/chat`

将聊天请求转发至上游模型服务，请求体需为 OpenAI 兼容格式。

```json
{
  "model": "glm-4-flash-250414",
  "messages": [{ "role": "user", "content": "你好" }]
}
```

响应为上游原始 JSON（原样透传），因此同时兼容 `choices[0].message.content`、`candidates`、`result`、`response`、`output` 等返回结构，前端由 `normalizeChatReply()` 统一解析。

| 状态码 | 含义 |
| :-- | :-- |
| `200` | 转发成功 |
| `400` | 请求体不是合法 JSON |
| `503` | 服务端未配置 `DEFAULT_API_KEY` |
| `502` | 上游请求失败或超时（15 秒） |

## 日常开发

1. 修改 `v2/index.html`（二代）或 `v1/index.html`（一代）；
2. 提交并推送：

   ```bash
   git add v2/index.html
   git commit -m "feat: ..."
   git push origin main
   ```

3. Cloudflare Pages 自动触发构建，约 1 分钟生效。

本地预览（需要 Node.js 与 Wrangler）：

```bash
npx wrangler pages dev v2 --compatibility-date=2024-01-01
```

## 常见问题

**页面显示「⚙️ 点击填写 API Key」**
说明前端拿不到默认配置。依次排查：① 访问 `<域名>/api/config` 是否返回 JSON；② 返回 HTML 说明项目没有 `functions/`；③ `available:false` 说明环境变量没配或没重新部署。

**`/api/config` 正常但聊天报错**
多为模型与 Key 厂商不匹配（见 [环境变量](#环境变量) 对应表），或上游额度不足。

**改了代码但网站没更新**
检查 Deployments 中最新构建是否成功；失败时 Pages 会继续提供上一版成功部署。

**Root directory 改过之后构建失败**
确认 Build output directory 为 `.`，并确认目标目录下确实存在 `index.html` 与 `functions/`。

## 版本对照

| 维度 | `v1` 一代 | `v2` 二代 |
| :-- | :-- | :-- |
| 前端体积 / 行数 | ≈216 KB / 3,614 行 | ≈264 KB / 4,744 行 |
| 变量风格 | 短变量 `K` / `U` / `M` | 长变量 `apiKey` / `apiUrl` / `apiModel` |
| 响应解析 | 内联判断 | `normalizeChatReply()` |
| Key 清洗 | 内联 | `_cleanKey()` |
| 后端 | 与本版本 `functions/` 一致 | 与本版本 `functions/` 一致 |

两代后端的接口契约完全一致，可独立升级，互不阻塞。

## 安全须知

- **API Key 只放环境变量**：切勿写入 `index.html` 或任何会进入版本库的文件。
- **`DEFAULT_API_KEY` 属于高价值凭证**：一旦泄露（截图、日志、公开仓库），应立即在厂商后台轮换，并同步更新所有 Pages 项目的环境变量后重新部署。
- **公开仓库意味着前端代码完全可见**：这不影响安全，前提是 Key 从未进入代码。

---

<sub>本仓库同时托管两代站点，请始终通过 `v1/`、`v2/` 目录区分版本，不要将站点文件散放在仓库根目录。</sub>

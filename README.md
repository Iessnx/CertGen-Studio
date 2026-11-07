# CertGen Studio（奖状生成器 + AI 助手）

**一个仓库 = 两代版本**，各占一个目录，各自部署成一个独立的 Cloudflare Pages 项目，互不影响。

---

## 一、一眼看懂：哪个目录是哪一代

| 目录 | 是哪一代 | 对应的 Pages 项目 / 网址 | 该项目要填的 Root directory | 文件大小 / 行数 |
|---|---|---|---|---|
| `v2/` | **二代 · 新版**（以后改这个） | `keaix7` → https://keaix7.pages.dev | `v2` | ≈270 KB / 4744 行 |
| `v1/` | **一代 · 旧版**（老站） | `certgen-studio` → https://certgen-studio.pages.dev | `v1` | ≈216 KB / 3614 行 |

仓库根目录只有 `README.md` 和 `v1/`、`v2/` 两个版本目录，没有散落在外面的 `index.html` 或 `functions/`。

---

## 二、不打开文件也能认出是哪一代

| 特征 | 一代 `v1/` | 二代 `v2/` |
|---|---|---|
| 文件大小 | ≈216 KB | ≈270 KB |
| 总行数 | 3614 行 | 4744 行 |
| 变量命名风格 | 短变量 `K` / `U` / `M` | 长变量 `apiKey` / `apiUrl` / `apiModel` |
| 独有的函数 | `_revertDefault()` | `normalizeChatReply()`、`_cleanKey()` |
| 目录结构 | `index.html` + `functions/api/{config,chat}.js` | 同左（两份文件内容完全一样） |

两代共同的接口约定（后端完全相同，所以互不掉链子）：

- `GET /api/config` → `{"available":true,"model":"..."}`，前端据此自动启用「默认」Key
- `POST /api/chat` → 代理转发到上游大模型，前端用 `Bearer __default__` 占位

> 验证方法：浏览器直接打开 `https://<域名>/api/config`。返回 JSON 就说明后端在；返回一堆 HTML 说明这个项目没带 `functions/`。

---

## 三、日常怎么改

- **改二代**：编辑 `v2/index.html` → 提交 → push → `keaix7` 自动重新部署。
- **改一代**：编辑 `v1/index.html` → 提交 → push → `certgen-studio` 自动重新部署。
- **别混**：不要在 `v2/` 里放一代的文件，反之亦然；每个目录就是那个站点的完整根目录。

## 四、环境变量（每个 Pages 项目各配一套）

| 变量 | 必填 | 说明 |
|---|---|---|
| `DEFAULT_API_KEY` | ✅ | 站点默认 Key。不配 → `/api/config` 返回 `available:false` → 页面显示「⚙️ 点击填写 API Key」 |
| `DEFAULT_MODEL` | 建议 | 默认模型名，要和 Key 的厂商对得上 |
| `DEFAULT_API_URL` | 可选 | 覆盖默认上游地址 |

Key 与模型的对应关系：

| Key 格式 | 厂商 | `DEFAULT_MODEL` 填 |
|---|---|---|
| `32位hex.随机串` | 智谱 BigModel | `glm-4-flash-250414` |
| `sk-...` | DeepSeek | `deepseek-chat` |

改完环境变量**必须重新部署一次**才生效（Deployments → 最新一条 → Retry deployment，或推一个提交）。

## 五、本地四个历史稿不要提交

`老一代indexindex.html`、`老二代indexindex.html`、`新二代indexindex.html`、`新一代indexindex.html` 是本地迭代草稿，**没有纳入 git**。用 `git add .` 一把梭会把这四个大文件一起提交进去，请按目录提交（例如 `git add v2/index.html`）。

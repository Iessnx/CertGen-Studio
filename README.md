# CertGen Studio（奖状生成器 + AI 助手）

**一个仓库 = 两代版本**，各占一个目录，各自部署成一个独立的 Cloudflare Pages 项目，互不影响。

---

## 一、一眼看懂：哪个目录是哪一代

| 目录 | 是哪一代 | 对应的 Pages 项目 | 该项目要填的 Root directory | 文件大小 / 行数 |
|---|---|---|---|---|
| `v2/` | **二代 · 新版**（以后改这个） | 新建的 `certgen-v2` | `v2` | ≈270 KB / 4744 行 |
| `v1/` | **一代 · 旧版**（老线上站） | 老项目 `CertGen-Studio` | `v1`（切换后填） | ≈216 KB / 3614 行 |
| 根目录 `index.html` + `functions/` | 一代的**过渡期副本** | 老项目**目前**还在用它 | 不填（= 仓库根） | 和 `v1/index.html` 内容相同 |

> 过渡期说明：老项目现在读的是根目录那份。等你在面板里把老项目的 Root directory 改成 `v1` 并部署成功之后，根目录的 `index.html` 和 `functions/` 就可以删掉，仓库就只剩 `v1/` 和 `v2/` 两个版本目录。

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

---

## 三、日常怎么改

- **改二代**：编辑 `v2/index.html` → 提交 → push → `certgen-v2` 自动重新部署。
- **改一代**：编辑 `v1/index.html` → 提交 → push → 老项目自动重新部署。
- **别混**：不要在 `v2/` 里放一代的文件，反之亦然；每个目录就是那个站点的完整根目录。

## 四、环境变量（每个 Pages 项目各配一套）

| 变量 | 必填 | 说明 |
|---|---|---|
| `DEFAULT_API_KEY` | ✅ | 站点默认 Key。不配 → `/api/config` 返回 `available:false` → 页面显示「⚙️ 点击填写 API Key」 |
| `DEFAULT_MODEL` | 建议 | 默认模型名，如 `deepseek-chat`、`glm-4-flash-250414` |
| `DEFAULT_API_URL` | 可选 | 覆盖默认上游地址 |

## 五、本地四个历史稿不要提交

`老一代indexindex.html`、`老二代indexindex.html`、`新二代indexindex.html`、`新一代indexindex.html` 是本地迭代草稿，**没有纳入 git**。用 `git add .` 一把梭会把这四个大文件一起提交进去，请按目录提交（例如 `git add v2/index.html`）。

# v2 —— 二代（新版）

这个目录就是**二代站点的完整根目录**：`index.html`（即本地的 `新二代indexindex.html`）+ `functions/`。

- 对应 Pages 项目：新建的 `certgen-v2`
- 该项目设置：Build command `exit 0`、Build output directory `.`、**Root directory `v2`**
- 环境变量必配：`DEFAULT_API_KEY`（不配就会一直显示「点击填写 API Key」），建议再配 `DEFAULT_MODEL`
- 文件指纹：≈270 KB / 4744 行，AI 部分用长变量 `apiKey` / `apiUrl`，有 `normalizeChatReply()` 和 `_cleanKey()`

⚠️ 这个目录会被 Pages 当成站点根目录直接发布，**不要往里放草稿、备份、截图**。

改完 `index.html` 直接 push 即可，`certgen-v2` 会自动重新部署。

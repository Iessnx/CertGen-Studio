# v1 —— 一代（旧版）

这个目录就是**一代站点的完整根目录**：`index.html` + `functions/`。

- 对应 Pages 项目：老项目（`CertGen-Studio`）
- 该项目设置：Build command `exit 0`、Build output directory `.`、**Root directory `v1`**
- 文件指纹：≈216 KB / 3614 行，AI 部分用短变量 `K` / `U` / `M`，没有 `normalizeChatReply()`

⚠️ 这个目录会被 Pages 当成站点根目录直接发布，**不要往里放草稿、备份、截图**。

改完 `index.html` 直接 push 即可，老项目会自动重新部署。

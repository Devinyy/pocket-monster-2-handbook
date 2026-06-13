# 口袋怪兽2 攻略图鉴 Wiki

Pocket Monsters 2 — 游戏攻略 / 图鉴 Wiki。基于玩家社区资料整理，使用 **React + Ant Design** 构建的静态站点。

## 功能板块

| 板块 | 内容 |
|---|---|
| 🌱 新手入门 | 充值 / 交易 / 合成 / 涅槃 / 装备 / 副本 / 开包全流程 |
| ⚗️ 合成 · 涅槃 | 全套合成与涅槃公式、马鲁斯/玄冰仙使专题链、合神材料、波姆进化 |
| 🐲 宠物图鉴 | 仙侠 / 女神 / 封神 / 三国 等系列宠物图鉴（含技能截图） |
| ✨ 新宠技能库 | 超神宠与卡片宠的技能详情、获取方式 |
| 📜 专属任务 | 各神宠专属任务完整图鉴 |
| 👹 BOSS 图鉴 | 旧大陆 / 新大陆 / 神圣地图 BOSS 与各难度血量 |
| 🛡️ 装备 · 卡片 | 逐光服全套装 / 卡套图鉴与搭配数值参考 |
| 📊 数值工具 | 1–130 级经验表、物价参考、伤害公式、涅槃加成名单 |

全站支持顶部搜索（宠物 / 装备 / 任务 / 公式）、深色模式、移动端适配。

## 技术栈

- React 18 + TypeScript + Vite
- Ant Design 5（组件库）+ react-router-dom（HashRouter，便于子目录部署）

## 目录结构

```
src/            React 应用源码
  pages/        各栏目页面
  components/   公共组件
  data/         由资料生成的 JSON（勿手改，运行 npm run data 重建）
  data/formulas.ts  人工整理的合成/涅槃公式
public/img/     从原始资料导出的图片（宠物/任务/BOSS/装备/波姆等）
web-data/       从原始资料提取的中间文本（解析源）
tools/          数据/知识库生成脚本
knowledge/      AI 可读知识库语料（Markdown + chunks.jsonl，供 RAG/AI 问答）
docs/ziliao/    原始资料（doc/docx/xls/xlsx/ppt/pdf/txt）
```

## 开发与构建

```bash
npm install         # 安装依赖
npm run dev         # 本地开发 (http://localhost:5173)
npm run build       # 构建到 dist/
npm run preview     # 预览构建产物 (http://localhost:4173)

npm run data        # 生成 src/data/*.json（经验/物价/boss/任务/装备/新宠，需 python3）
npm run pets        # 解析宠物篇 PDF → 一宠一卡数据 + 独立透明立绘（需 python3 + Pillow + poppler）
npm run kb          # 重新生成 knowledge/ 知识库语料
```

> 数据流水线：原始资料 `docs/ziliao` → 提取文本/图片 → `web-data` + `public/img` → `npm run data` / `npm run pets` → `src/data/*.json`（前端使用）→ `npm run kb` → `knowledge/`（AI 使用）。
>
> 宠物图鉴为「一宠一卡」：`tools/build_pets_detail.py` 从 PDF 抽出每只宠物的独立透明立绘（`public/img/petsprite/`），并按 PDF 分页与正文逐只配对技能文字 → `src/data/petsDetail.json`。

## AI 知识库

`knowledge/` 目录提供供后续接入 AI 问答的结构化语料：

- `knowledge/*.md` —— 按板块整理的 Markdown，人和 AI 都可读
- `knowledge/chunks.jsonl` —— 分块文档（248 块），每行 `{id,title,category,source,text}`，可直接做向量化入库（RAG）
- `src/data/knowledge.json` —— 精简版分块，供 Cloudflare Worker 的 AI 助手做关键词 RAG 检索

详见 [`knowledge/README.md`](knowledge/README.md)。

## AI 助手（DeepSeek）

页面右下角的悬浮按钮即「AI 攻略助手」，由 Cloudflare Worker 后端（`worker/index.ts`）驱动：

1. 用户提问 → Worker 用 `knowledge.json` 做关键词 RAG，检索最相关的几条资料；
2. 拼成系统提示，调用 DeepSeek Chat Completions，流式（SSE）返回；
3. 前端 `src/components/AiAssistant.tsx` 实时渲染回答。

**配置密钥（部署后必做）：**

```bash
npx wrangler secret put DEEPSEEK_API_KEY     # 输入你的 DeepSeek API Key
# 也可在 Cloudflare 控制台 Workers → Settings → Variables 添加加密变量
```

可选环境变量（Cloudflare 控制台 Variables 里加）：

- `DEEPSEEK_MODEL` —— 模型名，默认 `deepseek-v4pro`；若该名不被 API 接受，可改为 `deepseek-chat` 等有效模型，无需改代码
- `DEEPSEEK_BASE_URL` —— 默认 `https://api.deepseek.com`

本地调试 AI：`npm run build && npm run cf:dev`（即 `wrangler dev`，同时跑 Worker + 静态资源）。

## 部署（Cloudflare Workers）

`wrangler.jsonc` 已配置为「静态资源(dist) + Worker(/api/*)」：

- 构建命令：`npm run build`
- 部署命令：`npx wrangler deploy`

构建产物为纯静态前端（`base: './'`，HashRouter），由 Worker 的 `ASSETS` 绑定托管，`/api/chat` 走 Worker。

---

资料整理自《口袋怪兽2 / 口袋精灵2》玩家社区，仅供学习交流使用。

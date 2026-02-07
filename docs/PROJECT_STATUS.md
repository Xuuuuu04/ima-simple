# IMA Simple（本机知识库 AI 助手）- 项目体检

最后复核：2026-02-05

## 状态
- 状态标签：active
- 定位：单用户、单机离线知识库助手（导入→索引→RAG/Agent→引用溯源→历史）。

## 架构速览
- 后端：`backend/app/main.py`（FastAPI）
- 前端：`frontend/`（React + Vite）
- 核心能力：
  - 导入：`backend/app/ingest.py`
  - 索引：`backend/app/indexer.py`
  - RAG：`backend/app/rag.py`
  - Agent：`backend/app/agent.py`
  - 存储：`backend/app/db.py`（本地 SQLite + 向量索引文件）
- 文档：`docs/architecture.md`、`docs/api.md`、`docs/runbook.md`

## 运行与测试
- Docker：`docker compose up --build`
- 本地脚本：`./scripts/run.sh`
- 测试：`cd backend && MOCK_MODE=1 pytest`

## 当前实现亮点
- 文档与边界定义清楚：单机离线、本地 OpenAI 兼容端点接入、引用/拒答策略。
- 已包含测试与 runbook，适合作为作品集“工程化样例”。

## 风险与建议（优先级）
- 若后续走“平台化/LLMOps”方向，可补：统一可观测（trace、请求回放）、评测与回归门禁（坏例库 + Rubric）。
- 前端与后端的配置项建议集中成一份“配置字典”（每个 env 的含义、默认值、风险）。


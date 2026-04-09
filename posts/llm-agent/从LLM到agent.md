---
title: 从 LLM 到 Agent 的进化
date: 2026-04-09 10:00:00
categories:
  - AI
tags:
  - LLM
  - Agent
  - AI
author: yangyu
---

### LLM 与 Agent 的关系

![LLM 架构演进](/images/llm-agent/image-1.png)

![LLM 能力展示](/images/llm-agent/image-2.png)

![LLM 与 Agent 的对比](/images/llm-agent/image-3.png)

### LLM 的局限

模型并不能自己调用工具。需要借助平台的能力，大模型分析需要调用哪些工具，给平台一个指令，等待结果。

### Tool 调用机制

**Tool 的工作原理**：

![Tool 调用流程](/images/llm-agent/image.png)

### MCP 协议

**MCP** (Model Context Protocol - 模型上下文协议)：模拟上下文协议。适配不同平台发布的统一标准
![MCP 流程](/images/llm-agent/image-7.png)

### RAG 检索增强生成

![RAG 流程](/images/llm-agent/image-4.png)
![RAG 流程](/images/llm-agent/image-5.png)

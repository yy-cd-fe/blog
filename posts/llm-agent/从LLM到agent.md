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
两种典型模式：ReAct和 Plan and Execute

#### ReAct

让 LLM 在解决任务时模拟人类的思考过程：想一步，做一步，再根据结果调整思考，再行动……如此循环，直到得出最终答案。
它效率较低、缺乏全局规划且依赖工具，因而更适合交互性强、步骤较少、需要实时查询或轻量推理的任务场景。

#### Plan and Execute

先规划（Plan），再执行（Execute） 先让 Agent 想出一整套方案，然后按照方案逐步落实
实现复杂、误差传递、上下文管理压力大、执行耗时。

### Tool 调用机制

**Tool 的工作原理**：

![Tool 调用流程](/images/llm-agent/image.png)

### MCP 协议

**MCP** (Model Context Protocol - 模型上下文协议)：模拟上下文协议。适配不同平台发布的统一标准

MCP 本质是协议规范；在 Node 里要“按规范收发消息、暴露 tools”，就需要一个实现库，@modelcontextprotocol/sdk 就是最常用的那个。
1️⃣ Tool 封装层 │
│ └─ 把多个独立的工具/功能包装成标准接口 │
│ │
│ 2️⃣ Tool 注册暴露层 │
│ └─ 向 LLM/Host 声明"我有这些工具" │
│ │
│ 3️⃣ 连接器 │
│ └─ 建立 LLM ↔ MCP Server 的通信 │
│ │
│ 4️⃣ 智能调用层 │
│ └─ LLM 自主选择需要的 tools │
│ │
│ 5️⃣ 数据流转层 │
│ ┌─────────────────────────────────────┐ │
│ │ Tool执行 → 返回数据 → MCP 包装 │ │
│ │ → LLM处理 → LLM返回结果 → Host │ │
│ └─────────────────────────────────────┘ │

![MCP 流程](/images/llm-agent/image-7.png)

### Agent

![Agent](/images/llm-agent/image-8.png)
组件 ｜ 职责 ｜ 决策者

---

LLM ｜ 分析任务,决定调用什么工具 ｜ ✅ LLM 决定
Agent Runtime ｜ 翻译 LLM 的意图,路由到 MCP ｜ ✅ Runtime 协调
MCP Server ｜ 实际执行工具,返回结果 ｜ ✅ MCP 执行

Plan and Execute
![Plan and Execute](/images/llm-agent/image-9.png)

### RAG 检索增强生成

![RAG 流程](/images/llm-agent/image-4.png)
![RAG 流程](/images/llm-agent/image-5.png)

### FAQ

**cursor 正常唤起了该mcp 我想问整个链路里面的cursor 输入之后发生了什么?谁去调用的该mcp 谁又去完成的mcp里面接口的请求 谁又去和大模型对话和大模型在整个链路起到什么作用**

整个链路：你在 Cursor 输入后发生了什么（stdio MCP）
下面按“角色”把链路拆开讲清楚。

1. Cursor（宿主/Host）做什么？
   拉起 MCP Server：根据你的 mcpServers 配置，Cursor 会执行类似：
   node /.../weather-mcp/src/index.js
   建立 stdio 连接：Cursor 拿到这个进程的 stdin/stdout，当作一条“协议通道”。
   发现工具：Cursor 会发送 list_tools 请求（JSON-RPC），让 server 报告它支持哪些 tools、每个 tool 的入参 schema。
   决定是否调用工具：当你在对话里提出需求（比如“查成都明天天气”），Cursor 会把你的输入连同当前上下文交给大模型，并由宿主侧做一次“工具选择/规划”（是否要调用 tool、调用哪个、参数是什么）。
2. 谁去“调用该 MCP”？
   是 Cursor（宿主）去调用。
   具体方式是：Cursor 通过 stdio 向 weather-mcp 进程发送 call_tool 请求，内容包含：
   tool 名称：get_weather_forecast
   参数：{ region, datetime }
   你手动在聊天里只是“提出需求”，真正发协议消息给 MCP server 的是 Cursor。

3. MCP Server（你的 weather-mcp）做什么？
   接收 Cursor 发来的 call_tool（stdin）
   执行工具逻辑（Node.js 代码）
   在 get_weather_forecast 的 handler 里：
   先请求 Open‑Meteo Geocoding（把城市名→经纬度/时区）
   再请求 Open‑Meteo Forecast（拿小时预报）
   在返回数据里挑最接近 datetime 的小时
   把结果写回 Cursor（stdout）
   所以：真正去请求天气接口的是 MCP Server 进程（Node），不是 Cursor，也不是大模型。

4. 谁去“和大模型对话”？
   Cursor（宿主）负责把消息发给大模型（它是 LLM 的调用方/编排方）。
   MCP Server 默认 不直接 调用大模型（你这份代码里也没有任何 LLM 调用）。
5. 大模型在链路里起什么作用？
   大模型主要做三类事（由 Cursor 把它当“智能决策器/解释器”使用）：

工具选择（Tool routing）：判断需不需要调用 MCP tool；需要的话选哪个 tool。
参数构造（Argument filling）：从你的自然语言里抽取参数（例如 region=成都，datetime=明天某时/整天）。
结果解释（Post-processing）：把 MCP 返回的结构化数据，组织成你更容易读的回答（例如“明天最高温/最低温、是否有雨、风力”）。
一句话总结：

Cursor：负责“启动/连接 MCP、调用 tool、调用大模型、把所有结果汇总给你”
weather-mcp（Node）：负责“真正访问天气接口并返回结构化结果”
大模型：负责“理解你的话→决定是否用工具→生成参数→把结果讲人话”

**如果将 这个命令在终端输入 并且直接给他一些必要的参数可以正常运行吗。我是否可以理解如果可以正常运行 我们终端也是一个mcpHost**

只在终端输入 node .../index.js 并“顺便给参数”——不行（默认不行）
你这个 weather-mcp/src/index.js 是 stdio MCP Server：它启动后只做一件事——等待 MCP 协议消息从 stdin 进来。
它不支持像普通 CLI 那样 node index.js --region 成都 --datetime ... 直接执行并输出结果，因为代码里没有解析命令行参数的逻辑。

如果你硬要“在终端给必要参数并正常跑出结果”，有两种方式：

方式 A（最正统）：在终端里运行一个“MCP 客户端”（client），由 client 去启动/连接 server，然后发 call_tool（这和 Cursor 做的事一样）。
方式 B（改代码）：给 server 增加一个 CLI 模式（解析 argv 后直接调用内部函数），这就不再是纯 MCP 链路了，而是“同一套业务逻辑的 CLI 入口”。
终端是不是一个 MCP Host？
可以这么理解，但要满足条件：

终端本身只是一个“运行环境/IO 通道”，不是 host。
只有当你在终端里运行了一个程序，这个程序：
能启动 MCP server 子进程（或连接到它）
能按 MCP 协议发送 list_tools / call_tool
能读取返回
那这个程序才是 MCP Host（宿主）。Cursor 就是一个 host；你在终端里也完全可以写/用一个 host 来做同样的事。

一句话总结
直接 node index.js + 参数：默认不行（它在等协议消息，不会读 argv）
终端可不可以当 host：可以，但需要你在终端里运行一个“host/client 程序”，而不是只运行 server
如果你希望，我可以直接给 weather-mcp 加一个最小的 cli.js（作为 MCP host/client）：

node cli.js --region 成都 --datetime 2026-04-14T12:00:00+08:00 它会在内部启动 src/index.js，发 call_tool，并把结果打印出来。这样你就能用终端完整走一遍 MCP 链路。

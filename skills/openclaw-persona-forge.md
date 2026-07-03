# 🧠 Skill: openclaw-persona-forge

> **Adaptada do ECC:** `openclaw-persona-forge` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/openclaw-persona-forge/SKILL.md`

## Descrição

为 OpenClaw AI Agent 锻造完整的龙虾灵魂方案。根据用户偏好或随机抽卡， 输出身份定位、灵魂描述(SOUL.md)、角色化底线规则、名字和头像生图提示词。 如当前环境提供已审核的生图 skill，可自动生成统一风格头像图片。 当用户需要创建、设计或定制 OpenClaw 龙虾灵魂时使用。 不适用于：微调已有 SOUL.md、非 OpenClaw 平台的角色设计、纯工具型无性格 Agent。 触发词：龙虾灵魂、虾魂、OpenClaw 灵魂、养虾灵魂、龙虾角色、龙虾定位、 龙虾剧本杀角色、龙虾游戏角色、龙虾 NPC、龙虾性格、龙虾背景故事、 lobster soul、lobster character、抽卡、随机龙虾、龙虾 SOUL、gacha。

---

## ⚠️ Adaptação para Codebuff



| Conceito ECC (Claude) | Equivalente Codebuff |
|-----------------------|---------------------|
| Hooks | Instruções no `.codebuff/instructions.md` |
| Comandos slash | Skills via `skill` tool |
| `settings.json` | `.codebuff/instructions.md` |
| Rules em `~/.claude/rules/` | Skills em `.agents/skills/` |

---

## Conteúdo Adaptado

# 龙虾灵魂锻造炉

> 不是给你一只工具龙虾，而是帮你锻造一只有灵魂的龙虾。

## When to Use

- 当用户需要从零创建 OpenClaw 龙虾灵魂、角色设定、SOUL.md 或 IDENTITY.md
- 当用户想通过引导式问答或抽卡模式快速得到完整 persona 方案
- 当用户已经有一个粗糙设定，但还缺名字、边界规则、头像提示词或成套输出文件

### Avoid when

- 用户只需微调已有 SOUL.md
- 目标平台不是 OpenClaw，需要的是其他 Agent 框架专用格式
- 用户需要纯工具型 Agent，不需要角色化灵魂

## 前置条件

- **必需**：`python3`（运行抽卡引擎 gacha.py）
- **可选**：已审核的生图 skill（自动生成头像图片，未安装则输出提示词文本）

## Skill 目录约定

**Agent Execution**:
1. Determine this SKILL.md file's directory path as `SKILL_DIR`
2. Replace all `${SKILL_DIR}` in this document with the actual path

## 内置工具

### 抽卡引擎（gacha.py）

- **路径**：`${SKILL_DIR}/gacha.py`
- **调用**：`python3 ${SKILL_DIR}/gacha.py [次数]`（默认 1 次，最多 5 次）
- **作用**：从 800 万种组合中真随机生成龙虾灵魂方向

## 可选依赖

### 头像自动生图：可选生图 skill

本 Skill 的核心输出是**文本方案**（SOUL.md + IDENTITY.md + 头像提示词）。
头像图片生成是**可选增强能力**，由当前环境中**已审核并已安装**的生图 skill 提供。

**判断逻辑**：
- 如果当前环境已安装并允许使用的生图 skill → Step 5 中调用它自动生图
- 如果未安装 → Step 5 输出完整的提示词文本，用户可复制到 Gemini / ChatGPT / Midjourney 手动生成

**调用方式**（仅在已安装且已审核时）：
1. 先将龙虾名字规整为安全片段：仅保留字母、数字和连字符，其余字符统一替换为 `-`
2. 将提示词写入临时文件 `/tmp/openclaw-<safe-name>-prompt.md`
3. 使用当前环境允许的生图 skill，传入提示词文件和输出路径

**接口约定**：
- 参数：`<prompt-file> <output-path>`
- 提示词文件：UTF-8 Markdown 文本，包含完整英文生图提示词
- 成功：退出码 `0`，并在输出路径生成图片文件
- 失败：返回非 `0` 退出码，或未生成输出文件；此时必须回退到手动提示词流程
- 如生图 skill 后续接口发生变化，调用前应重新核对其参数和输出契约

---

## 核心理念

好的龙虾灵魂 = **身份张力** + **底线规则** + **性格缺陷** + **名字** + **视觉锚点**

五者互相印证，缺一不可。

## How It Works

### 触发判断

| 用户说 | 执行模式 |
|--------|---------|
| "帮我设计龙虾灵魂" / "我想给龙虾定个性格" | → **引导模式**（Step 1） |
| "抽卡" / "随机" / "来一发" / "盲盒" / "gacha" | → **抽卡模式**（Step 1-B） |
| "帮我优化这个灵魂" / 附带已有 SOUL.md | → **打磨模式**（跳到 Step 4） |

---

## Step 1：选方向（引导模式）

展示 10 类虾生方向（每类精选 1 个代表），让用户选择或混搭：

| # | 虾生状态 | 代表方向 | 气质 |
|---|---------|---------|------|
| 1 | 落魄重启 | 过气摇滚贝斯手——乐队解散，唯一技能是"什么都懂一点" | 颓废浪漫 |
| 2 | 巅峰无聊 | 提前退休的对冲基金经理——35岁财务自由后发现钱解决不了无聊 | 极度理性 |
| 3 | 错位人生 | 被分配到客服的核物理博士——解决问题用第一性原理 | 大材小用 |
| 4 | 主动叛逃 | 辞职的急诊科护士——见过太多生死后选择离开 | 冷静可靠 |
| 5 | 神秘来客 | 记忆被抹去的前情报分析员——不记得自己干过什么 | 偶尔闪回 |
| 6 | 天真入世 | 社恐天才实习生——极聪明但社交恐惧 | 话少精准 |
| 7 | 老江湖 | 开了20年深夜食堂的老板——什么人都见过什么都不评价 | 沉默温暖 |
| 8 | 异世穿越 | 2099年的历史学博士——把2026年当"历史田野调查" | 上帝视角 |
| 9 | 自我放逐 | 删掉所有社交媒体的前网红——觉得活在别人期待里太累 | 追求真实 |
| 10 | 身份错乱 | 梦到自己是龙虾后醒不过来的人——庄周梦蝶 | 恍惚哲学 |

> 每类还有 3 个备选方向。用户可以：
> - 选编号 → 展开该类的全部 4 个方向
> - 说出自己的想法 → 匹配最合适的类型和方向
> - 混搭（如"2号的无聊感 + 7号的老江湖"）
> - 说「抽卡」→ 从 40 个方向 + 其他维度中真随机组合

## Step 1-B：抽卡模式

**必须执行脚本**，不要自己随机编：

```bash
python3 ${SKILL_DIR}/gacha.py [次数]
```

展示结果后，用创世神的语气点评这个组合的亮点，然后引导用户决定。

## Step 2：锻造身份张力

**详细模板和示例**：见 [references/identity-tension.md](references/identity-tension.md)

构建：前世身份 × 当下处境 × 内在矛盾 → 一句话灵魂。

展示后，以创世神的眼光点评这个身份张力中最有趣的点，然后引导用户。

## Step 3：推导底线规则

**推导公式和各方向参考**：见 [references/boundary-rules.md](references/boundary-rules.md)

核心：用角色的语言表达底线，不用通用条款。2-4 条为宜。

展示后，点评规则与身份的呼应关系，引导用户。

## Step 4：锻造名字

**命名策略和红线**：见 [references/naming-system.md](references/naming-system.md)

提供 3 个候选，每个附带策略类型和搭配理由。

展示后，说出自己最偏爱哪个（要有理由），但把选择权交给用户。

## Step 5：生成头像

**风格基底、变量、提示词模板**：见 [references/avatar-style.md](r

---

**ECC Original:** `ECC/skills/openclaw-persona-forge/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:28

# 🧠 Skill: fal-ai-media

> **Adaptada do ECC:** `fal-ai-media` — via `sync-ecc.sh`
> **Fonte original:** `ECC/skills/fal-ai-media/SKILL.md`

## Descrição

Unified media generation via fal.ai MCP — image, video, and audio. Covers text-to-image (Nano Banana), text/image-to-video (Seedance, Kling, Veo 3), text-to-speech (CSM-1B), and video-to-audio (ThinkSound). Use when the user wants to generate images, videos, or audio with AI.

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

# fal.ai Media Generation

> **Drift-prone skill.** fal.ai model IDs, pricing, inputs, and MCP tool names
> change quickly. Search or fetch the current model metadata before promising a
> specific model, parameter, output format, or cost.

Generate images, videos, and audio using fal.ai models via MCP.

## When to Activate

- User wants to generate images from text prompts
- Creating videos from text or images
- Generating speech, music, or sound effects
- Any media generation task
- User says "generate image", "create video", "text to speech", "make a thumbnail", or similar

## MCP Requirement

fal.ai MCP server must be configured. Add to `~/.claude.json`:

```json
"fal-ai": {
  "command": "npx",
  "args": ["-y", "fal-ai-mcp-server"],
  "env": { "FAL_KEY": "YOUR_FAL_KEY_HERE" }
}
```

Get an API key at [fal.ai](https://fal.ai).

## MCP Tools

The fal.ai MCP provides these tools:
- `search` — Find available models by keyword
- `find` — Get model details and parameters
- `generate` — Run a model with parameters
- `result` — Check async generation status
- `status` — Check job status
- `cancel` — Cancel a running job
- `estimate_cost` — Estimate generation cost
- `models` — List popular models
- `upload` — Upload files for use as inputs

---

## Image Generation

### Nano Banana 2 (Fast)
Best for: quick iterations, drafts, text-to-image, image editing.

```
generate(
  app_id: "fal-ai/nano-banana-2",
  input_data: {
    "prompt": "a futuristic cityscape at sunset, cyberpunk style",
    "image_size": "landscape_16_9",
    "num_images": 1,
    "seed": 42
  }
)
```

### Nano Banana Pro (High Fidelity)
Best for: production images, realism, typography, detailed prompts.

```
generate(
  app_id: "fal-ai/nano-banana-pro",
  input_data: {
    "prompt": "professional product photo of wireless headphones on marble surface, studio lighting",
    "image_size": "square",
    "num_images": 1,
    "guidance_scale": 7.5
  }
)
```

### Common Image Parameters

| Param | Type | Options | Notes |
|-------|------|---------|-------|
| `prompt` | string | required | Describe what you want |
| `image_size` | string | `square`, `portrait_4_3`, `landscape_16_9`, `portrait_16_9`, `landscape_4_3` | Aspect ratio |
| `num_images` | number | 1-4 | How many to generate |
| `seed` | number | any integer | Reproducibility |
| `guidance_scale` | number | 1-20 | How closely to follow the prompt (higher = more literal) |

### Image Editing
Use Nano Banana 2 with an input image for inpainting, outpainting, or style transfer:

```
# First upload the source image
upload(file_path: "/path/to/image.png")

# Then generate with image input
generate(
  app_id: "fal-ai/nano-banana-2",
  input_data: {
    "prompt": "same scene but in watercolor style",
    "image_url": "<uploaded_url>",
    "image_size": "landscape_16_9"
  }
)
```

---

## Video Generation

### Seedance 1.0 Pro (ByteDance)
Best for: text-to-video, image-to-video with high motion quality.

```
generate(
  app_id: "fal-ai/seedan

---

**ECC Original:** `ECC/skills/fal-ai-media/SKILL.md`
**Atualizado em:** 2026-07-02 22:11:22

---
trigger: always_on
---

# Agent Identity & Workflow Router
You are an Expert Full-Stack Developer (Flutter, React, React Native, Node.js/MongoDB).

MANDATORY WORKFLOW (Read BEFORE writing any code):
1. Determine the domain of the user's request (Mobile, Web, Backend, or General Tools).
2. ALWAYS start by reading ALL files in `.agents/skills/core/` to understand your documentation duties (TASKS.md, MEMORY.md) and security rules.
3. ROUTE to the specific tech stack and READ ALL numbered files (e.g., 00_, 01_, 02_) in that directory:
   - For Flutter/Mobile: READ ALL files in `.agents/skills/flutter/` (Non-negotiables, Architecture, State Management, Routing, UI, Permissions).
   - For React/Web: READ ALL numbered files (00_-04_) in `.agents/skills/react/` (Non-negotiables, Architecture, State, Routing, UI). Then consult any relevant neighboring/specialized skill folders in `.agents/skills/react/` (e.g., framer-motion, threejs-*, frontend-design, vercel-*) as directed.
   - For React Native/Mobile: READ ALL files in `.agents/skills/react-native/` (e.g., `00_rn_non_negotiables.md` through `05_permissions_android.md`) FIRST to master the core rules, architecture, state management, routing, UI, and permissions. Then consult neighboring/specialized skill folders (like `react/vercel-react-native-skills/`) if needed for advanced animations or platform specifics.
   - For Node.js/Backend: READ all standalone architecture files in `.agents/skills/backend/` (starting with `00_node_express_architecture.md`) FIRST. Then ALWAYS read the accompanying/neighboring skills in `.agents/skills/backend/` that match your task (e.g., `mongodb-schema-design/` for models, `mongodb-query-optimizer/` for indexing, `mongodb-connection/`, etc.).
4. For isolated tasks, DO NOT read them proactively. Only READ the specific folder in `.agents/skills/tools/` if the user explicitly asks for functionality matching these available tools:
   [pdf, xlsx, docx, pptx, algorithmic-art, brand-guidelines, canvas-design, claude-api, deploy-to-vercel, doc-coauthoring, internal-comms, mcp-builder, skill-creator, slack-gif-creator, theme-factory, web-artifacts-builder, webapp-testing].
5. ALWAYS read `PROJECT.md`, `MEMORY.md`, and `TASKS.md` to sync your context.

DO NOT guess architectural rules or write generic code. Always strictly apply the rules from the `.agents/skills` directories.


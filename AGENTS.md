<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# UNPLUGGED LOUNGE

## Stack

- Next.js
- React
- TypeScript
- Sanity
- SCSS
- Vercel

## Development Rules

- Next.js App Router 사용
- TypeScript 사용
- 기존 프로젝트 구조 최대한 유지
- 기존 SCSS 구조 유지
- 불필요한 npm package 설치 금지
- Server Component 우선 사용
- Client Component는 필요한 경우만 사용
- 기존 함수 수정 시 기존 동작 유지
- Sanity schema 변경 시 기존 데이터 호환성 확인

## Verification

작업 완료 후:

npm run build

실행하여 TypeScript 및 Next.js build 오류 확인
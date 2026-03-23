# Rednote Post - Web Application

A Next.js web application for rendering markdown content into XHS (小红书/Xiaohongshu) style cards with complete Markdown + LaTeX support.

## Quick Start

```bash
# Development (port 3002)
npm run dev

# Testing
npm test                 # All tests
npm test -- --no-coverage  # Faster feedback

# Build verification
npm run build
```

**Port**: 3002 (avoids conflict with VibeTrip on 3000)

## Architecture

### Dual Interface Design

```
Desktop (> 768px)          Mobile (≤ 768px)
    │                            │
    ▼                            ▼
  / (full editor)          /mobile (simplified)
    │                            │
    ├─ Session management         ├─ Mobile editor
    ├─ Real-time preview          ├─ Theme preview
    └─ Advanced controls          └─ Touch-optimized UI
```

**Auto-redirect**: `app/page.tsx` detects mobile and redirects to `/mobile`

### Core Directory Structure

```
web/
├── app/
│   ├── edit/[id]/           # Unified editor (mobile + desktop)
│   ├── preview/[id]/        # Unified preview (mobile + desktop)
│   ├── mobile/              # Legacy mobile routes (deprecated)
│   │   ├── edit/[id]/       # Session editor (auto-save)
│   │   └── preview/[id]/    # Theme preview
│   ├── page.tsx             # Desktop home + mobile redirect
│   └── globals.css          # Tailwind v3 + Pencil variables
├── hooks/
│   └── useLocalStorage.ts   # Session management + auto-save
├── contexts/
│   └── StorageContext.tsx   # Global session state
├── lib/
│   ├── xhs-renderer.ts      # XHS card renderer
│   ├── storage.ts           # LocalStorage utilities
│   └── hooks/               # useMobileDetection
└── components/
    └── mobile/              # Mobile-specific UI
```

## Critical Patterns

### React: Preventing Infinite Loops

**Problem**: Unstable function references cause infinite re-renders

**Solution** (from `useLocalStorage.ts`):
```typescript
// ❌ WRONG - recreated every render
const updateCurrent = (data) => {
  setSessions([...sessions, updated]); // Stale closure!
};

// ✅ CORRECT - stable reference
const updateCurrent = useCallback((data) => {
  setSessions((prev) => {  // Functional update
    const updated = [...prev, newSession];
    saveToStorage(updated);
    return updated;
  });
}, []); // No deps = stable forever
```

**Key patterns**:
- Wrap ALL hook functions in `useCallback`
- Use functional updates `setState(prev => ...)`
- Use `useRef` for initialization tracking (no re-render)

### Testing: HTML Assertions

**Problem**: markdown-it plugins add dynamic attributes to HTML

**Solution**:
```typescript
// ❌ WRONG - fails with extra attributes
expect(html).toContain('<h1>');

// ✅ CORRECT - flexible matching
expect(html).toMatch(/<h1/);
expect(html).toMatch(/<span[^>]*katex/);
```

## Testing

```bash
# Unit tests (Jest)
npm test                    # All tests with coverage
npm test -- --no-coverage   # Faster feedback

# E2E tests (Playwright)
npm run test:e2e            # Run all E2E tests
npm run test:e2e -- --ui    # Interactive UI mode
npm run test:e2e -- --debug # Debug mode
```

### Session Management Patterns

**localStorage key**: `rednote-sessions`

**SessionList navigation** (`components/SessionList.tsx`):
- `navigateOnSelect={true}`: Click navigates to `/edit/[id]` (URL changes)
- `navigateOnSelect={false}`: Click only updates localStorage, no navigation

**Critical**: In edit page, use `navigateOnSelect={true}` so sidebar clicks actually navigate to the new session's URL.

### Mobile: Auto-Save Behavior

**Implementation** (`MarkdownInput.tsx` + `useLocalStorage.ts`):
1. User types → 500ms debounce
2. `useLocalStorage` updates `currentSession` in localStorage
3. Page load → useEffect syncs from `currentSession` (once only)
4. `hasSyncedRef` prevents overwriting user input during editing

**Critical**: Never sync from `currentSession` while user is actively editing

### Jest: ES Module Dependencies

When adding ES modules (markdown-it, etc.), update `jest.config.js`:

```javascript
transformIgnorePatterns: [
  '/node_modules/(?!(markdown-it|markdown-it-katex|...))/'
]
```

## Reference

### Tech Stack

- **Framework**: Next.js 16.1.6 + React 19 + TypeScript
- **Styling**: Tailwind CSS 3.4.17 (Pencil design system)
- **Testing**: Jest (unit) + Playwright (E2E mobile)
- **Markdown**: markdown-it + KaTeX + highlight.js

### Why markdown-it over marked?

- ✅ Better plugin architecture
- ✅ Official KaTeX support
- ✅ Better Chinese language support
- ⚠️ Requires special test assertions (adds IDs/attributes)

### Commit Conventions

```
Feat: New features
Fix: Bug fixes
Docs: Documentation
Test: Test updates
Refactor: Code refactoring
```

Include detailed bullet points for significant changes.

### Development Workflow

1. Write failing tests first (TDD)
2. Implement to pass tests
3. Run `npm test` + `npm run build`
4. Commit with conventional format
5. Push to remote

### Environment Notes

**Node.js**: Uses npm (not yarn/pnpm)

**Port management**:
```bash
lsof -ti:3002              # Check port 3002
kill -9 $(lsof -ti:3002)   # Free port 3002
```

# Rednote Post - Web Application

## Project Overview

A Next.js web application for rendering markdown content into XHS (小红书/Xiaohongshu) style cards with complete Markdown + LaTeX support.

## Rules & Skills

- Follow rules in `~/.claude/rules/common/`
- TypeScript: follow `~/.claude/rules/typescript/`

## Development Server

**Port**: `3002` (to avoid conflicts with other Next.js projects)

```bash
# Start development server on port 3002
npm run dev

# Access at http://localhost:3002
```

**Port Configuration**: The dev server is configured to run on port 3002 to avoid conflicts with other local projects (e.g., VibeTrip on port 3000).

## Tech Stack

- **Framework**: Next.js 16.1.6 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.17 (stable version)
- **Testing**: Jest with jsdom environment
- **Markdown Rendering**: markdown-it with plugins
- **Math Rendering**: KaTeX via markdown-it-katex
- **Syntax Highlighting**: highlight.js

## XHS Renderer Testing

### Testing Patterns

The XHS renderer (`lib/xhs-renderer.ts`) uses real markdown-it implementation in tests (not mocked) for accuracy.

**Important test patterns:**
- Use `match(/<h1/)` instead of `toContain('<h1>')` because markdown-it-anchor adds IDs to headers
- Use regex like `/<span[^>]*katex/` for KaTeX elements which have complex HTML structure
- Test the actual rendering output rather than mocking the markdown parser

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- lib/__tests__/xhs-renderer.test.ts

# Run without coverage for faster feedback
npm test -- --no-coverage
```

## Dependencies

### Core Markdown Dependencies

- **markdown-it** (v14.1.1): Core Markdown parser with plugin system
  - Better extension support than `marked`
  - More powerful plugin architecture
  - Better Chinese language support

- **markdown-it-katex** (v2.0.3): LaTeX math formula rendering
  - Supports inline math: `$E = mc^2$`
  - Supports block math: `$$\int_0^1 x dx$$`

- **markdown-it-anchor** (v9.2.0): Automatic header anchors
  - Adds `id` attributes to headers
  - Affects test assertions (headers have additional attributes)

- **highlight.js** (v11.11.1): Syntax highlighting
  - Supports 180+ languages
  - Auto-detection for unknown languages

### Jest Configuration for ES Modules

When adding new ES module dependencies, update `jest.config.js`:

```javascript
transformIgnorePatterns: [
  '/node_modules/(?!(marked|markdown-it|markdown-it-katex|markdown-it-anchor|highlight.js)/)',
  '^.+\\.module\\.(css|sass|scss)$',
],
```

This allows Jest to transform these dependencies properly.

## TypeScript Declarations

Custom TypeScript declarations are stored in `web/types/` for packages without `@types/`:

- `types/markdown-it-katex.d.ts` - Declares the PluginSimple type for markdown-it-katex

## Build Verification

Always run the build before committing to ensure TypeScript compiles:

```bash
npm run build
```

The build should complete successfully with no TypeScript errors.

## File Structure

```
web/
├── lib/
│   ├── xhs-renderer.ts          # Main XHS renderer implementation
│   └── __tests__/
│       └── xhs-renderer.test.ts  # Comprehensive test suite (15 tests)
├── public/
│   └── assets/
│       └── card.html             # HTML template with KaTeX CSS
├── types/
│   └── markdown-it-katex.d.ts   # TypeScript declarations
├── jest.config.js                # Jest configuration
└── package.json                  # Dependencies
```

## Features Implemented

✅ **Table Support**: Full rendering with thead/tbody
✅ **LaTeX Math**: Inline and block formulas with KaTeX
✅ **Syntax Highlighting**: Code blocks with language-specific highlighting
✅ **Nested Structures**: Lists inside blockquotes, multi-level lists
✅ **Tag Extraction**: Preserved from Python version
✅ **8 Themes**: default, neo-brutalism, terminal, botanical, playful-geometric, retro, professional, sketch

## Test Coverage

All 15 tests passing:
- Tables rendering
- Inline LaTeX math
- Block LaTeX math
- Code syntax highlighting
- Nested lists and blockquotes
- Complex multi-feature documents
- Tag extraction and theming
- All 8 theme variations

## Commit Conventions

Use conventional commit format:
- `Feat:` - New features
- `Fix:` - Bug fixes
- `Docs:` - Documentation changes
- `Test:` - Test updates
- `Refactor:` - Code refactoring

Include detailed descriptions with bullet points for significant changes.

## Development Workflow

1. Write failing tests first (TDD approach)
2. Implement feature to make tests pass
3. Run `npm test` to verify all tests pass
4. Run `npm run build` to verify build succeeds
5. Commit with conventional commit format
6. Push to remote repository

## Port Configuration

**Why Port 3002?**
- Avoids conflict with VibeTrip project (port 3000)
- Keeps port numbers in the 3000-3100 range for Next.js projects
- Easy to remember: add 2 to default port 3000

**Configuration:**
- Dev server: `next dev --port 3002` (in package.json scripts)
- Production server: `next start --port 3002` (in package.json scripts)

**Checking Port Availability:**
```bash
# Check if port 3002 is in use
lsof -ti:3002

# Kill any process using port 3002
kill -9 $(lsof -ti:3002)
```

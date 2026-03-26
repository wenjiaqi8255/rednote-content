---
phase: quick
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - web/app/preview/[id]/page.tsx
  - web/components/mobile/ThemeSelector.tsx
autonomous: true
requirements: []
---

<objective>
将"选择喜欢的排版"模块从卡片下方（上下布局）改为卡片右侧（左右布局）

Purpose: 优化预览页面布局，使主题选择器和预览卡片并排显示
Output: 修改后的预览页面布局
</objective>

<context>
@web/app/preview/[id]/page.tsx
@web/components/mobile/ThemeSelector.tsx
</context>

<tasks>

<task type="auto">
  <name>修改预览页面布局为左右结构</name>
  <files>web/app/preview/[id]/page.tsx</files>
  <action>
将预览页面的主内容区域从垂直堆叠改为水平并排布局：

1. 在 `max-w-[375px] md:max-w-4xl` 的容器内，将 `flex flex-col gap-4` 改为 `flex flex-row gap-6 items-start`
2. 将 ThemeSelector 组件从卡片下方移到卡片右侧
3. 保持响应式：移动端（< md）仍保持垂直布局（单列），桌面端（md 及以上）使用水平布局

具体代码修改：
- 找到 `div className="flex flex-col gap-4 items-center"` (line 488)
- 改为 `div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-center"`
- 在 CardPreview 之后、ThemeSelector 之前不需要额外wrapper，直接并排放置
  </action>
  <verify>
  <automated>npm run build 2>&1 | head -30</automated>
  </verify>
  <done>预览页面在桌面端显示为左右布局：左侧是卡片，右侧是主题选择器</done>
</task>

<task type="auto">
  <name>调整主题选择器移动端布局</name>
  <files>web/components/mobile/ThemeSelector.tsx</files>
  <action>
调整 ThemeSelector 组件以适应新的左右布局：

1. 移除垂直滚动样式 `maxHeight: '240px'` 和 `overflowY: 'auto'`
2. 改为水平滚动按钮布局：使用 `display: flex` + `flexDirection: 'row'` + `gap: '12px'`
3. 按钮样式保持不变（可选：可减小移动端的按钮尺寸以适应水平布局）

具体代码修改：
- 找到 `flexDirection: 'column'` (line 51)
- 改为 `flexDirection: 'row'`，同时调整 gap 为 '12px'
- 移除 maxHeight 和 overflowY 相关的样式
- 添加 `overflowX: 'auto'` 用于水平滚动
  </action>
  <verify>
  <automated>npm run build 2>&1 | head -30</automated>
  </verify>
  <done>主题选择器在桌面端显示为水平滚动按钮列表</done>
</task>

</tasks>

<verification>
npm run build 成功，无 TypeScript 错误
</verification>

<success_criteria>
- 桌面端（>= 768px）：卡片在左，主题选择器在右，左右并排
- 移动端（< 768px）：保持原有垂直布局，卡片在上，主题选择器在下
</success_criteria>

<output>
After completion, create .planning/quick/260326-qur/260326-qur-SUMMARY.md
</output>
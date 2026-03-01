// 简单的测试脚本 - 测试主题推荐功能
const THEME_RULES = [
  {
    keywords: ['代码', '编程', '开发', 'API', '算法', '函数', '变量', '框架', '前端', '后端'],
    theme: 'terminal',
    weight: 10,
  },
  {
    keywords: ['设计', '创意', '艺术', '色彩', '插画', '视觉', '美学', '灵感'],
    theme: 'playful-geometric',
    weight: 9,
  },
  {
    keywords: ['商务', '职场', '工作', '效率', '管理', '创业', '商业', '项目'],
    theme: 'professional',
    weight: 8,
  },
  {
    keywords: ['植物', '自然', '花卉', '园艺', '绿色', '生态', '有机', '环保'],
    theme: 'botanical',
    weight: 8,
  },
  {
    keywords: ['复古', '怀旧', '经典', '传统', '历史', '年代', '回忆'],
    theme: 'retro',
    weight: 7,
  },
  {
    keywords: ['手绘', '草图', '涂鸦', '插画', '素描', '速写', '笔记'],
    theme: 'sketch',
    weight: 7,
  },
  {
    keywords: ['设计', '排版', '大胆', '强烈', '个性', '独特', '鲜明'],
    theme: 'neo-brutalism',
    weight: 6,
  },
];

function recommendTheme(content) {
  const scores = {};

  // 初始化所有主题的分数
  for (const rule of THEME_RULES) {
    scores[rule.theme] = 0;
  }

  // 统计每个关键词的匹配次数
  for (const rule of THEME_RULES) {
    for (const keyword of rule.keywords) {
      const regex = new RegExp(keyword, 'gi');
      const matches = content.match(regex);
      if (matches) {
        scores[rule.theme] += matches.length * rule.weight;
      }
    }
  }

  // 找出得分最高的主题
  let maxScore = 0;
  let recommendedTheme = 'default';

  for (const [theme, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      recommendedTheme = theme;
    }
  }

  // 如果没有匹配任何关键词，返回默认主题
  if (maxScore === 0) {
    return 'default';
  }

  return recommendedTheme;
}

// 运行测试
console.log('=== 主题推荐测试 ===\n');

// Test 1: 代码内容
const test1 = recommendTheme('这是一篇关于编程和Python代码的文章');
console.log(`✓ Test 1 - 代码内容推荐 terminal: ${test1 === 'terminal' ? '✅ PASS' : '❌ FAIL (实际: ' + test1 + ')'}`);

// Test 2: 设计内容
const test2 = recommendTheme('设计创意艺术色彩插画视觉美学');
console.log(`✓ Test 2 - 设计内容推荐 playful-geometric: ${test2 === 'playful-geometric' ? '✅ PASS' : '❌ FAIL (实际: ' + test2 + ')'}`);

// Test 3: 通用内容
const test3 = recommendTheme('这是一些普通的内容，没有特定关键词');
console.log(`✓ Test 3 - 通用内容推荐 default: ${test3 === 'default' ? '✅ PASS' : '❌ FAIL (实际: ' + test3 + ')'}`);

// Test 4: 优先级测试
const test4 = recommendTheme('代码编程设计创意'); // terminal(10) vs playful-geometric(9)
console.log(`✓ Test 4 - 高权重主题优先: ${test4 === 'terminal' ? '✅ PASS' : '❌ FAIL (实际: ' + test4 + ')'}`);

// Test 5: 商务内容
const test5 = recommendTheme('商务职场工作效率管理创业商业项目');
console.log(`✓ Test 5 - 商务内容推荐 professional: ${test5 === 'professional' ? '✅ PASS' : '❌ FAIL (实际: ' + test5 + ')'}`);

// Test 6: 植物主题
const test6 = recommendTheme('植物自然花卉园艺绿色生态有机环保');
console.log(`✓ Test 6 - 植物主题推荐 botanical: ${test6 === 'botanical' ? '✅ PASS' : '❌ FAIL (实际: ' + test6 + ')'}`);

console.log('\n=== 内容分页测试 ===\n');

// Test 7: 手动分页
const content7 = 'Page 1\n---\nPage 2\n---\nPage 3';
const parts7 = content7.split(/\n---+\n/);
console.log(`✓ Test 7 - 手动分页 (3部分): ${parts7.length === 3 ? '✅ PASS' : '❌ FAIL (实际: ' + parts7.length + ')'}`);

// Test 8: 单页内容
const content8 = 'Single page without separator';
const parts8 = content8.split(/\n---+\n/);
console.log(`✓ Test 8 - 单页内容 (1部分): ${parts8.length === 1 ? '✅ PASS' : '❌ FAIL (实际: ' + parts8.length + ')'}`);

console.log('\n=== 标题提取测试 ===\n');

// Test 9: 标准标题
const content9 = '# My Title\nContent here';
const match9 = content9.match(/^#\s+(.+)$/m);
console.log(`✓ Test 9 - 标准标题提取: ${match9 && match9[1] === 'My Title' ? '✅ PASS' : '❌ FAIL'}`);

// Test 10: 无标题
const content10 = 'Just content without heading';
const match10 = content10.match(/^#\s+(.+)$/);
console.log(`✓ Test 10 - 无标题返回默认: ${match10 === null ? '✅ PASS' : '❌ FAIL'}`);

console.log('\n=== 测试完成 ===');

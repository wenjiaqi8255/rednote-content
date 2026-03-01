/**
 * 主题推荐规则
 */
interface ThemeRule {
  keywords: string[];
  theme: string;
  weight: number;
}

const THEME_RULES: ThemeRule[] = [
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

/**
 * 根据内容推荐主题
 */
export function recommendTheme(content: string): string {
  const scores: Record<string, number> = {};

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

/**
 * 获取所有可用主题
 */
export function getAvailableThemes(): string[] {
  return [
    'default',
    'playful-geometric',
    'neo-brutalism',
    'botanical',
    'professional',
    'retro',
    'terminal',
    'sketch',
  ];
}

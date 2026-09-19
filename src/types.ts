export const DOMAINS = {
  decision: {
    id: 'decision',
    name: '决策判断',
    en: 'Decision',
    blurb: '在选项之间做取舍：从第一性原理拆解，用逆向与二阶看后果，用期望值与机会成本定价。',
  },
  systems: {
    id: 'systems',
    name: '系统演化',
    en: 'Systems',
    blurb: '看反馈、杠杆、瓶颈与复利。多数长期结果不是单次选择，而是结构在跑。',
  },
  probability: {
    id: 'probability',
    name: '概率不确定',
    en: 'Probability',
    blurb: '世界不是确定的。用基础比率、贝叶斯和肥尾，校正故事对判断的绑架。',
  },
  economics: {
    id: 'economics',
    name: '激励与交换',
    en: 'Incentives',
    blurb: '人会朝报酬走。看激励、代理、比较优势与网络效应，再谈意愿与执行。',
  },
  cognition: {
    id: 'cognition',
    name: '认知纠偏',
    en: 'Cognition',
    blurb: '大脑省电的捷径会系统性地偏。先认出偏差，再给判断加配重。',
  },
  learning: {
    id: 'learning',
    name: '学习成长',
    en: 'Learning',
    blurb: '模型要能教出去、能用在新问题上。费曼、帕累托与能力圈决定学什么、学多深。',
  },
  strategy: {
    id: 'strategy',
    name: '战略与组织',
    en: 'Strategy',
    blurb: '定位、能力、标杆与文化。把竞争从口号落到可对照的位置和流程。',
  },
  science: {
    id: 'science',
    name: '科学类比',
    en: 'Science',
    blurb: '从物理、生态与信息科学借结构：力随距离、生态位、守恒与熵，用来看社会系统。',
  },
} as const

export type DomainId = keyof typeof DOMAINS

export const RELATION_KINDS = {
  complements: '互补并用',
  corrects: '制衡纠偏',
  extends: '延伸加深',
  contrasts: '对照辨析',
  prerequisite: '先掌握',
} as const

export type RelationKind = keyof typeof RELATION_KINDS

export const CASE_SCENES = ['决策', '商业', '个人', '组织', '产品', '投资'] as const
export type CaseScene = (typeof CASE_SCENES)[number]

export type CaseStudy = {
  title: string
  scene: CaseScene
  context: string
  instinct: string
  apply: string
  action: string
  lesson: string
}

export type RelatedLink = {
  id: string
  kind: RelationKind
  note: string
}

export type Model = {
  id: string
  no: number
  name: string
  en: string
  aka: string[]
  domain: DomainId
  origin: string
  difficulty: 1 | 2 | 3
  oneLiner: string
  metaphor: string
  essence: string
  steps: string[]
  when: string[]
  whenNot: string[]
  pitfalls: string[]
  checklist: string[]
  prompts: string[]
  cases: CaseStudy[]
  related: RelatedLink[]
  tags: string[]
}

export type PlaybookStep = {
  modelId: string
  role: string
  instruction: string
}

export type Playbook = {
  id: string
  name: string
  en: string
  when: string
  outcome: string
  steps: PlaybookStep[]
}

export type PathStep = {
  modelId: string
  why: string
}

export type LearningPath = {
  id: string
  name: string
  audience: string
  duration: string
  promise: string
  steps: PathStep[]
}

export type Situation = {
  id: string
  question: string
  symptoms: string[]
  models: { id: string; why: string }[]
  playbookId?: string
}

export type ApplyRecord = {
  id: string
  modelId: string
  situation: string
  answers: string[]
  createdAt: string
}

export type Route =
  | { name: 'home' }
  | { name: 'catalog'; domain?: DomainId; q?: string }
  | { name: 'model'; id: string }
  | { name: 'map'; focus?: string }
  | { name: 'paths' }
  | { name: 'path'; id: string }
  | { name: 'playbooks' }
  | { name: 'playbook'; id: string }
  | { name: 'situations' }
  | { name: 'apply'; id: string }
  | { name: 'compare'; a: string; b: string }
  | { name: 'desk' }

import type { Job, Profile, UserJobState } from '../types'

export const defaultProfile: Profile = {
  rolePreferences: ['AI产品经理', '产品管培生'],
  industryPreferences: ['人工智能', '教育科技', '电商'],
  locationPreferences: ['上海', '北京', '深圳', '杭州'],
  jobTypePreferences: ['校招'],
  skillTags: ['Agent', 'RAG', '数据分析', '用户研究', '产品设计'],
  targetCompanies: [],
  excludedKeywords: ['销售', '纯运营'],
  graduationYear: 2027,
}

const today = new Date()
const iso = (daysAgo: number) => {
  const date = new Date(today)
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}
const future = (days: number) => {
  const date = new Date(today)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

export const demoJobs: Job[] = [
  { id: 'aurora-ai-pm', companyName: '星澜智能', companyShort: '星', title: 'AI 产品经理（智能体方向）', roleCategory: 'AI产品经理', industryTags: ['人工智能', '企业服务'], location: '上海', jobType: '校招', graduateYears: [2027], description: '负责企业级智能体产品从需求洞察到上线迭代，探索大模型在真实业务场景中的落地。', responsibilities: ['洞察用户工作流并定义 Agent 产品方案', '协同算法与工程团队推进产品落地', '基于数据和反馈持续优化体验'], requirements: ['2027 届本科及以上学历', '理解大模型、RAG 或 Agent 基础原理', '具备优秀的用户研究与跨团队协作能力'], skillTags: ['Agent', 'RAG', '用户研究', '产品设计', 'SQL'], publishedAt: iso(0), deadlineAt: future(9), applyUrl: 'https://example.com/demo/aurora', status: 'active', sourceName: '企业招聘官网', accent: '#496ff5' },
  { id: 'puddle-apm', companyName: '涟漪科技', companyShort: '涟', title: 'AI 应用产品经理', roleCategory: 'AI产品经理', industryTags: ['人工智能', '效率工具'], location: '北京', jobType: '校招', graduateYears: [2027], description: '面向知识工作者设计 AI 原生效率产品，持续打磨从模型能力到用户价值的关键链路。', responsibilities: ['规划 AI 应用核心功能', '设计评测指标并跟进实验效果', '沉淀行业与用户需求洞察'], requirements: ['对 AI 产品有高频使用和独立判断', '具备数据分析与原型能力', '有 Prompt Engineering 项目经验优先'], skillTags: ['产品设计', '数据分析', 'Prompt Engineering', '用户研究'], publishedAt: iso(1), deadlineAt: future(20), applyUrl: 'https://example.com/demo/puddle', status: 'active', sourceName: 'Greenhouse Demo', accent: '#7357d8' },
  { id: 'morning-edu', companyName: '晨光学习', companyShort: '晨', title: '教育 AI 产品经理', roleCategory: '教育产品经理', industryTags: ['教育科技', '人工智能'], location: '杭州', jobType: '校招', graduateYears: [2027], description: '为青少年学习场景打造个性化 AI 助教，参与学习路径、反馈机制与内容体验设计。', responsibilities: ['设计个性化学习路径与交互', '分析学习数据并验证产品假设', '协调教研、算法和研发团队'], requirements: ['关注教育公平与学习体验', '具备定性和定量研究能力', '理解推荐系统或知识图谱优先'], skillTags: ['用户研究', '数据分析', '产品设计', '知识图谱'], publishedAt: iso(2), deadlineAt: future(6), applyUrl: 'https://example.com/demo/morning', status: 'active', sourceName: 'Lever Demo', accent: '#e87843' },
  { id: 'harbor-trainee', companyName: '远港集团', companyShort: '港', title: '产品管理培训生', roleCategory: '产品管培生', industryTags: ['电商', '本地生活'], location: '深圳', jobType: '校招', graduateYears: [2027], description: '通过业务轮岗参与交易、商家和履约产品建设，培养兼具业务视角与产品能力的年轻人才。', responsibilities: ['参与核心业务轮岗和专题项目', '分析经营数据并推动流程优化', '完成用户与商家需求调研'], requirements: ['2027 届毕业生', '学习能力和主人翁意识强', '具备商业分析或项目管理经验'], skillTags: ['数据分析', '用户研究', '项目管理', '商业分析'], publishedAt: iso(3), deadlineAt: future(14), applyUrl: 'https://example.com/demo/harbor', status: 'active', sourceName: '企业招聘官网', accent: '#278e78' },
  { id: 'nebula-data', companyName: '云岫数据', companyShort: '云', title: '数据产品经理', roleCategory: '数据产品经理', industryTags: ['企业服务', '数据智能'], location: '上海', jobType: '校招', graduateYears: [2027], description: '建设面向业务团队的数据资产与分析产品，让数据被更高效地发现、理解和使用。', responsibilities: ['梳理指标体系和数据产品路线图', '设计自助分析与数据资产功能', '推动数据治理规范落地'], requirements: ['熟练使用 SQL', '理解数据仓库和指标体系', '具备 B 端产品设计经验优先'], skillTags: ['SQL', '数据分析', 'B端产品', '数据仓库'], publishedAt: iso(4), applyUrl: 'https://example.com/demo/nebula', status: 'active', sourceName: 'CSV 导入', accent: '#3979a9' },
  { id: 'moss-solution', companyName: '青苔智研', companyShort: '青', title: 'AI 解决方案产品经理', roleCategory: 'AI解决方案产品经理', industryTags: ['人工智能', '企业服务'], location: '北京', jobType: '校招', graduateYears: [2027], description: '连接客户场景与大模型能力，形成可复制的行业解决方案和产品化交付。', responsibilities: ['拆解客户问题并设计解决方案', '完成 PoC 并沉淀标准方案', '协同销售与交付推进项目'], requirements: ['理解 RAG 和大模型应用架构', '具备结构化表达和项目推进能力', '有 B 端 SaaS 实践优先'], skillTags: ['RAG', '项目管理', 'B端产品', 'SaaS'], publishedAt: iso(6), applyUrl: 'https://example.com/demo/moss', status: 'active', sourceName: '企业招聘官网', accent: '#4c8f58' },
  { id: 'orbit-commerce', companyName: '环流商业', companyShort: '环', title: '国际电商产品经理', roleCategory: '电商产品经理', industryTags: ['电商', '出海'], location: '深圳', jobType: '校招', graduateYears: [2027], description: '负责跨境交易体验和本地化能力建设，与全球运营团队共同提升用户转化。', responsibilities: ['设计跨境交易与支付体验', '分析漏斗数据并推进增长实验', '协调多地区运营和研发团队'], requirements: ['英语可作为工作语言', '具备数据分析与增长意识', '了解支付或跨境电商优先'], skillTags: ['数据分析', '增长实验', '国际化', '支付'], publishedAt: iso(8), deadlineAt: future(30), applyUrl: 'https://example.com/demo/orbit', status: 'active', sourceName: 'Lever Demo', accent: '#de6c4c' },
  { id: 'sprout-intern', companyName: '芽点互动', companyShort: '芽', title: 'AI 产品实习生', roleCategory: 'AI产品经理', industryTags: ['人工智能', '内容社区'], location: '北京', jobType: '实习', graduateYears: [2027, 2028], description: '参与 AI 内容创作工具的需求分析、原型设计和用户反馈闭环。', responsibilities: ['跟进用户反馈与竞品动态', '完成原型和需求文档', '协助评估模型输出质量'], requirements: ['每周实习 4 天以上', '熟悉常见 AI 创作工具', '具备原型设计能力'], skillTags: ['产品设计', '用户研究', 'Prompt Engineering'], publishedAt: iso(1), applyUrl: 'https://example.com/demo/sprout', status: 'active', sourceName: '手动录入', accent: '#c96280' },
  { id: 'peak-ops', companyName: '峰谷网络', companyShort: '峰', title: '产品运营培训生', roleCategory: '产品管培生', industryTags: ['本地生活'], location: '杭州', jobType: '校招', graduateYears: [2027], description: '围绕商家增长开展产品运营和策略分析，推动工具使用与业务增长。', responsibilities: ['制定商家产品运营策略', '分析业务指标和增长机会', '协同产品团队优化工具'], requirements: ['具备运营或增长实践', '数据敏感度高', '沟通协调能力强'], skillTags: ['数据分析', '增长实验', '项目管理'], publishedAt: iso(11), applyUrl: 'https://example.com/demo/peak', status: 'active', sourceName: 'CSV 导入', accent: '#b87937' },
  { id: 'leaf-learning', companyName: '叶舟教育', companyShort: '叶', title: '学习产品策划', roleCategory: '教育产品经理', industryTags: ['教育科技'], location: '上海', jobType: '校招', graduateYears: [2027], description: '设计成人学习产品的内容结构与练习体验，持续提升完课率和学习效果。', responsibilities: ['规划课程产品体验', '开展学习者访谈', '跟踪学习行为数据'], requirements: ['热爱教育与内容产品', '具备用户研究能力', '有课程设计经验优先'], skillTags: ['用户研究', '产品设计', '课程设计'], publishedAt: iso(18), applyUrl: 'https://example.com/demo/leaf', status: 'suspected_closed', sourceName: '企业招聘官网', accent: '#7a9361' },
  { id: 'lighthouse-b2b', companyName: '灯塔协作', companyShort: '灯', title: 'B 端产品经理', roleCategory: '企业产品经理', industryTags: ['企业服务'], location: '北京', jobType: '校招', graduateYears: [2026], description: '参与协同办公平台权限、流程和开放能力设计。', responsibilities: ['梳理企业流程与权限模型', '设计平台开放能力', '跟进客户反馈和版本迭代'], requirements: ['理解复杂业务系统', '具备 B 端产品实习经验', '熟悉 API 与 SaaS'], skillTags: ['B端产品', 'SaaS', 'API', '产品设计'], publishedAt: iso(25), applyUrl: 'https://example.com/demo/lighthouse', status: 'active', sourceName: 'Greenhouse Demo', accent: '#5e6c84' },
  { id: 'sunset-growth', companyName: '晚霞生活', companyShort: '霞', title: '用户增长产品经理', roleCategory: '增长产品经理', industryTags: ['本地生活', '电商'], location: '广州', jobType: '校招', graduateYears: [2027], description: '围绕消费者增长和留存设计产品机制，负责实验与效果复盘。', responsibilities: ['设计增长策略和产品机制', '搭建实验并分析效果', '挖掘用户生命周期机会'], requirements: ['熟悉增长模型', '掌握 SQL 和统计基础', '具备用户分层经验'], skillTags: ['SQL', '增长实验', '数据分析', '用户分层'], publishedAt: iso(35), deadlineAt: iso(2), applyUrl: 'https://example.com/demo/sunset', status: 'closed', sourceName: 'Lever Demo', accent: '#aa605b' },
]

export const defaultUserJobs: Record<string, UserJobState> = {
  'aurora-ai-pm': { saved: true, applicationStatus: 'interview', statusUpdatedAt: iso(1), notes: '准备业务面和产品案例。' },
  'puddle-apm': { saved: true, applicationStatus: 'applied', statusUpdatedAt: iso(2) },
  'morning-edu': { saved: false, applicationStatus: 'assessment', statusUpdatedAt: iso(1) },
  'harbor-trainee': { saved: false, applicationStatus: 'wishlist', statusUpdatedAt: iso(3) },
  'nebula-data': { saved: false, applicationStatus: 'rejected', statusUpdatedAt: iso(5) },
}

export const roleOptions = ['全部方向', 'AI产品经理', '产品管培生', '教育产品经理', '数据产品经理', '电商产品经理']
export const cityOptions = ['全部城市', '上海', '北京', '深圳', '杭州', '广州']

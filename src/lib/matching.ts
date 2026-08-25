import type { Job, MatchResult, Profile } from '../types'

const roleAliases: Record<string, string[]> = {
  AI产品经理: ['AI', '智能体', '大模型', '人工智能'],
  产品管培生: ['管培', '培训生'],
  教育产品经理: ['教育', '学习', '课程'],
}

const overlap = (a: string[], b: string[]) => a.filter((item) => b.some((other) => other.toLowerCase() === item.toLowerCase()))

export function calculateMatch(job: Job, profile: Profile): MatchResult {
  const title = `${job.title}${job.roleCategory}`.toLowerCase()
  const roleHit = profile.rolePreferences.some((role) => job.roleCategory === role || roleAliases[role]?.some((alias) => title.includes(alias.toLowerCase())))
  const skillHits = overlap(job.skillTags, profile.skillTags)
  const industryHits = overlap(job.industryTags, profile.industryPreferences)
  const locationHit = profile.locationPreferences.includes(job.location)
  const campusHit = profile.jobTypePreferences.includes(job.jobType) && job.graduateYears.includes(profile.graduationYear)
  const targetHit = profile.targetCompanies.includes(job.companyName)
  const age = Math.max(0, Math.floor((Date.now() - new Date(job.publishedAt).getTime()) / 86_400_000))
  const freshness = age <= 3 ? 5 : age <= 7 ? 4 : age <= 14 ? 3 : age <= 30 ? 2 : age <= 60 ? 1 : 0
  const dimensions = {
    role: roleHit ? 30 : 0,
    skill: job.skillTags.length ? Math.min(20, Math.round((skillHits.length / job.skillTags.length) * 20)) : 10,
    industry: industryHits.length ? 15 : 0,
    location: locationHit ? 15 : 0,
    campus: campusHit ? 10 : 0,
    freshness,
    targetCompany: targetHit ? 5 : 0,
  }
  const score = Math.max(0, Math.min(100, Object.values(dimensions).reduce((sum, value) => sum + value, 0)))
  const candidates = [
    { value: dimensions.role, text: `岗位方向契合你的「${job.roleCategory}」目标` },
    { value: dimensions.skill, text: skillHits.length ? `技能覆盖 ${skillHits.slice(0, 2).join('、')}` : '' },
    { value: dimensions.industry, text: industryHits.length ? `行业偏好命中 ${industryHits.join('、')}` : '' },
    { value: dimensions.location, text: locationHit ? `${job.location}在你的意向城市内` : '' },
    { value: dimensions.campus, text: campusHit ? `符合 ${profile.graduationYear} 届校招条件` : '' },
  ].filter((item) => item.value > 0 && item.text).sort((a, b) => b.value - a.value)
  return { score, dimensions, reasons: candidates.slice(0, 3).map((item) => item.text), gaps: job.skillTags.filter((skill) => !profile.skillTags.some((own) => own.toLowerCase() === skill.toLowerCase())).slice(0, 2) }
}

export function isExcluded(job: Job, profile: Profile) {
  const haystack = `${job.title} ${job.description}`.toLowerCase()
  return profile.excludedKeywords.some((word) => word && haystack.includes(word.toLowerCase())) || job.status === 'closed'
}

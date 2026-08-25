export type Page = 'jobs' | 'saved' | 'pipeline' | 'preferences'
export type ApplicationStatus = 'wishlist' | 'applied' | 'assessment' | 'interview' | 'offer' | 'rejected'
export type JobStatus = 'active' | 'suspected_closed' | 'closed'

export interface Job {
  id: string
  companyName: string
  companyShort: string
  title: string
  roleCategory: string
  industryTags: string[]
  location: string
  jobType: '校招' | '实习'
  graduateYears: number[]
  description: string
  responsibilities: string[]
  requirements: string[]
  skillTags: string[]
  publishedAt: string
  deadlineAt?: string
  applyUrl: string
  status: JobStatus
  sourceName: string
  accent: string
}

export interface Profile {
  rolePreferences: string[]
  industryPreferences: string[]
  locationPreferences: string[]
  jobTypePreferences: string[]
  skillTags: string[]
  targetCompanies: string[]
  excludedKeywords: string[]
  graduationYear: number
}

export interface UserJobState {
  saved: boolean
  applicationStatus?: ApplicationStatus
  statusUpdatedAt?: string
  notes?: string
}

export interface MatchResult {
  score: number
  dimensions: Record<'role' | 'skill' | 'industry' | 'location' | 'campus' | 'freshness' | 'targetCompany', number>
  reasons: string[]
  gaps: string[]
}

export interface Filters {
  query: string
  role: string
  city: string
  minScore: number
  campusOnly: boolean
  sort: 'match' | 'latest' | 'deadline'
}

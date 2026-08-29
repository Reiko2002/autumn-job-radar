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
  jobType: '校招' | '实习' | '社招' | '类型未注明'
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
  firstSeenAt?: string
  lastSeenAt?: string
  sourceUrl?: string
}

export interface ApiJob {
  id: string
  externalId?: string
  company: string
  companyNormalized: string
  title: string
  titleNormalized: string
  roleCategory?: string
  industryTags: string[]
  cityTags: string[]
  locationText?: string
  jobType: 'campus' | 'intern' | 'experienced' | 'unknown'
  graduateYears: number[]
  description?: string
  responsibilities?: string
  requirements?: string
  skillTags: string[]
  publishedAt?: string
  deadlineAt?: string
  sourceKey: string
  sourceName: string
  sourceType: string
  sourceUrl: string
  applyUrl: string
  status: JobStatus
  firstSeenAt: string
  lastSeenAt: string
  missedSyncCount: number
  contentHash: string
}

export interface JobsPayload {
  schemaVersion: 1
  generatedAt: string
  stats: { total: number; active: number; suspectedClosed: number; closed: number; sourcesSucceeded: number; sourcesFailed: number }
  jobs: ApiJob[]
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

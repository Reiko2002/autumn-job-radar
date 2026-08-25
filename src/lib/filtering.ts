import type { Filters, Job, MatchResult, Profile } from '../types'
import { isExcluded } from './matching'

export function filterJobs(jobs: Job[], matches: Record<string, MatchResult>, profile: Profile, filters: Filters, savedIds?: Set<string>) {
  const query = filters.query.trim().toLowerCase()
  return jobs
    .filter((job) => !savedIds || savedIds.has(job.id))
    .filter((job) => !query || `${job.title} ${job.companyName} ${job.description} ${job.skillTags.join(' ')}`.toLowerCase().includes(query))
    .filter((job) => filters.role === '全部方向' || job.roleCategory === filters.role)
    .filter((job) => filters.city === '全部城市' || job.location === filters.city)
    .filter((job) => !filters.campusOnly || job.jobType === '校招')
    .filter((job) => matches[job.id].score >= filters.minScore)
    .filter((job) => !isExcluded(job, profile))
    .sort((a, b) => {
      if (filters.sort === 'latest') return +new Date(b.publishedAt) - +new Date(a.publishedAt)
      if (filters.sort === 'deadline') return +(a.deadlineAt ? new Date(a.deadlineAt) : new Date('2999-01-01')) - +(b.deadlineAt ? new Date(b.deadlineAt) : new Date('2999-01-01'))
      return matches[b.id].score - matches[a.id].score || +new Date(b.publishedAt) - +new Date(a.publishedAt)
    })
}

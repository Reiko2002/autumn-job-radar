import type { Job, JobsPayload } from '../types'
import { demoJobs } from '../data/demo'

export interface LoadedJobs { jobs: Job[]; generatedAt: string; fromCache: boolean; stats: JobsPayload['stats'] }
export interface JobRepository { getJobs(): Promise<LoadedJobs> }

const CACHE_KEY = 'autumn-job-radar:last-valid-jobs:v1'
const accents = ['#496ff5', '#7357d8', '#e87843', '#278e78', '#3979a9', '#4c8f58']

export function validateJobsPayload(value: unknown): JobsPayload {
  if (!value || typeof value !== 'object') throw new Error('岗位数据格式无效')
  const payload = value as Partial<JobsPayload>
  if (payload.schemaVersion !== 1 || !Array.isArray(payload.jobs) || !payload.stats || typeof payload.generatedAt !== 'string') throw new Error('岗位数据版本不受支持')
  for (const job of payload.jobs) {
    if (!job.id || !job.company || !job.title || !/^https?:\/\//.test(job.applyUrl) || !/^https?:\/\//.test(job.sourceUrl)) throw new Error('岗位数据存在缺失或非法链接')
  }
  return payload as JobsPayload
}

export function toUiJob(job: JobsPayload['jobs'][number], index: number): Job {
  return {
    id: job.id, companyName: job.company, companyShort: job.company.slice(0, 1), title: job.title,
    roleCategory: job.roleCategory ?? '其他岗位', industryTags: job.industryTags, location: job.cityTags[0] ?? job.locationText ?? '地点未注明',
    jobType: job.jobType === 'intern' ? '实习' : job.jobType === 'campus' ? '校招' : job.jobType === 'experienced' ? '社招' : '类型未注明', graduateYears: job.graduateYears, description: job.description ?? '请前往官方页面查看完整岗位说明。',
    responsibilities: (job.responsibilities ?? '').split('\n').filter(Boolean), requirements: (job.requirements ?? '').split('\n').filter(Boolean), skillTags: job.skillTags,
    publishedAt: job.publishedAt ?? job.firstSeenAt, deadlineAt: job.deadlineAt, applyUrl: job.applyUrl, status: job.status,
    sourceName: job.sourceName, accent: accents[index % accents.length], firstSeenAt: job.firstSeenAt, lastSeenAt: job.lastSeenAt, sourceUrl: job.sourceUrl,
  }
}

export class StaticJobRepository implements JobRepository {
  async getJobs(): Promise<LoadedJobs> {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/jobs.json?v=${new Date().toISOString().slice(0, 13)}`, { cache: 'no-store' })
      if (!response.ok) throw new Error(`岗位数据加载失败：${response.status}`)
      const payload = validateJobsPayload(await response.json())
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(payload)) } catch { /* Large real datasets may exceed browser quota; network data remains authoritative. */ }
      return { jobs: payload.jobs.map(toUiJob), generatedAt: payload.generatedAt, fromCache: false, stats: payload.stats }
    } catch (error) {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const payload = validateJobsPayload(JSON.parse(cached))
        return { jobs: payload.jobs.map(toUiJob), generatedAt: payload.generatedAt, fromCache: true, stats: payload.stats }
      }
      throw error
    }
  }
}

export class DemoJobRepository implements JobRepository {
  async getJobs(): Promise<LoadedJobs> {
    return { jobs: demoJobs, generatedAt: new Date().toISOString(), fromCache: false, stats: { total: demoJobs.length, active: demoJobs.filter((job) => job.status === 'active').length, suspectedClosed: demoJobs.filter((job) => job.status === 'suspected_closed').length, closed: demoJobs.filter((job) => job.status === 'closed').length, sourcesSucceeded: 0, sourcesFailed: 0 } }
  }
}

export const createJobRepository = (): JobRepository => import.meta.env.VITE_DEMO_MODE === 'true' ? new DemoJobRepository() : new StaticJobRepository()

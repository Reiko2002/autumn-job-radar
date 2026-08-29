import { useEffect, useMemo, useState } from 'react'
import { defaultProfile } from './data/demo'
import { filterJobs } from './lib/filtering'
import { calculateMatch } from './lib/matching'
import { storage } from './lib/storage'
import type { ApplicationStatus, Filters, Job, Page, Profile, UserJobState } from './types'
import { Shell } from './components/Shell'
import { JobsPage } from './components/JobsPage'
import { PipelinePage } from './components/PipelinePage'
import { PreferencesPage } from './components/PreferencesPage'
import { JobDetail } from './components/JobDetail'
import { createJobRepository, type LoadedJobs } from './services/jobRepository'

const initialFilters: Filters = { query: '', role: '全部方向', city: '全部城市', minScore: 0, campusOnly: false, sort: 'match' }

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [page, setPage] = useState<Page>('jobs')
  const [profile, setProfile] = useState<Profile>(() => storage.loadProfile())
  const [userJobs, setUserJobs] = useState<Record<string, UserJobState>>(() => storage.loadUserJobs())
  const [filters, setFilters] = useState(initialFilters)
  const [selected, setSelected] = useState<Job | undefined>()
  const applyLoadedJobs = (result: LoadedJobs) => { setJobs(result.jobs) }
  const loadJobs = () => { setLoading(true); setLoadError(''); createJobRepository().getJobs().then(applyLoadedJobs).catch((error: unknown) => setLoadError(error instanceof Error ? error.message : '岗位数据加载失败')).finally(() => setLoading(false)) }
  useEffect(() => {
    let active = true
    createJobRepository().getJobs().then((result) => { if (active) applyLoadedJobs(result) }).catch((error: unknown) => { if (active) setLoadError(error instanceof Error ? error.message : '岗位数据加载失败') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  const matches = useMemo(() => Object.fromEntries(jobs.map((job) => [job.id, calculateMatch(job, profile)])), [jobs, profile])
  const savedIds = useMemo(() => new Set(Object.entries(userJobs).filter(([, state]) => state.saved).map(([id]) => id)), [userJobs])
  const visibleJobs = useMemo(() => filterJobs(jobs, matches, profile, filters, page === 'saved' ? savedIds : undefined), [jobs, matches, profile, filters, page, savedIds])
  const navigate = (next: Page) => { setPage(next); setSelected(undefined); if (next !== 'saved') setFilters(initialFilters) }
  const updateUserJob = (id: string, patch: Partial<UserJobState>) => setUserJobs((current) => { const previous = current[id] ?? { saved: false }; const next = { ...current, [id]: { ...previous, ...patch } }; storage.saveUserJobs(next); return next })
  const onSave = (id: string) => updateUserJob(id, { saved: !userJobs[id]?.saved })
  const onStatus = (id: string, status: ApplicationStatus) => updateUserJob(id, { applicationStatus: status, statusUpdatedAt: new Date().toISOString() })
  const onRemove = (id: string) => setUserJobs((current) => { const next = { ...current }; if (current[id]?.saved) next[id] = { saved: true }; else delete next[id]; storage.saveUserJobs(next); return next })
  const saveProfile = (next: Profile) => { setProfile(next); storage.saveProfile(next) }
  const reset = () => { storage.reset(); setProfile(defaultProfile); setUserJobs({}) }
  return <Shell page={page} setPage={navigate} savedCount={savedIds.size}>
    {loading && <div className="data-state"><div className="loader" /><h2>正在加载真实岗位</h2><p>从最新同步数据中整理机会…</p></div>}
    {!loading && loadError && <div className="data-state error"><h2>暂时无法加载岗位</h2><p>{loadError}</p><button className="primary-button" onClick={loadJobs}>重新加载</button></div>}
    {!loading && !loadError && (page === 'jobs' || page === 'saved') && <JobsPage title={page === 'jobs' ? '找到真正适合你的机会' : '我的收藏'} subtitle={page === 'jobs' ? '聚合国内企业校招机会，每个推荐都有可解释理由。' : '把值得认真研究的岗位放在同一个地方。'} jobs={visibleJobs} allCount={filterJobs(jobs, matches, profile, initialFilters).length} matches={matches} filters={filters} setFilters={setFilters} userJobs={userJobs} selected={selected} setSelected={setSelected} onSave={onSave} onStatus={onStatus} onRemove={onRemove} onPreferences={() => navigate('preferences')} savedView={page === 'saved'} />}
    {!loading && !loadError && page === 'pipeline' && <><PipelinePage jobs={jobs} matches={matches} userJobs={userJobs} onStatus={onStatus} onRemove={onRemove} onSelect={setSelected} />{selected && <div className="detail-overlay"><JobDetail job={selected} match={matches[selected.id]} state={userJobs[selected.id]} onSave={() => onSave(selected.id)} onStatus={(status) => onStatus(selected.id, status)} onRemove={() => onRemove(selected.id)} onClose={() => setSelected(undefined)} /></div>}</>}
    {page === 'preferences' && <PreferencesPage profile={profile} onSave={saveProfile} onReset={reset} />}
  </Shell>
}

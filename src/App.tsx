import { useMemo, useState } from 'react'
import { demoJobs, defaultProfile, defaultUserJobs } from './data/demo'
import { filterJobs } from './lib/filtering'
import { calculateMatch } from './lib/matching'
import { storage } from './lib/storage'
import type { ApplicationStatus, Filters, Job, Page, Profile, UserJobState } from './types'
import { Shell } from './components/Shell'
import { JobsPage } from './components/JobsPage'
import { PipelinePage } from './components/PipelinePage'
import { PreferencesPage } from './components/PreferencesPage'
import { JobDetail } from './components/JobDetail'

const initialFilters: Filters = { query: '', role: '全部方向', city: '全部城市', minScore: 0, campusOnly: true, sort: 'match' }

export default function App() {
  const [page, setPage] = useState<Page>('jobs')
  const [profile, setProfile] = useState<Profile>(() => storage.loadProfile())
  const [userJobs, setUserJobs] = useState<Record<string, UserJobState>>(() => storage.loadUserJobs())
  const [filters, setFilters] = useState(initialFilters)
  const [selected, setSelected] = useState<Job | undefined>()
  const matches = useMemo(() => Object.fromEntries(demoJobs.map((job) => [job.id, calculateMatch(job, profile)])), [profile])
  const savedIds = useMemo(() => new Set(Object.entries(userJobs).filter(([, state]) => state.saved).map(([id]) => id)), [userJobs])
  const visibleJobs = useMemo(() => filterJobs(demoJobs, matches, profile, filters, page === 'saved' ? savedIds : undefined), [matches, profile, filters, page, savedIds])
  const navigate = (next: Page) => { setPage(next); setSelected(undefined); if (next !== 'saved') setFilters(initialFilters) }
  const updateUserJob = (id: string, patch: Partial<UserJobState>) => setUserJobs((current) => { const previous = current[id] ?? { saved: false }; const next = { ...current, [id]: { ...previous, ...patch } }; storage.saveUserJobs(next); return next })
  const onSave = (id: string) => updateUserJob(id, { saved: !userJobs[id]?.saved })
  const onStatus = (id: string, status: ApplicationStatus) => updateUserJob(id, { applicationStatus: status, statusUpdatedAt: new Date().toISOString() })
  const saveProfile = (next: Profile) => { setProfile(next); storage.saveProfile(next) }
  const reset = () => { storage.reset(); setProfile(defaultProfile); setUserJobs(defaultUserJobs) }
  return <Shell page={page} setPage={navigate} savedCount={savedIds.size}>
    {(page === 'jobs' || page === 'saved') && <JobsPage title={page === 'jobs' ? '找到真正适合你的机会' : '我的收藏'} subtitle={page === 'jobs' ? '基于你的方向与经历，每个推荐都有理由。' : '把值得认真研究的岗位放在同一个地方。'} jobs={visibleJobs} allCount={filterJobs(demoJobs, matches, profile, initialFilters).length} matches={matches} filters={filters} setFilters={setFilters} userJobs={userJobs} selected={selected} setSelected={setSelected} onSave={onSave} onStatus={onStatus} onPreferences={() => navigate('preferences')} savedView={page === 'saved'} />}
    {page === 'pipeline' && <><PipelinePage jobs={demoJobs} matches={matches} userJobs={userJobs} onStatus={onStatus} onSelect={setSelected} />{selected && <div className="detail-overlay"><JobDetail job={selected} match={matches[selected.id]} state={userJobs[selected.id]} onSave={() => onSave(selected.id)} onStatus={(status) => onStatus(selected.id, status)} onClose={() => setSelected(undefined)} /></div>}</>}
    {page === 'preferences' && <PreferencesPage profile={profile} onSave={saveProfile} onReset={reset} />}
  </Shell>
}

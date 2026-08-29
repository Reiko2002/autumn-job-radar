import type { Filters, Job, MatchResult, UserJobState } from '../types'
import { cityOptions, roleOptions } from '../data/demo'
import { JobCard } from './JobCard'
import { JobDetail } from './JobDetail'
import { Search, Settings2, Sparkles } from './Icons'
import type { ApplicationStatus } from '../types'

const today = new Date().toISOString().slice(0, 10)

export function JobsPage({ title, subtitle, jobs, allCount, matches, filters, setFilters, userJobs, selected, setSelected, onSave, onStatus, onRemove, onPreferences, savedView = false }: { title: string; subtitle: string; jobs: Job[]; allCount: number; matches: Record<string, MatchResult>; filters: Filters; setFilters: (filters: Filters) => void; userJobs: Record<string, UserJobState>; selected?: Job; setSelected: (job?: Job) => void; onSave: (id: string) => void; onStatus: (id: string, status: ApplicationStatus) => void; onRemove: (id: string) => void; onPreferences: () => void; savedView?: boolean }) {
  const clear = () => setFilters({ query: '', role: '全部方向', city: '全部城市', minScore: 0, campusOnly: false, sort: 'match' })
  return <div className={`jobs-layout ${selected ? 'with-detail' : ''}`}>
    <div className="jobs-content">
      <header className="page-header"><div><div className="eyebrow"><span /> PERSONAL JOB FEED</div><h1>{title}</h1><p>{subtitle}</p></div><button className="outline-button" onClick={onPreferences}><Settings2 size={17} />调整求职意向</button></header>
      {!savedView && <section className="stats-row"><div><small>为你推荐</small><strong>{allCount}</strong><span>个匹配岗位</span></div><div><small>今日上新</small><strong>{jobs.filter((job) => job.publishedAt.slice(0, 10) === today).length}</strong><span>保持新鲜</span></div><div><small>高匹配</small><strong>{jobs.filter((job) => matches[job.id].score >= 80).length}</strong><span>匹配度 ≥ 80</span></div><div className="insight"><Sparkles size={18} /><p><strong>今日建议</strong>优先看即将截止的高匹配岗位</p></div></section>}
      <section className="filters"><label className="search-field"><Search size={18} /><input aria-label="搜索岗位" placeholder="搜索岗位、公司或技能..." value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} /></label><select aria-label="岗位方向" value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })}>{roleOptions.map((role) => <option key={role}>{role}</option>)}</select><select aria-label="城市" value={filters.city} onChange={(event) => setFilters({ ...filters, city: event.target.value })}>{cityOptions.map((city) => <option key={city}>{city}</option>)}</select><select aria-label="排序方式" value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value as Filters['sort'] })}><option value="match">综合匹配</option><option value="latest">最新发布</option><option value="deadline">即将截止</option></select></section>
      <div className="quick-filters"><button className={filters.campusOnly ? 'active' : ''} onClick={() => setFilters({ ...filters, campusOnly: !filters.campusOnly })}>仅看校招</button>{[70, 80].map((score) => <button key={score} className={filters.minScore === score ? 'active' : ''} onClick={() => setFilters({ ...filters, minScore: filters.minScore === score ? 0 : score })}>匹配度 ≥ {score}</button>)}{(filters.query || filters.role !== '全部方向' || filters.city !== '全部城市' || filters.minScore || filters.campusOnly) && <button className="clear-filter" onClick={clear}>清除筛选</button>}<span>共 {jobs.length} 个结果</span></div>
      <div className="job-list">{jobs.map((job) => <JobCard key={job.id} job={job} match={matches[job.id]} state={userJobs[job.id]} selected={selected?.id === job.id} onSelect={() => setSelected(job)} onSave={() => onSave(job.id)} onPipeline={() => onStatus(job.id, userJobs[job.id]?.applicationStatus ?? 'wishlist')} onRemove={() => onRemove(job.id)} />)}{jobs.length === 0 && <div className="empty-state"><div>⌁</div><h2>{savedView ? '还没有收藏岗位' : '没有找到匹配岗位'}</h2><p>{savedView ? '在岗位广场遇到心仪机会时，点一下收藏即可。' : '尝试减少筛选条件，或换一个关键词。'}</p><button className="primary-button" onClick={clear}>{savedView ? '查看岗位广场' : '清除全部筛选'}</button></div>}</div>
    </div>
    {selected && <JobDetail job={selected} match={matches[selected.id]} state={userJobs[selected.id]} onSave={() => onSave(selected.id)} onStatus={(status) => onStatus(selected.id, status)} onRemove={() => onRemove(selected.id)} onClose={() => setSelected()} />}
  </div>
}

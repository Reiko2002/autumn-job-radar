import type { Job, MatchResult, UserJobState } from '../types'
import { Bookmark, BriefcaseBusiness, ChevronRight } from './Icons'

const renderDate = new Date()
const renderMidnight = new Date(renderDate).setHours(0, 0, 0, 0)
const relativeDate = (date: string) => {
  const days = Math.max(0, Math.floor((renderMidnight - new Date(date).setHours(0, 0, 0, 0)) / 86_400_000))
  return days === 0 ? '今天发布' : `${days} 天前发布`
}

export function JobCard({ job, match, state, selected, onSelect, onSave, onPipeline }: { job: Job; match: MatchResult; state?: UserJobState; selected: boolean; onSelect: () => void; onSave: () => void; onPipeline: () => void }) {
  const deadlineDays = job.deadlineAt ? Math.max(0, Math.ceil((+new Date(job.deadlineAt) - +renderDate) / 86_400_000)) : undefined
  return <article className={`job-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
    <div className="job-card-head">
      <div className="company-logo" style={{ background: job.accent }}>{job.companyShort}</div>
      <div className="job-title"><h3>{job.title}</h3><p>{job.companyName}<span>·</span>{job.location}<span>·</span>{job.jobType}</p></div>
      <div className={`score ${match.score >= 80 ? 'high' : match.score >= 65 ? 'medium' : ''}`}><strong>{match.score}</strong><small>匹配度</small></div>
    </div>
    <div className="tags">{job.skillTags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
    <p className="job-summary">{job.description}</p>
    <div className="match-note"><span>✦</span>{match.reasons[0] ?? '可作为拓展机会进一步了解'}</div>
    <footer>
      <div className="job-meta"><span>{relativeDate(job.publishedAt)}</span>{deadlineDays !== undefined && <span className="deadline">{deadlineDays} 天后截止</span>}<span>{job.sourceName}</span></div>
      <div className="card-actions">
        <button className={state?.saved ? 'saved' : ''} aria-label={state?.saved ? '取消收藏' : '收藏岗位'} onClick={(event) => { event.stopPropagation(); onSave() }}><Bookmark size={17} fill={state?.saved ? 'currentColor' : 'none'} /></button>
        <button className="text-button" onClick={(event) => { event.stopPropagation(); onPipeline() }}><BriefcaseBusiness size={16} />{state?.applicationStatus ? '更新进度' : '加入投递'}</button>
        <button className="round-arrow" aria-label="查看岗位详情"><ChevronRight size={18} /></button>
      </div>
    </footer>
  </article>
}

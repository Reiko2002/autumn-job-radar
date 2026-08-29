import type { ApplicationStatus, Job, MatchResult, UserJobState } from '../types'
import { Bookmark, BriefcaseBusiness, Sparkles, X } from './Icons'

const statusLabels: Record<ApplicationStatus, string> = { wishlist: '待投递', applied: '已投递', assessment: '笔试/测评', interview: '面试中', offer: 'Offer', rejected: '未通过' }

export function JobDetail({ job, match, state, onSave, onStatus, onRemove, onClose }: { job: Job; match: MatchResult; state?: UserJobState; onSave: () => void; onStatus: (status: ApplicationStatus) => void; onRemove: () => void; onClose: () => void }) {
  return <aside className="detail-panel" aria-label="岗位详情">
    <button className="detail-close" onClick={onClose} aria-label="关闭详情"><X size={18} /></button>
    <div className="detail-company"><div className="company-logo large" style={{ background: job.accent }}>{job.companyShort}</div><div><span>{job.companyName}</span><small>企业官方招聘页面 · 已验证</small></div></div>
    <h2>{job.title}</h2><p className="detail-meta">{job.location} · {job.jobType} · {job.graduateYears.join('/')} 届</p>
    <div className="detail-actions">
      <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="primary-button">前往官方投递页</a>
      <button className={state?.saved ? 'icon-button saved' : 'icon-button'} onClick={onSave} aria-label={state?.saved ? '取消收藏' : '收藏'}><Bookmark size={19} fill={state?.saved ? 'currentColor' : 'none'} /></button>
    </div>
    <div className="demo-notice real">岗位信息来自公开招聘页面，可能随时变化，请以来源页面为准。</div>
    <section className="match-box"><header><span><Sparkles size={17} /> 匹配分析</span><strong>{match.score}<small>/ 100</small></strong></header><div className="score-bar"><i style={{ width: `${match.score}%` }} /></div><h4>为什么推荐你</h4><ul>{match.reasons.map((reason) => <li key={reason}><b>✓</b>{reason}</li>)}</ul>{match.gaps.length > 0 && <><h4>值得补充</h4><div className="gap-tags">{match.gaps.map((gap) => <span key={gap}>+ {gap}</span>)}</div></>}</section>
    {job.description && <section className="detail-section"><h3>岗位介绍</h3><p>{job.description}</p></section>}
    {job.responsibilities.length > 0 && <section className="detail-section"><h3>你将负责</h3><ul>{job.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></section>}
    {job.requirements.length > 0 && <section className="detail-section"><h3>我们期待</h3><ul>{job.requirements.map((item) => <li key={item}>{item}</li>)}</ul></section>}
    <section className="status-section"><label htmlFor="detail-status"><BriefcaseBusiness size={16} />投递状态</label><select id="detail-status" value={state?.applicationStatus ?? ''} onChange={(event) => event.target.value ? onStatus(event.target.value as ApplicationStatus) : onRemove()}><option value="">{state?.applicationStatus ? '移出投递看板' : '选择状态'}</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></section>
  </aside>
}

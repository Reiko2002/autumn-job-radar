import { useState } from 'react'
import type { Profile } from '../types'

const options = {
  rolePreferences: ['AI产品经理', '产品管培生', '教育产品经理', '数据产品经理', '电商产品经理'],
  industryPreferences: ['人工智能', '教育科技', '电商', '企业服务', '本地生活'],
  locationPreferences: ['上海', '北京', '深圳', '杭州', '广州'],
  skillTags: ['Agent', 'RAG', '数据分析', '用户研究', '产品设计', 'SQL', '项目管理', 'B端产品'],
}

export function PreferencesPage({ profile, onSave, onReset }: { profile: Profile; onSave: (profile: Profile) => void; onReset: () => void }) {
  const [draft, setDraft] = useState(profile)
  const [saved, setSaved] = useState(false)
  const toggle = (field: keyof typeof options, value: string) => setDraft({ ...draft, [field]: draft[field].includes(value) ? draft[field].filter((item) => item !== value) : [...draft[field], value] })
  const submit = () => { onSave(draft); setSaved(true); window.setTimeout(() => setSaved(false), 1800) }
  return <div className="standard-page preferences-page"><header className="page-header"><div><div className="eyebrow"><span /> YOUR DIRECTION</div><h1>求职意向</h1><p>这些偏好会直接影响匹配分和岗位排序，随时都可以调整。</p></div></header><div className="preferences-grid"><form onSubmit={(event) => { event.preventDefault(); submit() }}><PreferenceGroup title="岗位方向" description="建议选择 1–3 个最想投入的方向" required options={options.rolePreferences} selected={draft.rolePreferences} onToggle={(value) => toggle('rolePreferences', value)} /><PreferenceGroup title="行业偏好" description="用于识别你更熟悉或更感兴趣的业务" options={options.industryPreferences} selected={draft.industryPreferences} onToggle={(value) => toggle('industryPreferences', value)} /><PreferenceGroup title="意向城市" description="城市匹配在总分中占 15 分" options={options.locationPreferences} selected={draft.locationPreferences} onToggle={(value) => toggle('locationPreferences', value)} /><PreferenceGroup title="我的技能" description="诚实选择你能在面试中展开说明的能力" options={options.skillTags} selected={draft.skillTags} onToggle={(value) => toggle('skillTags', value)} /><div className="form-row"><label>毕业年份<select value={draft.graduationYear} onChange={(event) => setDraft({ ...draft, graduationYear: Number(event.target.value) })}><option>2026</option><option>2027</option><option>2028</option></select></label><label>求职类型<select value={draft.jobTypePreferences[0]} onChange={(event) => setDraft({ ...draft, jobTypePreferences: [event.target.value] })}><option>校招</option><option>实习</option></select></label></div><div className="preference-actions"><button type="button" className="outline-button" onClick={onReset}>恢复默认</button><button type="submit" className="primary-button">保存并重新匹配</button>{saved && <span className="saved-toast">✓ 已保存</span>}</div></form><aside className="preference-preview"><span>匹配画像</span><h2>{draft.rolePreferences[0] ?? '等待选择方向'}</h2><p>{draft.graduationYear} 届 · {draft.locationPreferences.slice(0, 3).join(' / ') || '城市不限'}</p><div>{draft.skillTags.slice(0, 5).map((skill) => <span key={skill}>{skill}</span>)}</div><hr /><small>匹配规则完全在本地运行</small><p className="privacy-copy">你的偏好不会上传到服务器，也不会用于广告画像。</p></aside></div></div>
}

function PreferenceGroup({ title, description, required, options, selected, onToggle }: { title: string; description: string; required?: boolean; options: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return <fieldset><legend>{title}{required && <em>必选</em>}</legend><p>{description}</p><div className="choice-grid">{options.map((option) => <button type="button" key={option} className={selected.includes(option) ? 'selected' : ''} onClick={() => onToggle(option)}><i>{selected.includes(option) ? '✓' : '+'}</i>{option}</button>)}</div></fieldset>
}

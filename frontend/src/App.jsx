import { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { LayoutDashboard, ClipboardCheck, AlertTriangle, ListChecks, TrendingUp, Info, Menu, Loader2, MessageCircle, Send } from 'lucide-react'
import { getQuestions, getRecommendation, analyze, chat as chatApi } from './services/api'

const TOPICS = ['Arrays','Strings','Linked Lists','Stacks and Queues','Recursion','Binary Search','Trees','Graphs','Sorting','Dynamic Programming']
const NAV = [['dash','Dashboard',LayoutDashboard],['quiz','Diagnostic Assessment',ClipboardCheck],['weak','My Weaknesses',AlertTriangle],
  ['practice','Practice Recommendations',ListChecks],['chat','Ask DSA Doubts',MessageCircle],['progress','Progress Analytics',TrendingUp],['about','About',Info]]
const DISCLAIMER = 'Your results reflect your performance on the diagnostic questions and should be used as a guide for further practice.'
const cls = c => c === 'Strong' ? 'Strong' : c === 'Developing' ? 'Developing' : c === 'Needs Improvement' ? 'Needs' : 'NotA'
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
const catOf = a => a == null ? 'Not Assessed' : a >= 80 ? 'Strong' : a >= 60 ? 'Developing' : 'Needs Improvement'

// SAMPLE data for judges (clearly labelled in the UI). Strong in Arrays, weak in Recursion and DP.
const DEMO_SCORES = [[3,3],[2,3],[2,3],[3,3],[1,3],[2,3],[2,3],[2,3],[3,3],[0,3]]
const DEMO = (() => {
  const topics = TOPICS.map((t, i) => { const [c, a] = DEMO_SCORES[i]; const acc = Math.round(c / a * 1000) / 10
    return { topic: t, accuracy: acc, correct: c, attempted: a, category: catOf(acc) } })
  const tot = topics.reduce((s, t) => s + t.correct, 0)
  return { topics, attempted: 30, correct: tot, overall_accuracy: Math.round(tot / 30 * 1000) / 10, strongest: 'Arrays',
    weakest: 'Dynamic Programming', weak_topics: ['Dynamic Programming', 'Recursion'], review: [], demo: true,
    explanations: { 'Dynamic Programming': 'Sample: 0 of 3 questions correct.', Recursion: 'Sample: 1 of 3 questions correct.' } }
})()

function Bars({ topics }) {
  const data = topics.filter(t => t.accuracy != null).map(t => ({ name: t.topic.replace('Dynamic Programming', 'DP').replace('Stacks and Queues', 'Stacks/Queues'), acc: t.accuracy }))
  return <div style={{ width: '100%', height: 280 }}><ResponsiveContainer><BarChart data={data}><XAxis dataKey="name" stroke="#9aa6c7" fontSize={11} interval={0} angle={-30} textAnchor="end" height={70} />
    <YAxis domain={[0, 100]} stroke="#9aa6c7" fontSize={11} /><Tooltip contentStyle={{ background: '#131a30', border: '1px solid #243052' }} /><Bar dataKey="acc" name="Accuracy %" fill="#6d8bff" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
}
const Empty = ({ go, text }) => <div className="card"><h2>Nothing here yet</h2><p className="mu">{text}</p><div className="row"><button className="btn" onClick={() => go('quiz')}>Start Diagnostic Assessment</button></div></div>

function sequence(result, recs) {
  const weak = result.weak_topics
  const score = t => weak.filter(w => w !== t && (recs[t]?.prerequisites || []).some(p => p.toLowerCase().includes(w.toLowerCase()))).length
  return [...weak].sort((a, b) => score(a) - score(b) || result.topics.find(t => t.topic === a).accuracy - result.topics.find(t => t.topic === b).accuracy)
}

function Rec({ topic, rec }) {
  if (!rec) return <p className="mu">Recommendations unavailable (is the backend running?).</p>
  return <div><p>{rec.concept}</p><p><b>Prerequisites:</b> {rec.prerequisites.join(', ')}</p><p><b>Objective:</b> {rec.objective}</p>
    <p><b>Practice (easy → hard):</b></p><ol>{rec.problems.map(p => <li key={p.title}>{p.title} <span className="badge">{p.difficulty}</span> <span className="mu">— {p.why}</span></li>)}</ol>
    <p><b>Next action:</b> {rec.next_action}</p></div>
}

function Dashboard({ result, history, go, setDemo }) {
  const done = Object.keys(load('gf_done', {})).length
  const assessed = result?.topics.filter(t => t.accuracy != null) || []
  return <>
    <h1>Welcome back, Developer!</h1><p className="mu">Discover your strengths and improve your weakest DSA concepts.</p>
    <div className="row" style={{ margin: '14px 0' }}><button className="btn" onClick={() => go('quiz')}>Start Diagnostic Assessment</button>
      <button className="btn alt" onClick={() => { setDemo(); go('dash') }}>Explore Demo Results</button></div>
    {!result ? <Empty go={go} text="Take the 30-question diagnostic to see your topic-wise proficiency, weaknesses and a personalised practice plan. Or explore sample data." /> : <>
      {result.demo && <p><span className="sample">SAMPLE DATA — not a real student</span></p>}
      <div className="grid" style={{ marginBottom: 16 }}>
        <div className="card"><div className="mu">Overall proficiency</div><div className="big">{result.overall_accuracy}%</div></div>
        <div className="card"><div className="mu">Concepts assessed</div><div className="big">{assessed.length}/10</div></div>
        <div className="card"><div className="mu">Need improvement</div><div className="big">{result.weak_topics.length}</div></div>
        <div className="card"><div className="mu">Questions completed</div><div className="big">{result.attempted}</div></div></div>
      <div className="card"><h2>Topic-wise proficiency</h2><Bars topics={result.topics} /></div>
      <div className="grid"><div className="card"><div className="mu">Strongest</div><div className="big Strong">{result.strongest}</div></div>
        <div className="card"><div className="mu">Weakest</div><div className="big Needs">{result.weakest}</div></div>
        <div className="card"><div className="mu">Recommended next action</div><p>Practice <b>{result.weakest}</b> — open Practice Recommendations. ({done} problems marked completed)</p></div></div>
      <div className="card" style={{ marginTop: 16 }}><h2>Recent assessments</h2>
        {history.length ? history.slice(-5).reverse().map((h, i) => <div key={i} className="row"><span className="mu">{new Date(h.date).toLocaleString()}</span><b>{h.overall}%</b><span className="mu">({h.attempted} questions)</span></div>)
          : <p className="mu">No saved assessments yet{result.demo ? ' (demo results are not saved)' : ''}.</p>}</div>
      <p className="mu">{DISCLAIMER}</p></>}
  </>
}

function Quiz({ onDone, go }) {
  const [qs, setQs] = useState(null), [err, setErr] = useState(''), [ans, setAns] = useState({}), [i, setI] = useState(0)
  const [confirm, setConfirm] = useState(false), [busy, setBusy] = useState(false), [res, setRes] = useState(null)
  useEffect(() => { getQuestions().then(setQs).catch(e => setErr(e.message)) }, [])
  if (err) return <div className="card err"><h2>Couldn't load questions</h2><p>{err}</p><button className="btn" onClick={() => location.reload()}>Retry</button></div>
  if (!qs) return <p><Loader2 className="spin" size={16} /> Loading questions…</p>
  if (res) return <>
    <h1>Assessment results</h1><div className="card"><div className="big">{res.correct}/{res.attempted} correct ({res.overall_accuracy}%)</div>
      <p>Strongest: <b>{res.strongest}</b> · Weakest: <b>{res.weakest}</b></p><p className="mu">Rule-based analysis (no AI model). {DISCLAIMER}</p>
      <div className="row"><button className="btn" onClick={() => go('weak')}>View weaknesses</button><button className="btn alt" onClick={() => go('practice')}>Practice plan</button></div></div>
    <h2>Review & explanations</h2>{res.review.map(r => <div className="card" key={r.id}><span className="badge">{r.topic}</span><p><b>{r.question}</b></p>
      {r.options.map((o, k) => <div key={k} className={'opt ' + (k === r.correct_answer ? 'good' : k === r.selected ? 'wrong' : '')}>{o}{k === r.correct_answer ? ' ✓' : k === r.selected ? ' (your answer)' : ''}</div>)}
      <p className="mu">{r.explanation}</p></div>)}</>
  const q = qs[i], n = Object.keys(ans).length, un = qs.length - n
  const submit = async () => { setBusy(true); setErr('')
    try { const r = await analyze(ans); setRes(r); onDone(r) } catch (e) { setErr(e.message) } setBusy(false); setConfirm(false) }
  return <>
    <h1>Diagnostic Assessment</h1><p className="mu">Answers are revealed only after you submit.</p>
    <div className="bar" aria-label="progress"><div style={{ width: `${n / qs.length * 100}%` }} /></div><p className="mu">Question {i + 1} of {qs.length} · {n} answered</p>
    <div className="card"><div className="row"><span className="badge">{q.topic}</span><span className="badge">{q.difficulty}</span></div>
      <h2 style={{ marginTop: 12 }}>{q.question}</h2>
      {q.options.map((o, k) => <button key={k} className={'opt' + (ans[q.id] === k ? ' sel' : '')} aria-pressed={ans[q.id] === k} onClick={() => setAns({ ...ans, [q.id]: k })}>{String.fromCharCode(65 + k)}. {o}</button>)}
      <div className="row" style={{ marginTop: 10 }}><button className="btn alt" disabled={i === 0} onClick={() => setI(i - 1)}>Previous</button>
        <button className="btn alt" disabled={i === qs.length - 1} onClick={() => setI(i + 1)}>Next</button>
        <button className="btn" disabled={busy || n === 0} onClick={() => un ? setConfirm(true) : submit()}>{busy ? 'Submitting…' : 'Submit Assessment'}</button></div></div>
    {err && <div className="card err">{err}</div>}
    {confirm && <div className="card warn"><b>{un} question(s) are unanswered.</b> Unanswered questions are excluded from scoring, so some topics may show as Not Assessed.
      <div className="row" style={{ marginTop: 10 }}><button className="btn alt" onClick={() => setConfirm(false)}>Keep answering</button><button className="btn" onClick={submit}>Submit anyway</button></div></div>}
    <div className="row" aria-label="Question navigation">{qs.map((x, k) => <button key={x.id} className={'qn' + (ans[x.id] != null ? ' done' : '') + (k === i ? ' cur' : '')} aria-label={`Go to question ${k + 1}`} onClick={() => setI(k)}>{k + 1}</button>)}</div>
  </>
}

function Weak({ result, recs, go }) {
  const [sort, setSort] = useState('low'), [filter, setFilter] = useState('All'), [open, setOpen] = useState(null)
  if (!result) return <><h1>My Weaknesses</h1><Empty go={go} text="Complete the diagnostic to see which topics need work." /></>
  let list = result.topics.filter(t => filter === 'All' || t.category === filter)
  list = [...list].sort((a, b) => sort === 'name' ? a.topic.localeCompare(b.topic) : sort === 'low' ? (a.accuracy ?? 999) - (b.accuracy ?? 999) : (b.accuracy ?? -1) - (a.accuracy ?? -1))
  const sel = open && result.topics.find(t => t.topic === open)
  return <>
    <h1>My Weaknesses</h1>{result.demo && <p><span className="sample">SAMPLE DATA</span></p>}
    <div className="row" style={{ marginBottom: 14 }}>
      <label>Sort <select value={sort} onChange={e => setSort(e.target.value)}><option value="low">Lowest score</option><option value="high">Highest score</option><option value="name">Topic name</option></select></label>
      <label>Filter <select value={filter} onChange={e => setFilter(e.target.value)}>{['All', 'Strong', 'Developing', 'Needs Improvement', 'Not Assessed'].map(f => <option key={f}>{f}</option>)}</select></label></div>
    {!list.length && <p className="mu">No topics match this filter.</p>}
    {list.map(t => <button key={t.topic} className="card opt" style={{ display: 'block' }} onClick={() => setOpen(t.topic)}>
      <div className="row"><b>{t.topic}</b><span className={'badge ' + cls(t.category)}>{t.category}</span><span style={{ marginLeft: 'auto' }}>{t.accuracy == null ? '—' : t.accuracy + '%'}</span></div>
      <div className="mu">{t.correct}/{t.attempted} correct · Next: {t.category === 'Strong' ? 'keep practising advanced problems' : t.category === 'Not Assessed' ? 'take the assessment' : recs[t.topic]?.next_action}</div></button>)}
    {sel && <div className="card"><h2>{sel.topic} — detailed analysis</h2>
      <p>{sel.attempted ? `${sel.correct} of ${sel.attempted} correct (${sel.accuracy}%) — ${sel.category}.` : 'Not assessed yet.'}</p><Rec topic={sel.topic} rec={recs[sel.topic]} />
      <button className="btn alt" onClick={() => setOpen(null)}>Close</button></div>}
    <p className="mu">Scores indicate performance on this assessment, not absolute proof of mastery. {DISCLAIMER}</p></>
}

function Practice({ result, recs, go }) {
  const [done, setDone] = useState(load('gf_done', {}))
  if (!result) return <><h1>Practice Recommendations</h1><Empty go={go} text="Practice cards are built from your assessment results." /></>
  const toggle = k => { const d = { ...done }; d[k] ? delete d[k] : d[k] = true; setDone(d); save('gf_done', d) }
  const topics = result.topics.filter(t => t.accuracy != null && t.category !== 'Strong').sort((a, b) => a.accuracy - b.accuracy)
  const seq = sequence(result, recs)
  return <>
    <h1>Practice Recommendations</h1>{result.demo && <p><span className="sample">SAMPLE DATA</span></p>}
    {seq.length > 0 && <div className="card"><h2>Suggested learning sequence</h2><p>{seq.map((t, i) => `${i + 1}. ${t}`).join('  →  ')}</p><p className="mu">Topics that other weak topics depend on come first.</p></div>}
    {!topics.length && <p className="mu">All assessed topics are Strong — great work. Retake the assessment later to track progress.</p>}
    {topics.map(t => <div key={t.topic}><h2>{t.topic} <span className={'badge ' + cls(t.category)}>{t.category} · {t.accuracy}%</span></h2>
      <div className="grid">{(recs[t.topic]?.problems || []).map(p => { const k = t.topic + '|' + p.title; return <div className="card" key={k}>
        <b>{p.title}</b><div className="row"><span className="badge">{t.topic}</span><span className="badge">{p.difficulty}</span></div>
        <p className="mu"><b>Objective:</b> {recs[t.topic].objective}</p><p className="mu"><b>Why:</b> {p.why}; your {t.topic} score was {t.accuracy}%.</p>
        <button className={'btn' + (done[k] ? ' alt' : '')} onClick={() => toggle(k)}>{done[k] ? '✓ Completed (undo)' : 'Mark as Completed'}</button></div> })}</div></div>)}
    <p className="mu">“Completed” is self-reported; the app does not verify solutions.</p></>
}

function Progress({ history, go }) {
  const done = Object.keys(load('gf_done', {})).length
  const hist = history
  const cur = hist[hist.length - 1], prev = hist[hist.length - 2]
  const diff = useMemo(() => cur && prev ? cur.topics.filter(t => t.accuracy != null).map(t => { const p = prev.topics.find(x => x.topic === t.topic); return p?.accuracy != null ? { topic: t.topic, delta: Math.round((t.accuracy - p.accuracy) * 10) / 10 } : null }).filter(Boolean) : [], [cur, prev])
  return <>
    <h1>Progress Analytics</h1>
    <div className="grid" style={{ marginBottom: 16 }}><div className="card"><div className="mu">Latest accuracy</div><div className="big">{cur ? cur.overall + '%' : '—'}</div></div>
      <div className="card"><div className="mu">Assessments saved</div><div className="big">{hist.length}</div></div><div className="card"><div className="mu">Practice completed</div><div className="big">{done}</div></div></div>
    {!cur && <Empty go={go} text="Take your first assessment to start tracking progress." />}
    {cur && <div className="card"><h2>Latest topic-wise performance</h2><Bars topics={cur.topics} /></div>}
    {cur && hist.length < 2 && <div className="card warn">A trend needs at least two assessments. Practise your weak topics, then retake the diagnostic to see what improved.</div>}
    {hist.length >= 2 && <>
      <div className="card"><h2>Overall accuracy over time</h2><div style={{ height: 220 }}><ResponsiveContainer><LineChart data={hist.map((h, i) => ({ n: 'Attempt ' + (i + 1), acc: h.overall }))}><CartesianGrid stroke="#243052" /><XAxis dataKey="n" stroke="#9aa6c7" fontSize={11} /><YAxis domain={[0, 100]} stroke="#9aa6c7" fontSize={11} /><Tooltip contentStyle={{ background: '#131a30', border: '1px solid #243052' }} /><Line dataKey="acc" stroke="#8b6dff" strokeWidth={2} /></LineChart></ResponsiveContainer></div></div>
      <div className="card"><h2>Previous vs current</h2>{diff.map(d => <div className="row" key={d.topic}><span style={{ minWidth: 170 }}>{d.topic}</span><b className={d.delta > 0 ? 'Strong' : d.delta < 0 ? 'Needs' : 'mu'}>{d.delta > 0 ? '+' : ''}{d.delta} pts</b></div>)}
        <p><b>Improved:</b> {diff.filter(d => d.delta > 0).map(d => d.topic).join(', ') || 'none yet'}</p>
        <p><b>Still need attention:</b> {cur.topics.filter(t => t.category === 'Needs Improvement').map(t => t.topic).join(', ') || 'none'}</p></div></>}
  </>
}

function Msg({ text }) {
  return <>{text.split(/```(?:\w*)\n?/).map((part, i) => i % 2 ? <pre key={i} className="code">{part}</pre> : <p key={i} style={{ whiteSpace: 'pre-wrap', margin: '4px 0' }}>{part}</p>)}</>
}

function Chat() {
  const [msgs, setMsgs] = useState([]), [text, setText] = useState(''), [busy, setBusy] = useState(false), [err, setErr] = useState('')
  const ideas = ['What is recursion?', 'Explain binary search', 'Difference between BFS and DFS', 'What is dynamic programming?']
  const send = async (m) => { m = (m ?? text).trim(); if (!m || busy) return
    const hist = msgs.map(x => ({ role: x.role, content: x.content })); setMsgs([...msgs, { role: 'user', content: m }]); setText(''); setBusy(true); setErr('')
    try { const r = await chatApi(m, hist); setMsgs(x => [...x, { role: 'assistant', content: r.answer, source: r.source }]) }
    catch (e) { setErr(e.message) } setBusy(false) }
  return <>
    <h1>Ask DSA Doubts</h1>
    <p className="mu">Ask any data structures & algorithms question. Please don't share personal information. Chats are not saved on the server.</p>
    <div className="card warn">When an answer is labelled <b>AI</b>, it was written by an AI model and can make mistakes. When labelled <b>Local notes</b>, it comes from a small built-in FAQ (rule-based, not AI).</div>
    <div className="card" aria-live="polite" style={{ minHeight: 220 }}>
      {!msgs.length && <><p className="mu">Try one of these:</p><div className="row">{ideas.map(i => <button key={i} className="btn alt" onClick={() => send(i)}>{i}</button>)}</div></>}
      {msgs.map((m, i) => <div key={i} style={{ margin: '12px 0', textAlign: m.role === 'user' ? 'right' : 'left' }}>
        <div className="mu" style={{ fontSize: 12 }}>{m.role === 'user' ? 'You' : m.source === 'ai' ? 'AI tutor (AI-generated)' : 'Local notes (rule-based, not AI)'}</div>
        <div className={'bubble ' + m.role}><Msg text={m.content} /></div></div>)}
      {busy && <p className="mu"><Loader2 className="spin" size={14} /> Thinking…</p>}
    </div>
    {err && <div className="card err">{err}</div>}
    <div className="row"><input className="chatin" aria-label="Your DSA question" value={text} maxLength={1000} placeholder="Type your DSA question…" onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
      <button className="btn" disabled={busy || !text.trim()} onClick={() => send()}><Send size={15} /> Ask</button></div>
  </>
}

function About() {
  return <><h1>About DSA GapFinder</h1><p className="mu">Find your gaps. Fix your concepts. Crack your next interview.</p>
    <div className="card"><p><b>Problem (Open Innovation — Student Pain Points):</b> students practise DSA without knowing which concepts are weak.</p>
      <p><b>How it works:</b> a 30-question diagnostic is scored server-side by a transparent rule: accuracy = correct ÷ attempted per topic. Strong ≥ 80%, Developing 60–79%, Needs Improvement &lt; 60%, unattempted topics are "Not Assessed".</p>
      <p><b>No AI model is used.</b> Analysis and recommendations are rule-based and use a local mapping. Nothing was trained.</p>
      <p className="mu">{DISCLAIMER}</p></div></>
}

export default function App() {
  const [page, setPage] = useState('dash'), [open, setOpen] = useState(false)
  const [history, setHistory] = useState(load('gf_history', []))
  const [result, setResult] = useState(null), [recs, setRecs] = useState({}), [apiErr, setApiErr] = useState('')
  useEffect(() => { const h = load('gf_history', []); if (h.length) setResult(h[h.length - 1].full) }, [])
  useEffect(() => { Promise.all(TOPICS.map(t => getRecommendation(t).then(r => [t, r]))).then(a => setRecs(Object.fromEntries(a))).catch(e => setApiErr(e.message)) }, [])
  const go = p => { setPage(p); setOpen(false); window.scrollTo(0, 0) }
  const onDone = r => { const h = [...history, { date: Date.now(), overall: r.overall_accuracy, attempted: r.attempted, topics: r.topics, full: { ...r, review: [] } }].slice(-20)
    setHistory(h); save('gf_history', h); setResult(r) }
  const P = { dash: <Dashboard result={result} history={history} go={go} setDemo={() => setResult(DEMO)} />, quiz: <Quiz onDone={onDone} go={go} />,
    weak: <Weak result={result} recs={recs} go={go} />, practice: <Practice result={result} recs={recs} go={go} />, progress: <Progress history={history} go={go} />, chat: <Chat />, about: <About /> }
  return <div className="app"><nav className={'side' + (open ? ' open' : '')} aria-label="Main navigation"><div className="brand">DSA GapFinder</div><div className="tag">AI-Powered Coding Weakness Detector</div>
      {NAV.map(([k, l, I]) => <button key={k} className={'nav' + (page === k ? ' on' : '')} onClick={() => go(k)}><I size={17} />{l}</button>)}</nav>
    <main className="main"><div className="top"><button className="btn alt" aria-label="Toggle menu" onClick={() => setOpen(!open)}><Menu size={18} /></button><b>DSA GapFinder</b></div>
      {apiErr && <div className="card err">{apiErr}</div>}{P[page]}</main></div>
}

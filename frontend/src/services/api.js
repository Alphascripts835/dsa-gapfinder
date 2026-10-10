const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
async function req(path, opts) {
  let res
  try { res = await fetch(BASE + path, opts) }
  catch { throw new Error('Cannot reach the backend. Start it with: uvicorn app.main:app --reload (in /backend).') }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Request failed. Please check your answers and retry.')
  return data
}
export const getQuestions = () => req('/api/questions')
export const getRecommendation = (t) => req('/api/recommendations/' + encodeURIComponent(t))
export const analyze = (answers) => req('/api/assessments/analyze', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers }) })
export const chat = (message, history) => req('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, history }) })

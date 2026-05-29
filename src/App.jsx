import { useState } from 'react'
import './App.css'

const SUGGESTIONS = [
  'Fixed API issue',
  'Tested login flow',
  'Updated validation',
  'Worked on reports',
  'Reviewed PR',
  'Deployed to staging'
]

const TONES = [
  { id: 'Professional', title: 'Professional', desc: 'Formal & polished' },
  { id: 'Concise', title: 'Concise', desc: 'Brief & direct' },
  { id: 'Detailed', title: 'Detailed', desc: 'Thorough & complete' }
]

function App() {
  const [rawNotes, setRawNotes] = useState('')
  const [tone, setTone] = useState('Professional')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSuggestionClick = (suggestion) => {
    if (rawNotes.length >= 1000) return
    const prefix = rawNotes.trim() ? (rawNotes.endsWith(',') || rawNotes.endsWith('.') ? ' ' : ', ') : ''
    const newText = (rawNotes + prefix + suggestion.toLowerCase()).slice(0, 1000)
    setRawNotes(newText)
  }

  const buildPrompt = () => {
    return `You are a professional timesheet writer. Convert these rough work notes into a structured, ${tone.toLowerCase()} timesheet entry.
Tone: ${tone}

Notes:
${rawNotes}

Write a clean, polished timesheet entry in ${tone.toLowerCase()} tone. Only output the final timesheet text. Do not include introductory or concluding conversational text.`
  }

  const generateTimesheet = async () => {
    if (!rawNotes.trim()) {
      setError('Please enter some work notes first.')
      return
    }
    setError('')
    setLoading(true)
    setOutput('')
    try {
      const res = await fetch('http://localhost:3001/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: buildPrompt() }]
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      setOutput(data.content?.[0]?.text || '')
    } catch (e) {
      setError(e.message || 'Failed to connect to local Gemma model server.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container">
      {/* Badge */}
      <div className="badge-wrapper">
        <div className="badge">
          <span className="badge-dot">●</span> AI-POWERED · GEMMA LOCAL
        </div>
      </div>

      {/* Main Header */}
      <header className="hero-header">
        <h1 className="hero-title">AI Timesheet Writer</h1>
        <p className="hero-subtitle">
          Convert rough work notes into professional timesheet updates instantly using AI.
        </p>
      </header>

      {/* Input Card */}
      <div className="input-card">
        <div className="card-header">
          <label className="card-label">WORK NOTES</label>
          <span className="char-count">{rawNotes.length}/1000</span>
        </div>

        <textarea
          className="notes-textarea"
          maxLength={1000}
          placeholder="e.g. fixed auth bug, tested reports, updated validation logic, reviewed PR #142..."
          value={rawNotes}
          onChange={(e) => setRawNotes(e.target.value)}
        />

        {/* Suggestions */}
        <div className="suggestions-list">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              className="suggestion-tag"
              onClick={() => handleSuggestionClick(s)}
            >
              + {s}
            </button>
          ))}
        </div>

        {/* Tone Selector */}
        <div className="tone-section">
          <label className="card-label">OUTPUT TONE</label>
          <div className="tone-grid">
            {TONES.map((t) => (
              <div
                key={t.id}
                className={`tone-card ${tone === t.id ? 'active' : ''}`}
                onClick={() => setTone(t.id)}
              >
                <div className="tone-title">{t.title}</div>
                <div className="tone-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}

        {/* Generate Button */}
        <button
          className={`generate-btn ${loading ? 'loading' : ''}`}
          onClick={generateTimesheet}
          disabled={loading}
        >
          {loading ? (
            <div className="loading-dots">
              <span>Generating</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </div>
          ) : (
            <>Generate Timesheet <span className="arrow-icon">↗</span></>
          )}
        </button>
      </div>

      {/* Output Card */}
      <div className="output-card">
        {output ? (
          <div className="output-container">
            <div className="output-header-bar">
              <span className="output-title">Generated Result</span>
              <div className="output-actions">
                <button className="output-action-btn" onClick={copyToClipboard}>
                  {copied ? 'Copied! ✓' : 'Copy'}
                </button>
                <button className="output-action-btn danger" onClick={() => setOutput('')}>
                  Clear
                </button>
              </div>
            </div>
            <pre className="output-text">{output}</pre>
          </div>
        ) : (
          <div className="empty-output">
            {loading ? (
              <div className="skeleton-loader">
                <div className="skeleton-line w-80"></div>
                <div className="skeleton-line w-90"></div>
                <div className="skeleton-line w-60"></div>
              </div>
            ) : (
              <>
                <div className="clipboard-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  </svg>
                </div>
                <p className="empty-text">
                  Your professional timesheet entries will appear here after generation.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

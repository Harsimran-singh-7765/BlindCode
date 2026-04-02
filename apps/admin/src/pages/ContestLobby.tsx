import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import './ContestLobby.css'
import { apiGetContest, apiGetParticipants, apiAddParticipant, apiStartContest } from '../api'

export const ParticipantStatus = {
  Unjoined: 'unjoined',
  Online: 'online',
  Offline: 'offline'
} as const

export type ParticipantStatus = typeof ParticipantStatus[keyof typeof ParticipantStatus]

interface Participant {
  _id: string
  name: string
  password?: string
  members: { name: string, enroll: number }[]
  status?: ParticipantStatus
  joinedAt: string
}

export default function ContestLobby() {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Passed from ContestCreate as a fallback while we fetch from API
  const nav = location.state as { name: string; duration: number; problems: string[] } | null

  const [contest, setContest] = useState({
    name: nav?.name || '',
    duration: nav?.duration || 60,
    problems: nav?.problems || [] as string[],
  })
  const [participants, setParticipants] = useState<Participant[]>([])
  const [copied, setCopied] = useState(false)
  const [starting, setStarting] = useState(false)
  const [manualError, setManualError] = useState('')
  const [visiblePasswordId, setVisiblePasswordId] = useState<string | null>(null)

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Fetch contest details if not passed via nav state
  useEffect(() => {
    if (!nav?.name && contestId) {
      apiGetContest(contestId).then(data => {
        setContest({
          name: data.name,
          duration: data.duration,
          problems: data.problemIds?.map((p: any) => p.title || p) || []
        })
      }).catch(console.error)
    }
  }, [contestId])

  // New Team Modal State
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [teamForm, setTeamForm] = useState({
    name: '', password: '',
    members: [{ name: '', enroll: '' }, { name: '', enroll: '' }]
  })

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let pass = ''
    for (let i = 0; i < 6; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length))
    setTeamForm(prev => ({ ...prev, password: pass }))
  }

  // Poll participants every 2s
  useEffect(() => {
    const fetchParticipants = () => {
      if (!contestId) return
      apiGetParticipants(contestId)
        .then(data => setParticipants(data))
        .catch(console.error)
    }

    fetchParticipants() // immediate first fetch
    pollRef.current = setInterval(fetchParticipants, 2000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [contestId])

  const handleCopy = () => {
    navigator.clipboard.writeText(contestId || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCreateTeam = async () => {
    setManualError('')
    const validMembers = teamForm.members.filter(m => m.name.trim() && m.enroll)
    if (!teamForm.name || validMembers.length === 0 || !teamForm.password) {
      setManualError('Please fill all required fields (Team Name, at least 1 Member Name/Enroll, Password)')
      return
    }
    try {
      const payloadMembers = validMembers.map(m => ({
        name: m.name,
        enroll: Number(m.enroll)
      }))

      await apiAddParticipant(contestId!, {
        name: teamForm.name,
        password: teamForm.password,
        members: payloadMembers
      })
      setShowTeamModal(false)
      setTeamForm({ name: '', password: '', members: [{ name: '', enroll: '' }, { name: '', enroll: '' }] })
    } catch (err: any) {
      setManualError(err.message || 'Failed to create team')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').map(l => l.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

        // Find indices
        const getIdx = (keywords: string[]) => headers.findIndex(h => keywords.some(kw => h.includes(kw)))
        const idxName = getIdx(['team'])
        const idxM1 = getIdx(['member 1', 'member1'])
        const idxE1 = getIdx(['enroll 1', 'enroll1', 'enroll'])
        // Assumes enroll 1 is the first enroll match, we should find enroll 2 explicitly
        const idxM2 = getIdx(['member 2', 'member2'])
        const idxE2 = getIdx(['enroll 2', 'enroll2'])
        const idxPass = getIdx(['pass'])

        if (idxName === -1 || idxM1 === -1 || idxE1 === -1 || idxPass === -1) {
          alert('CSV missing required headers. Expected: Team Name, Member 1 Name, Enroll 1, Member 2 Name, Enroll 2, Password')
          return
        }

        const teams = lines.slice(1).map(line => {
          const cols = line.split(',').map(c => c.trim())
          const members = []
          if (cols[idxM1] && cols[idxE1]) members.push({ name: cols[idxM1], enroll: Number(cols[idxE1]) })
          if (idxM2 !== -1 && idxE2 !== -1 && cols[idxM2] && cols[idxE2]) members.push({ name: cols[idxM2], enroll: Number(cols[idxE2]) })

          return {
            name: cols[idxName],
            members,
            password: cols[idxPass]
          }
        }).filter(t => t.name && t.members.length > 0)

        if (teams.length > 0) {
          await import('../api').then(m => m.apiAddParticipantsBulk(contestId!, teams))
          alert(`Uploaded ${teams.length} teams.`)
        }
      } catch (err: any) {
        alert('Failed to parse CSV: ' + err.message)
      }
    }
    reader.readAsText(file)
    e.target.value = '' // reset input
  }



  const handleStart = async () => {
    setStarting(true)
    try {
      await apiStartContest(contestId!)
      navigate(`/dashboard/${contestId}`, {
        state: { name: contest.name, duration: contest.duration, problems: contest.problems }
      })
    } catch (err: any) {
      console.error(err)
      setStarting(false)
    }
  }

  return (
    <div className="lobby-page">
      <header className="lobby-header">
        <div className="lobby-header-left">
          <button className="lobby-back-btn" onClick={() => navigate('/')}>← Home</button>
          <div className="lobby-logo-mark">BC</div>
          <div>
            <div className="lobby-logo-title">{contest.name || 'Loading...'}</div>
            <div className="lobby-logo-sub">Waiting for participants</div>
          </div>
        </div>
        <div className="lobby-header-right">
          <span className="lobby-meta-item">⏱ {contest.duration} min</span>
          <span className="lobby-meta-item">⊞ {contest.problems.length} problems</span>
        </div>
      </header>

      <main className="lobby-main">
        <div className="lobby-layout">

          <div className="lobby-code-panel">
            <div className="lobby-code-label">Contest Code</div>
            <div className="lobby-code">{contestId}</div>
            <div className="lobby-code-sub">
              Participants enter this code on their desktop app to join
            </div>
            <button className="lobby-copy-btn" onClick={handleCopy}>
              {copied ? '✓ Copied!' : 'Copy Code'}
            </button>

            <div className="lobby-divider" />

            <div className="lobby-problems-label">Problems in this contest</div>
            <div className="lobby-problems-list">
              {contest.problems.map((p, i) => (
                <div key={i} className="lobby-problem-item">
                  <span className="lobby-problem-num">{i + 1}</span>
                  <span className="lobby-problem-name">{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lobby-participants-panel">
            <div className="lobby-participants-header">
              <div className="lobby-participants-title">Participants Joined</div>
              <div className="lobby-count">
                <span className="lobby-count-num">{participants.length}</span>
                <span className="lobby-count-pulse" />
              </div>
            </div>

            <div className="lobby-participants-list">
              {participants.length === 0 ? (
                <div className="lobby-waiting">
                  <div className="lobby-waiting-dots">
                    <span /><span /><span />
                  </div>
                  <div className="lobby-waiting-text">Add participants...</div>
                </div>
              ) : (
                participants.map((p, i) => (
                  <div key={p._id} className="lobby-participant-row lobby-participant-enter">
                    <span className="lobby-participant-num">{i + 1}</span>
                    <div className="lobby-participant-info">
                      <span className="lobby-participant-name">{p.name || 'Team'}</span>
                      <span className="lobby-participant-mems">
                        {p.members?.map(m => m.name).join(' & ')}
                      </span>
                    </div>
                    <div
                      className="lobby-participant-pass-wrap"
                      onMouseLeave={() => setVisiblePasswordId(null)}
                    >
                      <span className="lobby-participant-pass">
                        {visiblePasswordId === p._id ? p.password : '••••••'}
                      </span>
                      <button
                        className="lobby-pass-eye"
                        onClick={() => setVisiblePasswordId(p._id)}
                        title="Show Password"
                      >
                        {visiblePasswordId === p._id ? '👁️' : '🔒'}
                      </button>
                    </div>
                    <div className="lobby-status-indicator">
                      {(!p.status || p.status === ParticipantStatus.Unjoined) ? <span className="status-dot unjoined" title="Never Joined" /> :
                        (p.status === ParticipantStatus.Online) ? <span className="status-dot active" title="Online" /> :
                          <span className="status-dot offline" title="Offline" />
                      }
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="lobby-start-wrap">
              <div className="lobby-actions-row">
                <button className="manual-add-btn" onClick={() => setShowTeamModal(true)}>+ Create Team</button>
                <label className="upload-csv-btn">
                  Upload CSV
                  <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              </div>

              <button
                className={`lobby-start-btn ${participants.length === 0 ? 'lobby-start-disabled' : ''}`}
                onClick={handleStart}
                disabled={participants.length === 0 || starting}
              >
                {starting
                  ? <span className="lobby-spinner" />
                  : <>Start Contest <span className="lobby-start-arrow">→</span></>
                }
              </button>
              <div className="lobby-start-hint">
                {participants.length === 0
                  ? 'Waiting for at least one participant'
                  : `${participants.length} participant${participants.length > 1 ? 's' : ''} ready`}
              </div>
            </div>
          </div>

        </div>
      </main>

      {showTeamModal && (
        <div className="team-modal-overlay">
          <div className="team-modal">
            <h3>Create New Team</h3>

            <div className="modal-input-group">
              <label>Team Name <span className="req">*</span></label>
              <input value={teamForm.name} onChange={e => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="e.g. Lambda" />
            </div>

            <div className="modal-row">
              <div className="modal-input-group">
                <label>Member 1 Name <span className="req">*</span></label>
                <input value={teamForm.members[0].name} onChange={e => {
                  const newMembers = [...teamForm.members]
                  newMembers[0].name = e.target.value
                  setTeamForm({ ...teamForm, members: newMembers })
                }} />
              </div>
              <div className="modal-input-group">
                <label>Enroll 1 <span className="req">*</span></label>
                <input type="number" value={teamForm.members[0].enroll} onChange={e => {
                  const newMembers = [...teamForm.members]
                  newMembers[0].enroll = e.target.value
                  setTeamForm({ ...teamForm, members: newMembers })
                }} />
              </div>
            </div>

            <div className="modal-row">
              <div className="modal-input-group">
                <label>Member 2 Name (Opt)</label>
                <input value={teamForm.members[1].name} onChange={e => {
                  const newMembers = [...teamForm.members]
                  newMembers[1].name = e.target.value
                  setTeamForm({ ...teamForm, members: newMembers })
                }} />
              </div>
              <div className="modal-input-group">
                <label>Enroll 2 (Opt)</label>
                <input type="number" value={teamForm.members[1].enroll} onChange={e => {
                  const newMembers = [...teamForm.members]
                  newMembers[1].enroll = e.target.value
                  setTeamForm({ ...teamForm, members: newMembers })
                }} />
              </div>
            </div>

            <div className="modal-input-group row-align">
              <div className="flex-1">
                <label>Password <span className="req">*</span></label>
                <input value={teamForm.password} onChange={e => setTeamForm({ ...teamForm, password: e.target.value })} />
              </div>
              <button className="manual-add-btn pass-btn" onClick={generatePassword}>Generate</button>
            </div>

            {manualError && <div className="manual-add-error">{manualError}</div>}

            <div className="modal-actions">
              <button className="lobby-back-btn" onClick={() => setShowTeamModal(false)}>Cancel</button>
              <button className="manual-add-btn" onClick={handleCreateTeam}>Save Team</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

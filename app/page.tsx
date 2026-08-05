'use client'

import { useState, useEffect, useCallback } from 'react'
import { Mail, Copy, RefreshCw, CheckCircle2, XCircle, Send, MessageSquare, Shield, Clock, Lock, Users, Loader } from 'lucide-react'

// ============== UTILS ==============
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

const DOMAINS = [
  'tempnova.io','maildrop.cc','guerrillamail.net','10minutemail.com',
  'throwawaymail.com','tempmailaddress.com','burnermail.io','fakemail.net',
  'mailinator.com','yopmail.com','getairmail.com','tempail.com',
  'mailnesia.com','sharklasers.com','spam4.me','trashmail.net',
  'mytemp.email','mailcatch.com','jetable.org','mohmal.com',
  'tempinbox.com','discard.email','spamgourmet.com','boun.cr',
  'mailtothis.com','anonbox.net','tempmailo.com','disposableemail.org',
  'emailondeck.com','fakeinbox.com','getnada.com','inboxkitten.com',
  'luxusmail.org','mailpoof.com','tempm.com'
]

const ADJECTIVES = ['swift','bright','cool','dark','fast','quiet','wild','calm','bold','keen','sharp','grand','noble','pure','vast','deep','true','fair','firm','safe','free']
const NOUNS = ['eagle','tiger','wolf','falcon','raven','hawk','bear','lion','fox','deer','owl','dove','crane','swan','lynx','orca','puma','cobra','viper','shark','whale','moose','elk','goat','duck','hare','mole','toad','newt','crow','ibis','jay','kite']

function generateTempEmail() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const num = Math.floor(Math.random() * 9000) + 1000
  const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)]
  return { email: `${adj}${noun}${num}@${domain}`, domain }
}

function formatCountdown(seconds: number) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

// ============== TOAST COMPONENT ==============
interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error'
}

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={cn(
      'glass flex min-w-[280px] items-center gap-3 px-5 py-3.5 animate-[toastIn_0.4s_ease] border-l-[3px]',
      type === 'success' ? 'border-l-green-500' : 'border-l-red-500'
    )}>
      {type === 'success' ? (
        <CheckCircle2 className="h-[18px] w-[18px] text-green-400" strokeWidth={2.5} />
      ) : (
        <XCircle className="h-[18px] w-[18px] text-red-400" strokeWidth={2.5} />
      )}
      <span className="text-sm font-medium text-slate-200">{message}</span>
    </div>
  )
}

// ============== MAIN PAGE ==============
export default function Home() {
  const [emailData, setEmailData] = useState(generateTempEmail())
  const [countdown, setCountdown] = useState(24 * 60 * 60)
  const [copied, setCopied] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [supportMsg, setSupportMsg] = useState('')
  const [isSending, setIsSending] = useState(false)

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailData.email)
      setCopied(true)
      addToast('Email copied to clipboard!', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addToast('Failed to copy', 'error')
    }
  }

  const handleNewEmail = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setEmailData(generateTempEmail())
      setCountdown(24 * 60 * 60)
      setIsRefreshing(false)
      addToast('New email generated!', 'success')
    }, 400)
  }

  const handleSendSupport = async () => {
    if (!supportMsg.trim()) {
      addToast('Please enter a message first', 'error')
      return
    }
    setIsSending(true)
    try {
      const res = await fetch('/api/send-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempEmail: emailData.email, message: supportMsg.trim() })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      addToast('Message sent successfully!', 'success')
      setSupportMsg('')
    } catch (err: any) {
      addToast(err.message || 'Failed to send', 'error')
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setEmailData(generateTempEmail())
          addToast('Email expired. New one generated.', 'success')
          return 24 * 60 * 60
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [addToast])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0f] text-slate-200 scrollbar-thin">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 80% 50% at 20% 40%, rgba(99,102,241,0.12) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, rgba(139,92,246,0.10) 0%, transparent 50%),
            radial-gradient(ellipse 50% 50% at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 50%), #0a0a0f`
        }} />
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Toasts */}
      <div className="fixed right-6 top-6 z-[100] flex flex-col gap-2.5">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-[0_4px_15px_rgba(99,102,241,0.3)]">
            <Mail className="h-[22px] w-[22px] text-white" strokeWidth={2.5} />
          </div>
          <span className="bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-2xl font-extrabold text-transparent">
            TempNova
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5">
          <div className="relative h-2 w-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <div className="absolute inset-0 animate-[pulseRing_2s_infinite] rounded-full border-2 border-green-500" />
          </div>
          <span className="text-xs font-medium text-green-400">System Online</span>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 gap-7 px-8 pb-16 lg:grid-cols-[1fr_380px]">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          
          {/* EMAIL GENERATOR */}
          <div className="glass p-10 animate-[fadeInUp_0.6s_ease]">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-400">Temporary Email Address</span>
            <h1 className="mb-2 text-[2rem] font-bold text-slate-50">Your Disposable Inbox</h1>
            <p className="mb-7 max-w-[500px] text-[0.95rem] text-slate-400">
              Generate a secure, anonymous email address instantly. No registration required. Auto-deletes after 24 hours.
            </p>

            <div className="mb-5 flex flex-wrap items-stretch gap-3 sm:flex-nowrap">
              <div className="relative flex-1 min-w-0">
                <input 
                  type="text" 
                  readOnly 
                  value={emailData.email} 
                  className="input-email pr-[140px]" 
                />
                <span className="absolute right-4 top-1/2 max-w-[120px] -translate-y-1/2 truncate rounded-md bg-indigo-500/15 px-2.5 py-1 text-[0.7rem] font-semibold text-indigo-300">
                  {emailData.domain}
                </span>
              </div>
              <button 
                onClick={handleCopy} 
                className={cn('btn-secondary flex items-center gap-2 whitespace-nowrap', copied && 'animate-[copyPop_0.4s_ease]')}
              >
                {copied ? <CheckCircle2 className="h-[18px] w-[18px] text-green-400" /> : <Copy className="h-[18px] w-[18px]" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button onClick={handleNewEmail} className="btn-primary flex items-center gap-2 whitespace-nowrap">
                <RefreshCw className={cn('h-[18px] w-[18px]', isRefreshing && 'animate-spin')} />
                <span>New Email</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1.5 text-[0.8rem] text-slate-500">
                <Shield className="h-3.5 w-3.5 text-green-500" />
                <span>Auto-refresh enabled</span>
              </div>
              <div className="flex items-center gap-1.5 text-[0.8rem] text-slate-500">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>Expires in {formatCountdown(countdown)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[0.8rem] text-slate-500">
                <Lock className="h-3.5 w-3.5 text-blue-500" />
                <span>Secure & Anonymous</span>
              </div>
            </div>
          </div>

          {/* INBOX */}
          <div className="glass overflow-hidden animate-[fadeInUp_0.6s_ease_0.15s_both]">
            <div className="flex items-center justify-between border-b border-white/[0.04] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-indigo-500/10">
                  <Mail className="h-[18px] w-[18px] text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100">Inbox</h3>
                  <span className="text-xs text-slate-500">Waiting for incoming messages</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-[dotBounce_1.4s_infinite_-0.32s_both] rounded-full bg-indigo-500" />
                <span className="h-2 w-2 animate-[dotBounce_1.4s_infinite_-0.16s_both] rounded-full bg-indigo-500" />
                <span className="h-2 w-2 animate-[dotBounce_1.4s_infinite_both] rounded-full bg-indigo-500" />
              </div>
            </div>

            <div className="px-6 py-10 text-center">
              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/[0.08]">
                <Loader className="h-7 w-7 animate-[spin_3s_linear_infinite] text-indigo-500" />
              </div>
              <p className="mb-1.5 text-base font-medium text-slate-400">Searching for incoming emails...</p>
              <p className="mx-auto max-w-[320px] text-xs text-slate-600">
                Your inbox is live and monitoring. Any emails sent to your temporary address will appear here automatically.
              </p>
            </div>

            <div className="border-t border-white/[0.03]">
              <div className="flex animate-[shimmer_2s_infinite] items-center gap-4 px-6 py-4 opacity-30" style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%)',
                backgroundSize: '200% 100%'
              }}>
                <div className="h-9 w-9 flex-shrink-0 rounded-full bg-white/5" />
                <div className="flex-1">
                  <div className="mb-2 h-3 w-[140px] rounded bg-white/5" />
                  <div className="h-2 w-[240px] rounded bg-white/[0.03]" />
                </div>
                <div className="h-2 w-[50px] rounded bg-white/[0.03]" />
              </div>
              <div className="flex animate-[shimmer_2s_infinite] items-center gap-4 px-6 py-4 opacity-20" style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%)',
                backgroundSize: '200% 100%'
              }}>
                <div className="h-9 w-9 flex-shrink-0 rounded-full bg-white/5" />
                <div className="flex-1">
                  <div className="mb-2 h-3 w-[120px] rounded bg-white/5" />
                  <div className="h-2 w-[200px] rounded bg-white/[0.03]" />
                </div>
                <div className="h-2 w-[50px] rounded bg-white/[0.03]" />
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { title: 'Fully Secure', desc: 'End-to-end encrypted temporary addresses', icon: Shield, color: 'text-green-400', bg: 'bg-green-500/10' },
              { title: 'Auto Expires', desc: 'Addresses delete after 24 hours automatically', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { title: 'No Sign Up', desc: 'Instant access with zero registration', icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10' },
            ].map((f, i) => (
              <div key={i} className="glass p-6 text-center transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <div className={cn('mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl', f.bg)}>
                  <f.icon className={cn('h-5 w-5', f.color)} />
                </div>
                <h4 className="mb-1 text-sm font-semibold text-slate-100">{f.title}</h4>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN - LIVE SUPPORT */}
        <div className="glass h-fit p-7 animate-[fadeInUp_0.6s_ease_0.2s_both] lg:sticky lg:top-6">
          <div className="mb-1.5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-amber-500 to-red-500">
              <MessageSquare className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-[1.05rem] font-bold text-slate-100">Live Support</h3>
            <span className="status-live ml-auto">ONLINE</span>
          </div>
          <p className="mb-5 text-[0.8rem] leading-relaxed text-slate-500">
            Need help? Send us a message and our team will respond to your email shortly.
          </p>

          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">Your Message</label>
            <textarea 
              className="textarea-support" 
              placeholder="Describe your issue or question here..."
              value={supportMsg}
              onChange={e => setSupportMsg(e.target.value)}
            />
          </div>

          <button 
            onClick={handleSendSupport} 
            disabled={isSending}
            className="btn-primary flex w-full items-center justify-center gap-2 py-3.5 disabled:opacity-70"
          >
            {isSending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </>
            )}
          </button>

          <div className="mt-5 border-t border-white/[0.04] pt-5">
            <p className="text-center text-[0.7rem] leading-relaxed text-slate-600">
              Messages sent securely via encrypted channel.<br/>Response time: typically under 2 hours.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-5 border-t border-white/[0.03] py-8 text-center">
        <p className="text-sm text-slate-600">© {new Date().getFullYear()} TempNova. Secure temporary email service.</p>
      </footer>
    </div>
  )
}

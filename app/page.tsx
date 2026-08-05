'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Mail, Copy, RefreshCw, CheckCircle2, XCircle, Send, MessageCircle, 
  Shield, Clock, Lock, Users, Loader, X, Sparkles, ChevronRight 
} from 'lucide-react'

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

// ============== TOAST ==============
interface ToastItem { id: number; message: string; type: 'success' | 'error' }

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={cn(
      'flex min-w-[280px] items-center gap-3 rounded-xl border border-white/10 bg-[#13131f] px-5 py-3.5 shadow-2xl animate-[toastIn_0.4s_ease] border-l-[3px]',
      type === 'success' ? 'border-l-green-500' : 'border-l-red-500'
    )}>
      {type === 'success' ? <CheckCircle2 className="h-5 w-5 text-green-400" /> : <XCircle className="h-5 w-5 text-red-400" />}
      <span className="text-sm font-medium text-slate-200">{message}</span>
    </div>
  )
}

// ============== FLOATING CHAT ==============
function FloatingChat({ tempEmail }: { tempEmail: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = (msg: string, type: 'success' | 'error') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message: msg, type }])
  }
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id))

  const handleSend = async () => {
    if (!message.trim()) { addToast('Please enter a message', 'error'); return }
    setIsSending(true)
    try {
      const res = await fetch('/api/send-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempEmail, message: message.trim() })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      addToast('Message sent!', 'success')
      setMessage('')
      setTimeout(() => setIsOpen(false), 1500)
    } catch (err: any) {
      addToast(err.message || 'Failed to send', 'error')
    } finally { setIsSending(false) }
  }

  return (
    <>
      {/* Toasts */}
      <div className="fixed right-6 top-6 z-[100] flex flex-col gap-2.5">
        {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />)}
      </div>

      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_8px_30px_rgba(99,102,241,0.4)] transition-transform hover:scale-110 active:scale-95"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </span>
          </div>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#13131f] shadow-2xl animate-[slideUp_0.3s_ease]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-red-500">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Live Support</h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  <span className="text-[10px] font-medium text-green-400">Online now</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            <p className="mb-3 text-xs leading-relaxed text-slate-400">
              Need help? Send us a message and we&apos;ll respond shortly.
            </p>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="mb-3 min-h-[100px] w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3.5 text-sm text-slate-200 outline-none transition placeholder:text-white/20 focus:border-indigo-500/50"
            />
            <button 
              onClick={handleSend}
              disabled={isSending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {isSending ? (
                <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /><span>Sending...</span></>
              ) : (
                <><Send className="h-4 w-4" /><span>Send Message</span></>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-white/5 px-5 py-3 text-center">
            <p className="text-[10px] text-slate-600">Typically replies within 2 hours</p>
          </div>
        </div>
      )}
    </>
  )
}

// ============== MAIN PAGE ==============
export default function Home() {
  const [emailData, setEmailData] = useState(generateTempEmail())
  const [countdown, setCountdown] = useState(24 * 60 * 60)
  const [copied, setCopied] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const addToast = useCallback((msg: string, type: 'success' | 'error') => {
    setToasts(prev => [...prev, { id: Date.now() + Math.random(), message: msg, type }])
  }, [])
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id))

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailData.email)
      setCopied(true)
      addToast('Email copied to clipboard!', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch { addToast('Failed to copy', 'error') }
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { setEmailData(generateTempEmail()); addToast('Email expired. New one generated.', 'success'); return 24 * 60 * 60 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [addToast])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0f] text-slate-200">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -right-20 top-40 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-[140px]" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Toasts */}
      <div className="fixed right-6 top-6 z-[100] flex flex-col gap-2.5">
        {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />)}
      </div>

      {/* Floating Chat */}
      <FloatingChat tempEmail={emailData.email} />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
            <Mail className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-2xl font-extrabold text-transparent tracking-tight">
            TempNova
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-400">System Online</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-[1200px] px-6 pb-20 lg:px-8">
        
        {/* Hero / Email Generator */}
        <div className="mx-auto max-w-[800px]">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">Temporary Email Address</span>
            <Sparkles className="h-4 w-4 text-indigo-400" />
          </div>
          
          <h1 className="mb-3 text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Your Disposable Inbox
          </h1>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm leading-relaxed text-slate-400 sm:text-base">
            Generate a secure, anonymous email address instantly. No registration required. Auto-deletes after 24 hours.
          </p>

          {/* Email Box */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-2 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-violet-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  readOnly 
                  value={emailData.email} 
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-5 py-4 text-base font-medium tracking-wide text-white outline-none transition focus:border-indigo-500/50 sm:text-lg"
                />
                <span className="absolute right-3 top-1/2 max-w-[130px] -translate-y-1/2 truncate rounded-lg bg-indigo-500/15 px-2.5 py-1 text-xs font-bold text-indigo-300">
                  {emailData.domain}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={handleCopy} 
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white sm:flex-none',
                    copied && 'animate-[copyPop_0.4s_ease]'
                  )}
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                
                <button 
                  onClick={handleNewEmail}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90 active:scale-95 sm:flex-none"
                >
                  <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
                  <span>New Email</span>
                </button>
              </div>
            </div>
          </div>

          {/* Meta Tags */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-slate-500 sm:text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Auto-refresh enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span>Expires in {formatCountdown(countdown)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-500" />
              <span>Secure & Anonymous</span>
            </div>
          </div>
        </div>

        {/* Inbox Section */}
        <div className="mx-auto mt-12 max-w-[800px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl backdrop-blur-xl">
          {/* Inbox Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                <Mail className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Inbox</h3>
                <span className="text-xs text-slate-500">Waiting for incoming messages</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
              <span className="text-xs font-semibold text-indigo-400">Live</span>
            </div>
          </div>

          {/* Inbox Body */}
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/[0.08] ring-1 ring-indigo-500/20">
              <Loader className="h-7 w-7 animate-spin text-indigo-500" />
            </div>
            <p className="mb-1.5 text-base font-semibold text-slate-300">Searching for incoming emails...</p>
            <p className="mx-auto max-w-sm text-xs leading-relaxed text-slate-500">
              Your inbox is live and monitoring. Any emails sent to your temporary address will appear here automatically.
            </p>
          </div>

          {/* Shimmer Rows */}
          <div className="border-t border-white/5">
            {[0.3, 0.2].map((opacity, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4" style={{ opacity }}>
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-2.5 w-32 rounded bg-white/5" />
                  <div className="h-2 w-48 rounded bg-white/[0.03]" />
                </div>
                <div className="h-2 w-12 rounded bg-white/[0.03]" />
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mx-auto mt-10 grid max-w-[800px] grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/20', title: 'Fully Secure', desc: 'End-to-end encrypted temporary addresses' },
            { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', ring: 'ring-blue-500/20', title: 'Auto Expires', desc: 'Addresses delete after 24 hours automatically' },
            { icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10', ring: 'ring-violet-500/20', title: 'No Sign Up', desc: 'Instant access with zero registration' },
          ].map((f, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]">
              <div className={cn('mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ring-1', f.bg, f.ring)}>
                <f.icon className={cn('h-5 w-5', f.color)} />
              </div>
              <h4 className="mb-1 text-center text-sm font-bold text-white">{f.title}</h4>
              <p className="text-center text-xs leading-relaxed text-slate-500">{f.desc}</p>
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center">
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} TempNova. Secure temporary email service.</p>
      </footer>

      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes copyPop { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  )
}

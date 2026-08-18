import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getApiBaseUrl, isDemoMode } from '@/config'

export type ApiConnectionState = 'idle' | 'checking' | 'online' | 'fallback' | 'offline'

type ApiStatusContextValue = {
  state: ApiConnectionState
  apiBaseUrl: string
  refresh: () => void
}

const ApiStatusContext = createContext<ApiStatusContextValue>({
  state: 'idle',
  apiBaseUrl: '',
  refresh: () => undefined,
})

async function probeHealth(apiBaseUrl: string): Promise<boolean> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 90000)
  try {
    const res = await fetch(`${apiBaseUrl}/api/health`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    return res.ok
  } catch {
    return false
  } finally {
    window.clearTimeout(timer)
  }
}

export function ApiStatusProvider({ children }: { children: ReactNode }) {
  const apiBaseUrl = getApiBaseUrl()
  const [state, setState] = useState<ApiConnectionState>('idle')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!apiBaseUrl) {
        setState(isDemoMode() ? 'fallback' : 'offline')
        return
      }
      setState('checking')
      const online = await probeHealth(apiBaseUrl)
      if (cancelled) return
      if (online) {
        setState('online')
        return
      }
      setState(isDemoMode() ? 'fallback' : 'offline')
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [apiBaseUrl, tick])

  const value = useMemo(
    () => ({
      state,
      apiBaseUrl,
      refresh: () => setTick((n) => n + 1),
    }),
    [state, apiBaseUrl],
  )

  return <ApiStatusContext.Provider value={value}>{children}</ApiStatusContext.Provider>
}

export function useApiStatus() {
  return useContext(ApiStatusContext)
}

export function ApiStatusBanner() {
  const { state, refresh } = useApiStatus()

  if (state === 'idle' || state === 'online') return null

  const messages: Record<Exclude<ApiConnectionState, 'idle' | 'online'>, string> = {
    checking: 'Getting the live catalogue. Please wait a moment...',
    fallback:
      'Showing sample catalogue while the live API is waking up. Refresh in a moment for live data.',
    offline: 'Live API is unreachable. Check your Render service or try again shortly.',
  }

  return (
    <div className="border-b border-tan/40 bg-cream px-4 py-2 text-center text-sm text-deep">
      <span>{messages[state]}</span>
      {state !== 'checking' ? (
        <button
          type="button"
          onClick={refresh}
          className="ml-3 underline decoration-gold underline-offset-2 hover:text-primary"
        >
          Retry
        </button>
      ) : null}
    </div>
  )
}

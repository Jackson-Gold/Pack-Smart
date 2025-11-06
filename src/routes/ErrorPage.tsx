import React from 'react'
import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom'

export default function ErrorPage() {
  const err = useRouteError() as any
  const message = isRouteErrorResponse(err) ? `${err.status} ${err.statusText}` : (err?.message || 'Something went wrong')
  return (
    <div style={{display:'grid', placeItems:'center', minHeight:'100dvh', padding:24}}>
      <div style={{maxWidth:720, background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, padding:24}}>
        <h1 style={{fontWeight:600, marginBottom:8}}>Unexpected Application Error</h1>
        <pre style={{whiteSpace:'pre-wrap', background:'#F9FAFB', border:'1px solid #E5E7EB', padding:12, borderRadius:8}}>{message}</pre>
        {err?.stack && <details style={{marginTop:8}}><summary>Stack</summary><pre style={{whiteSpace:'pre-wrap'}}>{String(err.stack)}</pre></details>}
        <div style={{marginTop:12, display:'flex', gap:8}}>
          <Link className="btn btn-primary" to="/app">Return to app</Link>
          <button className="btn" onClick={() => { localStorage.removeItem('pack-smart'); location.href='/app' }}>Reset local state</button>
        </div>
      </div>
    </div>
  )
}

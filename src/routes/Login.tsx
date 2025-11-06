import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const nav = useNavigate()
  return (
    <div className="login-shell">
      <div className="login-hero">
        <div style={{display:'grid', gap:16, placeItems:'center'}}>
          <div className="brand" style={{fontSize:24}}>
            <span className="logo"><span className="material-symbols-rounded">backpack</span></span>
            SmartPack
          </div>
          <figure className="frame" style={{width:540, maxWidth:'80%'}}>
            <img src={`${import.meta.env.BASE_URL}assets/SmartPackLogin 1.svg`} alt="SmartPack login hero" />
          </figure>
          <p style={{opacity:.95, textAlign:'center', maxWidth:520}}>Plan and visualize how everything fits before you zip up. Drag, snap, and optimize your packing in minutes.</p>
        </div>
      </div>
      <div className="login-panel">
        <div className="login-card">
          <h1 style={{fontWeight:600}}>Welcome back</h1>
          <p style={{color:'#374151'}}>Sign in to start packing smarter.</p>
          <div className="input">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@domain.com" />
          </div>
          <div className="input">
            <label htmlFor="pwd">Password</label>
            <input id="pwd" type="password" placeholder="••••••••" />
          </div>
          <button className="btn btn-primary" onClick={() => nav('/app')}>
            <span className="material-symbols-rounded">login</span> Continue
          </button>
          <button className="btn btn-ghost" onClick={() => nav('/app')}>
            <span className="material-symbols-rounded">account_circle</span> Continue as guest
          </button>
          <small style={{color:'#6B7280'}}>No authentication yet — this is a click‑through per your request.</small>
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react';
import api from '../api';

export default function AudiobookPlayer(){
  const [text,setText] = useState('');
  const [title,setTitle] = useState('');
  const [result,setResult] = useState(null);
  const [loading,setLoading] = useState(false);

  const handle = async e=>{
    e.preventDefault();
    setLoading(true);
    try{
      const res = await api.post('/skills/audiobook', { content:text, title, voice_preference:'neutral' });
      setResult(res.data);
    }catch(err){ alert(err?.response?.data?.message || err.message); }
    setLoading(false);
  }

  return (
    <div className="card">
      <h2>Audiobook Creator</h2>
      <form onSubmit={handle}>
        <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="input" style={{height:140,marginTop:8}} value={text} onChange={e=>setText(e.target.value)} placeholder="Text to convert to audiobook..."/>
        <div style={{marginTop:8}}>
          <button className="button" disabled={loading}>{loading? 'Generating...':'Create Audiobook'}</button>
        </div>
      </form>
      {result && (
        <div style={{marginTop:12}}>
          <a href={result.resource?.storageUrl || result.result?.url} target="_blank" rel="noreferrer">Open Audiobook</a>
          <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

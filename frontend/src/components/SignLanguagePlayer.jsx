import React, { useState } from 'react';
import api from '../api';

export default function SignLanguagePlayer(){
  const [text,setText] = useState('');
  const [result,setResult] = useState(null);
  const [loading,setLoading] = useState(false);

  const handle = async e=>{
    e.preventDefault();
    setLoading(true);
    try{
      const res = await api.post('/skills/sign', { content:text, title:'Sign Video' });
      setResult(res.data);
    }catch(err){ alert(err?.response?.data?.message || err.message); }
    setLoading(false);
  }

  return (
    <div className="card">
      <h2>Sign Language</h2>
      <form onSubmit={handle}>
        <textarea className="input" value={text} onChange={e=>setText(e.target.value)} placeholder="Enter text to translate to sign"/>
        <div style={{marginTop:8}}>
          <button className="button" disabled={loading}>{loading? 'Creating...':'Create Sign Video'}</button>
        </div>
      </form>
      {result && (
        <div style={{marginTop:12}}>
          <a href={result.resource?.storageUrl || result.result?.url} target="_blank" rel="noreferrer">Open Sign Video</a>
          <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

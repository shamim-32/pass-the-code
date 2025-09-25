import React, { useState } from 'react';
import api from '../api';

function toBase64(file){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = ()=>resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function LiveCaption(){
  const [file,setFile] = useState(null);
  const [result,setResult] = useState(null);
  const [loading,setLoading] = useState(false);

  const handle = async e=>{
    e.preventDefault();
    if(!file) return alert('select file');
    setLoading(true);
    try{
      const b64 = await toBase64(file);
      const res = await api.post('/skills/live_caption', { audio_base64:b64, language:'en' });
      setResult(res.data);
    }catch(err){ alert(err?.response?.data?.message || err.message); }
    setLoading(false);
  }

  return (
    <div className="card">
      <h2>Live Caption (REST Demo)</h2>
      <form onSubmit={handle}>
        <input type="file" accept="audio/*" onChange={e=>setFile(e.target.files[0])} />
        <div style={{marginTop:8}}><button className="button" disabled={loading}>{loading? 'Transcribing...':'Upload & Transcribe'}</button></div>
      </form>
      {result && (<pre style={{whiteSpace:'pre-wrap',marginTop:12}}>{JSON.stringify(result, null, 2)}</pre>)}
    </div>
  )
}

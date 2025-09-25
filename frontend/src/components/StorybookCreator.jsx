import React, { useState } from 'react';
import api from '../api';

export default function StorybookCreator(){
  const [content,setContent] = useState('');
  const [title,setTitle] = useState('');
  const [loading,setLoading] = useState(false);
  const [result,setResult] = useState(null);

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setLoading(true);
    try{
      const res = await api.post('/skills/storybook', { content, title });
      setResult(res.data);
    }catch(err){
      alert(err?.response?.data?.message || err.message);
    }finally{setLoading(false)}
  }

  return (
    <div className="card">
      <h2>Storybook Creator</h2>
      <form onSubmit={handleSubmit} style={{marginTop:12}}>
        <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="input" style={{height:160,marginTop:8}} placeholder="Paste lesson text here" value={content} onChange={e=>setContent(e.target.value)} />
        <div style={{marginTop:8}}>
          <button className="button" disabled={loading}>{loading? 'Generating...':'Create Storybook'}</button>
        </div>
      </form>

      {result && (
        <div style={{marginTop:12}}>
          <h3>Generated</h3>
          <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

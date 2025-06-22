'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const [script, setScript] = useState('');
  const router = useRouter();

  const handleStart = () => {
    localStorage.setItem('tsuidoku_script', script);
    router.push('/presenter');
  };

  return (
    <main
      style={{
        padding: '40px 20px',
        maxWidth: 800,
        margin: '0 auto',
        fontFamily: 'sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: 32,
          marginBottom: 24,
          textAlign: 'center',
          color: '#222',
        }}
      >
        ついどく
      </h1>
      <textarea
        rows={15}
        style={{
          width: '100%',
          fontSize: 16,
          padding: '12px',
          border: '1px solid #ccc',
          borderRadius: 6,
          resize: 'vertical',
          outlineColor: '#2563eb',
        }}
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="ここに台本を入力してください..."
      />
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleStart}
          disabled={!script.trim()}
          style={{
            marginTop: 20,
            padding: '10px 24px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            cursor: script.trim() ? 'pointer' : 'not-allowed',
            opacity: script.trim() ? 1 : 0.5,
            transition: 'background 0.2s',
          }}
        >
          プレゼン開始
        </button>
      </div>
    </main>
  );
}

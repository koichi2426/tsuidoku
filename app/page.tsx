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
    <div
      style={{
        fontFamily: 'sans-serif',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ヘッダー */}
      <header
        style={{
          padding: '24px 20px 16px',
          borderBottom: '1px solid #eee',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            color: '#222',
          }}
        >
          ついどく
        </h1>
        <p
          style={{
            fontSize: 14,
            color: '#666',
            marginTop: 4,
          }}
        >
          音声で台本に追従するシンプルなプロンプター
        </p>
      </header>

      {/* メイン */}
      <main
        style={{
          padding: 24,
          maxWidth: 800,
          margin: '0 auto',
          flexGrow: 1,
          width: '100%',
        }}
      >
        <label
          htmlFor="script"
          style={{
            display: 'block',
            fontSize: 16,
            marginBottom: 8,
            color: '#444',
          }}
        >
          台本を入力
        </label>
        <textarea
          id="script"
          rows={15}
          style={{
            width: '100%',
            fontSize: 16,
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: 6,
            resize: 'vertical',
            outlineColor: '#2563eb',
            lineHeight: 1.5,
            fontFamily: 'inherit',
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
              fontFamily: 'inherit',
              cursor: script.trim() ? 'pointer' : 'not-allowed',
              opacity: script.trim() ? 1 : 0.5,
              transition: 'opacity 0.2s',
            }}
          >
            プレゼン開始
          </button>
        </div>
      </main>

      {/* フッター */}
      <footer
        style={{
          padding: '12px 20px',
          fontSize: 13,
          textAlign: 'center',
          color: '#999',
          borderTop: '1px solid #eee',
        }}
      >
        © {new Date().getFullYear()} ついどく | 自動スクロール台本アプリ
      </footer>
    </div>
  );
}

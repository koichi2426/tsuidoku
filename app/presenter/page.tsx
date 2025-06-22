'use client';

import { useEffect, useRef, useState } from 'react';

export default function PresenterPage() {
  const [lines, setLines] = useState<string[] | null>(null);
  const [idx, setIdx] = useState(0);
  const refs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('tsuidoku_script') || '';
    setLines(
      saved
        .split('\n')
        .map((line) =>
          line
            .replace(
              /[＊*☆★♪♪※「」『』（）()【】<>《》〔〕［］“”'"!！?？.,。、・…─‐\-＿→←↑↓▼▲■◆●○◎☆★♪※◆■★…※＊]/g,
              ''
            )
            .trim()
        )
        .filter((line) => line.length > 0)
    );
  }, []);

  useEffect(() => {
    if (lines && refs.current[idx]) {
      refs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [idx, lines]);

  useEffect(() => {
    if (!lines) return;

    const SR =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    if (!SR) {
      alert('音声認識に非対応のブラウザです');
      return;
    }

    const rec = new SR();
    rec.lang = 'ja-JP';
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join('');

      const nextIdx = lines.findIndex((line, i) => {
        if (i <= idx - 3) return false;
        return transcript.includes(line.slice(0, 5));
      });

      if (
        nextIdx !== -1 &&
        nextIdx !== idx &&
        Math.abs(nextIdx - idx) <= 10
      ) {
        setIdx(nextIdx);
      }
    };

    rec.start();
    return () => rec.stop();
  }, [lines, idx]);

  if (!lines) {
    return <main style={{ padding: 20 }}>台本を読み込み中...</main>;
  }

  return (
    <main
      style={{
        padding: 20,
        height: '100vh',
        overflowY: 'scroll',
        backgroundColor: '#ffffff',
      }}
    >
      {lines.map((line, i) => (
        <p
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          style={{
            fontSize: 24,
            marginBottom: 20,
            color: i === idx ? '#2563eb' : 'black',
            fontWeight: i === idx ? 'bold' : 'normal',
          }}
        >
          {line}
        </p>
      ))}
    </main>
  );
}

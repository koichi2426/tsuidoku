'use client';

import { useEffect, useRef, useState } from 'react';

const normalize = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[＊*☆★♪♪※「」『』（）()【】<>《》〔〕［］“”'"!！?？.,。、・…─‐\-＿→←↑↓▼▲■◆●○◎]/g, '')
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    )
    .replace(/[\u30a1-\u30f6]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0x60)
    );
};

const cleanVisible = (text: string): string => {
  return text.replace(/[＊*☆★♪♪※]/g, '').trim();
};

export default function PresenterPage() {
  const [linesRaw, setLinesRaw] = useState<string[] | null>(null);
  const [linesNormalized, setLinesNormalized] = useState<string[] | null>(null);
  const [idx, setIdx] = useState(0);
  const refs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('tsuidoku_script') || '';
    const rawOriginal = saved.split('\n').map((line) => line.trim());
    const visible = rawOriginal
      .map((line) => cleanVisible(line))
      .filter((line) => line.length > 0);
    const normalized = rawOriginal
      .map((line) => normalize(line))
      .filter((line) => line.length > 0);
    setLinesRaw(visible);
    setLinesNormalized(normalized);
  }, []);

  useEffect(() => {
    if (linesRaw && refs.current[idx]) {
      refs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [idx, linesRaw]);

  useEffect(() => {
    if (!linesNormalized) return;

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
      const transcript = normalize(
        Array.from(e.results)
          .map((r: any) => r[0].transcript)
          .join('')
      );

      const searchRange = linesNormalized.slice(idx, idx + 20);
      const nextRelative = searchRange.findIndex((line) =>
        transcript.includes(line.slice(0, 5))
      );
      const nextIdx = nextRelative !== -1 ? idx + nextRelative : -1;

      if (
        nextIdx !== -1 &&
        nextIdx !== idx &&
        Math.abs(nextIdx - idx) <= 20
      ) {
        setIdx(nextIdx);
      }
    };

    rec.start();
    return () => rec.stop();
  }, [linesNormalized, idx]);

  if (!linesRaw) {
    return <main style={{ padding: 20 }}>台本を読み込み中...</main>;
  }

  return (
    <main
      style={{
        padding: 20,
        height: '100vh',
        overflowY: 'scroll',
        backgroundColor: '#ffffff',
        fontFamily: 'sans-serif',
      }}
    >
      {linesRaw.map((line, i) => (
        <p
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          style={{
            fontSize: 16,
            marginBottom: 12,
            color: i === idx ? '#2563eb' : 'black',
            fontWeight: i === idx ? 'bold' : 'normal',
            lineHeight: 1.5,
          }}
        >
          {line}
        </p>
      ))}
    </main>
  );
}

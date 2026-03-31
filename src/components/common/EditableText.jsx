import { useState, useRef, useEffect } from 'react';

export default function EditableText({ value, onSave, className = '', tag: Tag = 'span', type = 'text' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);

  useEffect(() => { if (editing && ref.current) { ref.current.focus(); ref.current.select(); } }, [editing]);

  const commit = () => {
    setEditing(false);
    const v = type === 'number' ? Number(draft) : draft;
    if (v !== value) onSave(v);
  };

  if (editing) {
    return (
      <input ref={ref} type={type} value={draft} onChange={(e) => setDraft(e.target.value)}
        onBlur={commit} onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
        className={`bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-600 rounded px-1.5 py-0.5 outline-none focus:ring-2 focus:ring-indigo-400 w-full text-sm ${className}`} />
    );
  }

  return (
    <Tag onClick={() => { setDraft(value); setEditing(true); }}
      className={`cursor-pointer hover:bg-indigo-50 dark:hover:bg-slate-700 rounded px-1 py-0.5 transition-colors ${className}`}
      title="Click to edit">
      {value || '—'}
    </Tag>
  );
}

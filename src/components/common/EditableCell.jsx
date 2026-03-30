import { useState, useRef, useEffect } from 'react';

export default function EditableCell({ value, onSave, type = 'text', className = '' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const parsed = type === 'number' ? Number(draft) : draft;
    if (parsed !== value) onSave(parsed);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setDraft(value); setEditing(false); }
        }}
        className={`bg-brand-50 dark:bg-brand-900/30 border border-brand-300 dark:border-brand-600 rounded px-1.5 py-0.5 text-sm outline-none focus:ring-2 focus:ring-brand-400 w-full ${className}`}
      />
    );
  }

  return (
    <span
      onClick={() => { setDraft(value); setEditing(true); }}
      className={`cursor-pointer hover:bg-brand-50 dark:hover:bg-slate-700 rounded px-1 py-0.5 transition-colors ${className}`}
      title="Click to edit"
    >
      {value}
    </span>
  );
}

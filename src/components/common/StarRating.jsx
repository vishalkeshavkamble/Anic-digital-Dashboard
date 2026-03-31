export default function StarRating({ value = 0, onChange, size = 16, readonly = false }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" disabled={readonly}
          onClick={() => onChange?.(star === value ? 0 : star)}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          style={{ fontSize: size }}>
          <span className={star <= value ? 'text-amber-400' : 'text-gray-300 dark:text-slate-600'}>★</span>
        </button>
      ))}
    </span>
  );
}

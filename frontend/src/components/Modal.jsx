export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
         onClick={onClose}>
      <div className="glass w-full max-w-lg p-6 animate-[fadeIn_.2s_ease]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-black">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

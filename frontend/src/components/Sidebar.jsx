import { NavLink } from 'react-router-dom';

export default function Sidebar({ items }) {
  return (
    <aside className="glass p-4 w-full md:w-60 md:min-h-[70vh] md:sticky md:top-24 self-start">
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.to}>
            <NavLink
              to={i.to}
              end
              className={({ isActive }) =>
                `block px-3 py-2 rounded-xl transition ${
                  isActive ? 'bg-brand-600 text-white shadow' : 'hover:bg-white/60'
                }`
              }
            >
              {i.icon} <span className="ml-2">{i.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

import { NavLink } from 'react-router-dom';
import { useStore } from '@/stores';
import { clsx } from 'clsx';

export function SideMenu() {
  const { navigation, selectMenu } = useStore();

  return (
    <aside className="flex w-64 flex-col border-r border-gray-300 bg-white">
      {/* Navigation Header */}
      <div className="bg-indigo-700 px-4 py-4">
        <h2 className="text-lg font-medium text-white">Navigation</h2>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-2">
          {navigation.menuItems.map((item) => (
            <li key={item.key}>
              <NavLink
                to={`/${item.key}`}
                onClick={() => selectMenu(item.key)}
                className={({ isActive }) =>
                  clsx(
                    'block px-4 py-3 text-base font-medium transition-colors',
                    isActive
                      ? 'border-l-4 border-indigo-700 bg-indigo-50 text-indigo-900'
                      : 'border-l-4 border-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
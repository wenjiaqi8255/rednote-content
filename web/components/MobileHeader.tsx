'use client';

interface MobileHeaderProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  currentTitle?: string;
}

export default function MobileHeader({
  isMenuOpen,
  onToggleMenu,
  currentTitle,
}: MobileHeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {currentTitle || '小红书卡片生成器'}
          </h1>
        </div>

        {/* Menu Toggle Button */}
        <button
          onClick={onToggleMenu}
          aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={isMenuOpen}
          className="p-3 -mr-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          style={{ touchAction: 'manipulation', minWidth: '44px', minHeight: '44px' }}
        >
          {isMenuOpen ? (
            // Close icon (X)
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger menu icon
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

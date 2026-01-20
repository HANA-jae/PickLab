interface TestLayoutProps {
  onBack: () => void;
  title: string;
  emoji: string;
  description: string;
  children: React.ReactNode;
}

export default function TestLayout({ onBack, title, emoji, description, children }: TestLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors"
        >
          ← 돌아가기
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {emoji} {title}
          </h1>
          <p className="text-gray-400 mb-8">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

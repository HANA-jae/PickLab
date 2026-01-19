export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Welcome to PickLab</h1>
        <p className="text-xl text-gray-300 mb-8">
          음식, 게임, 테스트를 통해 즐겁게 배우고 놀아보세요!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer">
            <h2 className="text-2xl font-bold text-blue-400 mb-2">🍔 음식</h2>
            <p className="text-gray-300">맛있는 음식 정보를 탐색해보세요</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer">
            <h2 className="text-2xl font-bold text-green-400 mb-2">🎮 게임</h2>
            <p className="text-gray-300">재미있는 게임을 즐겨보세요</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer">
            <h2 className="text-2xl font-bold text-purple-400 mb-2">📝 테스트</h2>
            <p className="text-gray-300">지식을 테스트해보세요</p>
          </div>
        </div>
      </div>
    </div>
  );
}

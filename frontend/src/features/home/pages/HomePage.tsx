import { Link } from 'react-router-dom';

export default function HomePage() {
  const categories = [
    {
      id: 'eat',
      title: '🍔 음식',
      description: '오늘 점심 뭐 먹을지 고민이세요? 술안주가 필요하신가요? 편하게 들어와서 추천받으세요',
      path: '/eat',
      color: 'from-orange-500 to-red-500',
      icon: '🍽️',
      features: ['오늘의 점심 추천', '저녁 메뉴 추천', '술안주 추천'],
    },
    {
      id: 'game',
      title: '🎮 게임',
      description: '직장에서 지루하신가요? 쉬는 시간에 가볍게 즐길 수 있는 재미있는 미니게임들을 지금 바로',
      path: '/game',
      color: 'from-green-500 to-emerald-500',
      icon: '🏆',
      features: ['가벼운 미니게임', '5분 안에 즐기기', '친구들과 겨루기'],
    },
    {
      id: 'test',
      title: '📝 테스트',
      description: '연인이나 친구들과 함께 즐길 수 있는 신기하고 재미있는 심리테스트들이 가득해요',
      path: '/test',
      color: 'from-purple-500 to-indigo-500',
      icon: '🎯',
      features: ['심리테스트', '성격 유형 검사', '친구들과 공유하기'],
    },
  ];

  const stats = [
    { label: '매일 방문하는 사람들', value: '10K+' },
    { label: '즐겨지는 게임', value: '50+' },
    { label: '재미있는 테스트', value: '100+' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-800 to-gray-950">
      {/* 히어로 섹션 */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8 inline-block">
            <span className="inline-flex items-center rounded-full bg-blue-500/20 backdrop-blur-sm px-4 py-1 text-sm font-medium text-blue-300 ring-2 ring-inset ring-blue-500/50 shadow-lg shadow-blue-500/30">
              ✨ PickLab에 오신 것을 환영합니다
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              언제나 편하게
            </span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
              들어와서 즐기세요
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            점심 추천부터 미니게임, 심리테스트까지.
            언제나 편하게 들어와서 즐길 수 있는 공간입니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              to="/eat"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50"
            >
              지금 시작하기 →
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-blue-300 border-2 border-blue-500/50 backdrop-blur-sm rounded-xl hover:bg-blue-500/10 transition-all duration-300 hover:border-blue-400"
            >
              자세히 보기
            </a>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-xl bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-700/90 backdrop-blur-md p-6 border border-gray-600/50 shadow-xl hover:shadow-2xl hover:border-gray-500/50 transition-all duration-300"
              >
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              여러 가지 즐거움이 준비되어 있어요
            </h2>
            <p className="text-xl text-gray-300">
              편하게 들어와서 당신이 원하는 것을 찾으세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.path}
                className="group cursor-pointer"
              >
                <div className="relative h-full rounded-2xl bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-700/90 backdrop-blur-md p-8 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 hover:ring-2 hover:ring-blue-500/30">
                  {/* 배경 그라디언트 */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${category.color} rounded-2xl`}
                  />

                  <div className="relative">
                    {/* 아이콘 */}
                    <div className="mb-4 text-6xl drop-shadow-lg group-hover:drop-shadow-2xl group-hover:scale-110 transition-all duration-500">{category.icon}</div>

                    {/* 제목 */}
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-300">
                      {category.title}
                    </h3>

                    {/* 설명 */}
                    <p className="text-gray-300 group-hover:text-gray-200 mb-6 leading-relaxed transition-colors duration-300">
                      {category.description}
                    </p>

                    {/* 특징 목록 */}
                    <div className="space-y-2 mb-8">
                      {category.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300"
                        >
                          <span className="w-2 h-2 bg-blue-400 group-hover:bg-purple-400 rounded-full mr-3 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* 버튼 */}
                    <div className="flex items-center text-blue-400 group-hover:text-purple-400 font-semibold group-hover:translate-x-2 transition-all duration-300">
                      시작하기
                      <span className="ml-2">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 md:p-16 shadow-2xl">
            {/* 배경 패턴 */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-30">
              <div className="w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-4">
                지금 바로 들어와보세요
              </h2>
              <p className="text-lg text-blue-50 mb-8 max-w-2xl mx-auto leading-relaxed">
                수천 명의 사람들이 매일 즐기는 PickLab에서 당신을 기다리고 있습니다.
              </p>

              <Link
                to="/eat"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                지금 시작하기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 정보 */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-t border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                언제나 준비된 콘텐츠
              </h3>
              <p className="text-gray-400">
                언제든 들어와서 즐길 수 있는 다양한 콘텐츠가 항상 준비되어 있어요
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                빠른 피드백 수용
              </h3>
              <p className="text-gray-400">
                언제나 원하는 부분을 개선하고 새로운 기능을 추가합니다
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                활발한 커뮤니티
              </h3>
              <p className="text-gray-400">
                함께 배우고 성장하는 커뮤니티
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-500">
            <p>© 2026 PickLab. 모든 권리 보유.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

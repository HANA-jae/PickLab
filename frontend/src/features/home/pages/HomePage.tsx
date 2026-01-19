import { Link } from 'react-router-dom';

export default function HomePage() {
  const categories = [
    {
      id: 'eat',
      title: '🍔 음식',
      description: '맛있는 음식 정보를 탐색하고 새로운 레시피를 발견해보세요',
      path: '/eat',
      color: 'from-orange-500 to-red-500',
      icon: '🍽️',
      features: ['음식 검색', '레시피', '영양 정보'],
    },
    {
      id: 'game',
      title: '🎮 게임',
      description: '재미있는 게임으로 시간을 보내고 친구들과 경쟁해보세요',
      path: '/game',
      color: 'from-green-500 to-emerald-500',
      icon: '🏆',
      features: ['다양한 게임', '점수 랭킹', '업적'],
    },
    {
      id: 'test',
      title: '📝 테스트',
      description: '다양한 주제의 퀴즈와 테스트로 지식을 확장해보세요',
      path: '/test',
      color: 'from-purple-500 to-indigo-500',
      icon: '🎯',
      features: ['퀴즈', '학습 경로', '인증서'],
    },
  ];

  const stats = [
    { label: '활성 사용자', value: '10K+' },
    { label: '완료된 게임', value: '50K+' },
    { label: '테스트 문제', value: '1K+' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* 히어로 섹션 */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8 inline-block">
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-4 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/30">
              ✨ PickLab에 오신 것을 환영합니다
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            모든 것을 배우고,
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              즐기며 성장하세요
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            음식, 게임, 테스트를 통해 재미있게 배우고 성장할 수 있는 플랫폼입니다.
            지금 시작하고 커뮤니티에 참여하세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              to="/eat"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-105 shadow-lg"
            >
              지금 시작하기 →
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/10 transition-all"
            >
              자세히 보기
            </a>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 p-6 border border-gray-700"
              >
                <p className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              다양한 경험을 제공합니다
            </h2>
            <p className="text-xl text-gray-400">
              각 카테고리에서 당신에게 맞는 경험을 찾아보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.path}
                className="group cursor-pointer"
              >
                <div className="relative h-full rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 p-8 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-2xl hover:shadow-blue-500/20">
                  {/* 배경 그라디언트 */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${category.color} rounded-2xl`}
                  />

                  <div className="relative">
                    {/* 아이콘 */}
                    <div className="mb-4 text-6xl">{category.icon}</div>

                    {/* 제목 */}
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                      {category.title}
                    </h3>

                    {/* 설명 */}
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {category.description}
                    </p>

                    {/* 특징 목록 */}
                    <div className="space-y-2 mb-8">
                      {category.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-sm text-gray-300"
                        >
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* 버튼 */}
                    <div className="flex items-center text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
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
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 md:p-16">
            {/* 배경 패턴 */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-20">
              <div className="w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                준비가 되셨나요?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                지금 바로 시작하고 수천 명의 사용자와 함께 성장해보세요.
              </p>

              <Link
                to="/eat"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-all hover:scale-105"
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
                빠른 응답속도
              </h3>
              <p className="text-gray-400">
                최적화된 성능으로 완벽한 사용자 경험 제공
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                안전한 플랫폼
              </h3>
              <p className="text-gray-400">
                당신의 데이터를 안전하게 보호합니다
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

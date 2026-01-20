import { useState, useEffect } from 'react';
import { contentsApi } from '../../../services/api';
import { Content } from '../../../types';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'food' | 'game' | 'quiz'>('food');
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Content>>({});

  // 탭별 데이터 로드
  useEffect(() => {
    loadContents(activeTab);
    setSelectedIds(new Set());
    setEditingId(null);
  }, [activeTab]);

  const loadContents = async (type: 'food' | 'game' | 'quiz') => {
    setLoading(true);
    try {
      const response = await contentsApi.getContents(type);
      const sorted = (response as Content[]).sort((a, b) => (a.order || 0) - (b.order || 0));
      setContents(sorted);
    } catch (error) {
      console.error(`Failed to load ${type}:`, error);
      alert(`${type} 데이터 로드 실패`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(contents.map(c => c.code)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (code: string, checked: boolean) => {
    const newIds = new Set(selectedIds);
    if (checked) {
      newIds.add(code);
    } else {
      newIds.delete(code);
    }
    setSelectedIds(newIds);
  };

  const handleStatusToggle = async (code: string) => {
    try {
      await contentsApi.toggleStatus(code);
      await loadContents(activeTab);
    } catch (error) {
      console.error('Failed to toggle status:', error);
      alert('상태 변경 실패');
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm(`정말 ${code}을(를) 삭제하시겠습니까?`)) return;

    try {
      if (activeTab === 'food') await contentsApi.deleteFood(code);
      else if (activeTab === 'game') await contentsApi.deleteGame(code);
      else await contentsApi.deleteQuiz(code);

      await loadContents(activeTab);
      alert('삭제되었습니다');
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('삭제 실패');
    }
  };

  const handleEditStart = (content: Content) => {
    setEditingId(content.code);
    setEditData({ ...content });
  };

  const handleEditSave = async () => {
    if (!editingId) return;

    try {
      if (activeTab === 'food') await contentsApi.updateFood(editingId, editData);
      else if (activeTab === 'game') await contentsApi.updateGame(editingId, editData);
      else await contentsApi.updateQuiz(editingId, editData);

      setEditingId(null);
      setEditData({});
      await loadContents(activeTab);
      alert('저장되었습니다');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('저장 실패');
    }
  };

  const handleBatchSave = async () => {
    if (selectedIds.size === 0) {
      alert('저장할 항목을 선택해주세요');
      return;
    }

    if (selectedIds.size > 100) {
      alert('한 번에 최대 100개까지만 저장 가능합니다');
      return;
    }

    try {
      const itemsToSave = contents
        .filter(c => selectedIds.has(c.code))
        .map(row => ({
          ...row,
          contentType: activeTab
        }));

      await contentsApi.batchUpsert(itemsToSave);
      alert('일괄 저장되었습니다');
      await loadContents(activeTab);
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to batch save:', error);
      alert('일괄 저장 실패');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-800 to-gray-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-8">
          🔧 관리자 패널
        </h1>

        {/* 탭 네비게이션 */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          {(['food', 'game', 'quiz'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab === 'food' && '🍔 음식'}
              {tab === 'game' && '🎮 게임'}
              {tab === 'quiz' && '📝 퀴즈'}
            </button>
          ))}
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleBatchSave}
            disabled={selectedIds.size === 0 || loading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-all"
          >
            일괄 저장 ({selectedIds.size})
          </button>
          <button
            onClick={() => loadContents(activeTab)}
            disabled={loading}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white font-bold rounded-lg transition-all"
          >
            새로고침
          </button>
        </div>

        {/* 테이블 */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">로딩 중...</p>
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900 border-b border-gray-700">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === contents.length && contents.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300">코드</th>
                    <th className="px-4 py-3 text-left text-gray-300">이름</th>
                    <th className="px-4 py-3 text-left text-gray-300">이모지</th>
                    {activeTab === 'food' && (
                      <>
                        <th className="px-4 py-3 text-left text-gray-300">카테고리1</th>
                        <th className="px-4 py-3 text-left text-gray-300">카테고리2</th>
                      </>
                    )}
                    <th className="px-4 py-3 text-left text-gray-300">사용여부</th>
                    <th className="px-4 py-3 text-left text-gray-300">순서</th>
                    <th className="px-4 py-3 text-left text-gray-300">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {contents.length > 0 ? (
                    contents.map((content) => (
                      <tr key={content.code} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(content.code)}
                            onChange={(e) => handleSelectRow(content.code, e.target.checked)}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 text-gray-300 font-mono text-sm">{content.code}</td>
                        <td className="px-4 py-3">
                          {editingId === content.code ? (
                            <input
                              type="text"
                              value={editData.name || ''}
                              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                              className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-full"
                            />
                          ) : (
                            <span className="text-gray-300">{content.name}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === content.code ? (
                            <input
                              type="text"
                              value={editData.emoji || ''}
                              onChange={(e) => setEditData({ ...editData, emoji: e.target.value })}
                              className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-full"
                              maxLength={2}
                            />
                          ) : (
                            <span className="text-2xl">{content.emoji || '-'}</span>
                          )}
                        </td>
                        {activeTab === 'food' && (
                          <>
                            <td className="px-4 py-3 text-sm text-gray-400">{content.category1 || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-400">{content.category2 || '-'}</td>
                          </>
                        )}
                        <td className="px-4 py-3">
                          {editingId === content.code ? (
                            <select
                              value={editData.useYn || 'Y'}
                              onChange={(e) => setEditData({ ...editData, useYn: e.target.value })}
                              className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded"
                            >
                              <option value="Y">사용</option>
                              <option value="N">미사용</option>
                            </select>
                          ) : (
                            <span className={content.useYn === 'Y' ? 'text-green-400' : 'text-red-400'}>
                              {content.useYn}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === content.code ? (
                            <input
                              type="number"
                              value={editData.order || 0}
                              onChange={(e) => setEditData({ ...editData, order: parseInt(e.target.value) })}
                              className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-16"
                            />
                          ) : (
                            <span className="text-gray-400">{content.order || '-'}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {editingId === content.code ? (
                              <>
                                <button
                                  onClick={handleEditSave}
                                  className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                                >
                                  저장
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded"
                                >
                                  취소
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditStart(content)}
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleStatusToggle(content.code)}
                                  className="px-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded"
                                >
                                  토글
                                </button>
                                <button
                                  onClick={() => handleDelete(content.code)}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                                >
                                  삭제
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                        데이터가 없습니다
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 통계 */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm">총 항목 수</p>
            <p className="text-3xl font-bold text-blue-400">{contents.length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm">사용 중인 항목</p>
            <p className="text-3xl font-bold text-green-400">
              {contents.filter(c => c.useYn === 'Y').length}
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm">미사용 항목</p>
            <p className="text-3xl font-bold text-red-400">
              {contents.filter(c => c.useYn === 'N').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

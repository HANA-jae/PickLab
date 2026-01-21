import { useState, useEffect, useRef } from 'react';
import { contentsApi } from '../../../services/api';
import { Content, CommonCode, CommonMaster } from '../../../types';
import { useToast } from '../../../hooks';
import * as XLSX from 'xlsx';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'food' | 'game' | 'quiz' | 'common'>('food');
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { showToast, showConfirm } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 조회 조건 (음식 탭만)
  const [searchCategory1, setSearchCategory1] = useState<string>('');
  const [searchCategory2, setSearchCategory2] = useState<string>('');
  const [searchCategory3, setSearchCategory3] = useState<string>('');
  const [searchCategory4, setSearchCategory4] = useState<string>('');
  const [searchCategory5, setSearchCategory5] = useState<string>('');

  // 카테고리 공통코드
  const [category1Options, setCategory1Options] = useState<CommonCode[]>([]);
  const [category2Options, setCategory2Options] = useState<CommonCode[]>([]);
  const [category3Options, setCategory3Options] = useState<CommonCode[]>([]);
  const [category4Options, setCategory4Options] = useState<CommonCode[]>([]);
  const [category5Options, setCategory5Options] = useState<CommonCode[]>([]);

  // 카테고리 마스터 정보 (헤더명용)
  const [category1Master, setCategory1Master] = useState<CommonMaster | null>(null);
  const [category2Master, setCategory2Master] = useState<CommonMaster | null>(null);
  const [category3Master, setCategory3Master] = useState<CommonMaster | null>(null);
  const [category4Master, setCategory4Master] = useState<CommonMaster | null>(null);
  const [category5Master, setCategory5Master] = useState<CommonMaster | null>(null);

  // 공통코드 관리
  const [masters, setMasters] = useState<CommonMaster[]>([]);
  const [details, setDetails] = useState<CommonCode[]>([]);
  const [selectedMasterRowId, setSelectedMasterRowId] = useState<string>('');
  const [selectedMasterCode, setSelectedMasterCode] = useState<string>('');
  const [selectedMasterIds, setSelectedMasterIds] = useState<Set<string>>(new Set());
  const [selectedDetailIds, setSelectedDetailIds] = useState<Set<string>>(new Set());

  // 탭별 데이터 로드
  useEffect(() => {
    if (activeTab === 'common') {
      loadMasters();
    } else {
      loadContents(activeTab);
      setSelectedIds(new Set());
      
      // 음식 탭일 때만 카테고리 공통코드 로드
      if (activeTab === 'food') {
        loadCategoryOptions();
      } else {
        // 다른 탭으로 이동 시 검색 조건 초기화
        resetSearchFilters();
      }
    }
  }, [activeTab]);

  const loadCategoryOptions = async () => {
    try {
      const [cat1, cat2, cat3, cat4, cat5, master1, master2, master3, master4, master5] = await Promise.all([
        contentsApi.getCommonCodes('CATEGORY1'),
        contentsApi.getCommonCodes('CATEGORY2'),
        contentsApi.getCommonCodes('CATEGORY3'),
        contentsApi.getCommonCodes('CATEGORY4'),
        contentsApi.getCommonCodes('CATEGORY5'),
        contentsApi.getCommonMaster('CATEGORY1'),
        contentsApi.getCommonMaster('CATEGORY2'),
        contentsApi.getCommonMaster('CATEGORY3'),
        contentsApi.getCommonMaster('CATEGORY4'),
        contentsApi.getCommonMaster('CATEGORY5'),
      ]);
      setCategory1Options(cat1 as CommonCode[]);
      setCategory2Options(cat2 as CommonCode[]);
      setCategory3Options(cat3 as CommonCode[]);
      setCategory4Options(cat4 as CommonCode[]);
      setCategory5Options(cat5 as CommonCode[]);
      
      setCategory1Master(master1 as CommonMaster);
      setCategory2Master(master2 as CommonMaster);
      setCategory3Master(master3 as CommonMaster);
      setCategory4Master(master4 as CommonMaster);
      setCategory5Master(master5 as CommonMaster);
      setCategory2Options(cat2 as CommonCode[]);
      setCategory3Options(cat3 as CommonCode[]);
      setCategory4Options(cat4 as CommonCode[]);
      setCategory5Options(cat5 as CommonCode[]);
    } catch (error) {
      console.error('Failed to load category options:', error);
    }
  };

  const resetSearchFilters = () => {
    setSearchCategory1('');
    setSearchCategory2('');
    setSearchCategory3('');
    setSearchCategory4('');
    setSearchCategory5('');
  };

  const loadContents = async (type: 'food' | 'game' | 'quiz') => {
    setLoading(true);
    try {
      let response;
      
      // 음식 탭이고 검색 조건이 있으면 필터링 API 사용
      if (type === 'food' && (searchCategory1 || searchCategory2 || searchCategory3 || searchCategory4 || searchCategory5)) {
        response = await contentsApi.getFoodsByCategories({
          category1: searchCategory1 || undefined,
          category2: searchCategory2 || undefined,
          category3: searchCategory3 || undefined,
          category4: searchCategory4 || undefined,
          category5: searchCategory5 || undefined,
        });
      } else {
        response = await contentsApi.getContents(type);
      }
      
      // DB에서 받은 데이터를 통일된 필드로 매핑
      const mapped = (response as any[]).map((item: any) => ({
        code: item.foodCode || item.gameCode || item.quizCode,
        name: item.foodName || item.gameName || item.quizName,
        emoji: item.foodEmoji || item.gameEmoji || item.quizEmoji,
        category1: item.category1,
        category2: item.category2,
        category3: item.category3,
        category4: item.category4,
        category5: item.category5,
        useYn: item.useYn,
        order: item.order || 0,
        createdUser: item.createdUser,
        createdDate: item.createdDate,
        updatedUser: item.updatedUser,
        updatedDate: item.updatedDate,
      }));
      const sorted = mapped.sort((a, b) => (a.order || 0) - (b.order || 0));
      setContents(sorted);
    } catch (error) {
      console.error(`Failed to load ${type}:`, error);
      showToast(`${type} 데이터 로드 실패`, 'error');
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

  const handleFieldChange = (code: string, field: keyof Content, value: any) => {
    setContents(contents.map(c => 
      c.code === code ? { ...c, [field]: value } : c
    ));
    // 수정된 행 자동 선택
    setSelectedIds(prev => {
      const newIds = new Set(prev);
      newIds.add(code);
      return newIds;
    });
  };

  const handleAdd = () => {
    // 그리드에 새 행만 추가 (저장 시 백엔드에서 코드 자동 생성)
    const newItem: Content = {
      code: 'NEW_' + Date.now(), // 임시 코드
      name: '',
      emoji: '',
      useYn: 'Y',
      order: contents.length,
    };
    
    if (activeTab === 'food') {
      newItem.category1 = '';
      newItem.category2 = '';
      newItem.category3 = '';
      newItem.category4 = '';
      newItem.category5 = '';
    }
    
    setContents([...contents, newItem]);
    // 새로 추가된 행을 자동으로 선택
    setSelectedIds(new Set([newItem.code]));
    showToast('새 행이 추가되었습니다. 데이터를 입력하고 저장해주세요.', 'info');
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) {
      showToast('삭제할 항목을 선택해주세요', 'warning');
      return;
    }

    const confirmed = await showConfirm(`선택한 ${selectedIds.size}개 항목을 삭제하시겠습니까?`, {
      title: '삭제 확인',
      type: 'danger',
      confirmText: '삭제',
      cancelText: '취소',
    });
    if (!confirmed) return;

    try {
      const newCodes = Array.from(selectedIds).filter(code => code.startsWith('NEW_'));
      const existingCodes = Array.from(selectedIds).filter(code => !code.startsWith('NEW_'));
      
      // NEW로 시작하는 코드는 로컬에서만 삭제
      if (newCodes.length > 0) {
        setContents(contents.filter(c => !newCodes.includes(c.code)));
      }
      
      // 기존 데이터는 백엔드에서 삭제
      for (const code of existingCodes) {
        if (activeTab === 'food') await contentsApi.deleteFood(code);
        else if (activeTab === 'game') await contentsApi.deleteGame(code);
        else if (activeTab === 'quiz') await contentsApi.deleteQuiz(code);
      }
      
      // 기존 데이터가 있었다면 다시 로드
      if (existingCodes.length > 0 && activeTab !== 'common') {
        await loadContents(activeTab);
      }
      
      setSelectedIds(new Set());
      showToast('삭제되었습니다', 'success');
    } catch (error) {
      console.error('Failed to delete:', error);
      showToast('삭제 실패', 'error');
    }
  };

  const handleSave = async () => {
    if (selectedIds.size === 0) {
      showToast('저장할 항목을 선택해주세요', 'warning');
      return;
    }

    try {
      for (const code of Array.from(selectedIds)) {
        const item = contents.find(c => c.code === code);
        if (!item) continue;

        // 이름이 비어있으면 저장 불가
        if (!item.name || item.name.trim() === '') {
          showToast('이름을 입력해주세요', 'warning');
          return;
        }

        // NEW로 시작하면 신규 생성 (백엔드에서 코드 자동 채번)
        if (code.startsWith('NEW_')) {
          if (activeTab === 'food') await contentsApi.createFood(item);
          else if (activeTab === 'game') await contentsApi.createGame(item);
          else if (activeTab === 'quiz') await contentsApi.createQuiz(item);
        } else {
          // 기존 데이터는 업데이트
          if (activeTab === 'food') await contentsApi.updateFood(code, item);
          else if (activeTab === 'game') await contentsApi.updateGame(code, item);
          else if (activeTab === 'quiz') await contentsApi.updateQuiz(code, item);
        }
      }
      if (activeTab !== 'common') {
        await loadContents(activeTab);
      }
      setSelectedIds(new Set());
      showToast('저장되었습니다', 'success');
    } catch (error) {
      console.error('Failed to save:', error);
      showToast('저장 실패', 'error');
    }
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        if (jsonData.length === 0) {
          showToast('엑셀 파일에 데이터가 없습니다', 'warning');
          return;
        }

        // 엑셀 데이터를 Content 형식으로 변환
        const newItems: Content[] = jsonData.map((row, index) => {
          const item: Content = {
            code: 'NEW_' + Date.now() + '_' + index,
            name: row['이름'] || row['name'] || '',
            emoji: row['이모지'] || row['emoji'] || '',
            useYn: (row['사용여부'] || row['useYn'] || 'Y') === 'Y' ? 'Y' : 'N',
          };

          // 음식 탭일 때 카테고리 추가
          if (activeTab === 'food') {
            item.category1 = row[category1Master?.masterDesc || '카테고리1'] || row['category1'] || '';
            item.category2 = row[category2Master?.masterDesc || '카테고리2'] || row['category2'] || '';
            item.category3 = row[category3Master?.masterDesc || '카테고리3'] || row['category3'] || '';
            item.category4 = row[category4Master?.masterDesc || '카테고리4'] || row['category4'] || '';
            item.category5 = row[category5Master?.masterDesc || '카테고리5'] || row['category5'] || '';
          }

          return item;
        });

        // 기존 컨텐츠에 추가
        setContents([...contents, ...newItems]);
        // 새로 추가된 항목들을 선택
        setSelectedIds(new Set(newItems.map(item => item.code)));
        showToast(`${newItems.length}개 항목이 추가되었습니다. 저장 버튼을 눌러주세요.`, 'success');
      } catch (error) {
        console.error('Failed to parse excel:', error);
        showToast('엑셀 파일 파싱 실패', 'error');
      }
    };

    reader.readAsBinaryString(file);
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTemplateDownload = () => {
    // 헤더 생성
    const headers: string[] = ['이름', '이모지', '사용여부'];
    
    if (activeTab === 'food') {
      headers.push(
        category1Master?.masterDesc || '카테고리1',
        category2Master?.masterDesc || '카테고리2',
        category3Master?.masterDesc || '카테고리3',
        category4Master?.masterDesc || '카테고리4',
        category5Master?.masterDesc || '카테고리5'
      );
    }

    // 샘플 데이터 (선택사항)
    const sampleData: any[] = [];
    
    // 워크북 생성
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // 파일명 생성
    const fileName = `${activeTab === 'food' ? '음식' : activeTab === 'game' ? '게임' : '퀴즈'}_템플릿.xlsx`;
    
    // 다운로드
    XLSX.writeFile(workbook, fileName);
    showToast('템플릿이 다운로드되었습니다', 'success');
  };

  // 공통코드 관리 함수들
  const createTempId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const getMasterRowId = (master: CommonMaster) =>
    master.seq !== undefined ? `m:${master.seq}` : `m:tmp:${master.tempId}`;

  const getDetailRowId = (detail: CommonCode) =>
    detail.seq !== undefined ? `d:${detail.seq}` : `d:tmp:${detail.tempId}`;

  const handleSelectMasterRow = (master: CommonMaster) => {
    const rowId = getMasterRowId(master);
    if (selectedMasterRowId !== rowId) {
      setSelectedMasterRowId(rowId);
      setSelectedMasterCode(master.masterCode);
    }
  };

  const loadMasters = async () => {
    setLoading(true);
    try {
      const result = await contentsApi.getAllCommonMasters() as CommonMaster[];
      const normalized = result.map((master) =>
        master.seq !== undefined ? master : { ...master, tempId: master.tempId ?? createTempId() }
      );
      setMasters(normalized);
      
      // 첨 번째 행 자동 선택
      if (normalized.length > 0) {
        const firstMaster = normalized[0];
        setSelectedMasterRowId(getMasterRowId(firstMaster));
        setSelectedMasterCode(firstMaster.masterCode);
      } else {
        setSelectedMasterRowId('');
        setSelectedMasterCode('');
        setDetails([]);
      }
    } catch (error) {
      console.error('Failed to load masters:', error);
      showToast('마스터 코드 로드 실패', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadDetails = async (masterCode: string) => {
    if (!masterCode) {
      setDetails([]);
      return;
    }
    
    setLoading(true);
    try {
      const result = await contentsApi.getCommonDetailsByMaster(masterCode) as CommonCode[];
      const normalized = result.map((detail) =>
        detail.seq !== undefined ? detail : { ...detail, tempId: detail.tempId ?? createTempId() }
      );
      setDetails(normalized);
      setSelectedDetailIds(new Set());
    } catch (error) {
      console.error('Failed to load details:', error);
      showToast('상세 코드 로드 실패', 'error');
    } finally {
      setLoading(false);
    }
  };

  // selectedMasterCode가 변경될 때 디테일 로드
  useEffect(() => {
    if (selectedMasterCode && activeTab === 'common') {
      loadDetails(selectedMasterCode);
    }
  }, [selectedMasterCode, activeTab]);

  const handleMasterFieldChange = (rowId: string, field: keyof CommonMaster, value: any) => {
    setMasters(prev => prev.map(m => 
      getMasterRowId(m) === rowId ? { ...m, [field]: value } : m
    ));
    setSelectedMasterIds(prev => {
      const newIds = new Set(prev);
      newIds.add(rowId);
      return newIds;
    });
  };

  const handleDetailFieldChange = (rowId: string, field: keyof CommonCode, value: any) => {
    setDetails(prev => prev.map(d => 
      getDetailRowId(d) === rowId ? { ...d, [field]: value } : d
    ));
    setSelectedDetailIds(prev => {
      const newIds = new Set(prev);
      newIds.add(rowId);
      return newIds;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-800 to-gray-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-8">
          🔧 관리자 패널
        </h1>

        {/* 탭 네비게이션 */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          {(['food', 'game', 'quiz', 'common'] as const).map((tab) => (
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
              {tab === 'common' && '⚙️ 공통코드'}
            </button>
          ))}
        </div>

        {/* 조회 조건 (음식 탭만) */}
        {activeTab === 'food' && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-5 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">{category1Master?.masterDesc || '카테고리1'}</label>
                <select
                  value={searchCategory1}
                  onChange={(e) => setSearchCategory1(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체</option>
                  {category1Options.map((opt) => (
                    <option key={opt.detailCode} value={opt.detailCode}>
                      {opt.detailName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">{category2Master?.masterDesc || '카테고리2'}</label>
                <select
                  value={searchCategory2}
                  onChange={(e) => setSearchCategory2(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체</option>
                  {category2Options.map((opt) => (
                    <option key={opt.detailCode} value={opt.detailCode}>
                      {opt.detailName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">{category3Master?.masterDesc || '카테고리3'}</label>
                <select
                  value={searchCategory3}
                  onChange={(e) => setSearchCategory3(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체</option>
                  {category3Options.map((opt) => (
                    <option key={opt.detailCode} value={opt.detailCode}>
                      {opt.detailName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">{category4Master?.masterDesc || '카테고리4'}</label>
                <select
                  value={searchCategory4}
                  onChange={(e) => setSearchCategory4(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체</option>
                  {category4Options.map((opt) => (
                    <option key={opt.detailCode} value={opt.detailCode}>
                      {opt.detailName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">{category5Master?.masterDesc || '카테고리5'}</label>
                <select
                  value={searchCategory5}
                  onChange={(e) => setSearchCategory5(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체</option>
                  {category5Options.map((opt) => (
                    <option key={opt.detailCode} value={opt.detailCode}>
                      {opt.detailName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 액션 버튼 (음식/게임/퀴즈 탭만) */}
        {activeTab !== 'common' && (
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                setSelectedIds(new Set());
                loadContents(activeTab);
              }}
              disabled={loading}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white font-bold rounded-lg transition-all"
            >
              조회
            </button>
          <div className="flex gap-3">
            <button
              onClick={handleTemplateDownload}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-all"
            >
              템플릿 다운로드
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-all"
            >
              엑셀 업로드
            </button>
            <button
              onClick={handleAdd}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-all"
            >
              추가
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedIds.size === 0 || loading}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-all"
            >
              삭제 ({selectedIds.size})
            </button>
            <button
              onClick={handleSave}
              disabled={selectedIds.size === 0 || loading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-all"
            >
              저장 ({selectedIds.size})
            </button>
          </div>
        </div>
        )}

        {/* 테이블 (음식/게임/퀴즈 탭만) */}
        {activeTab !== 'common' && (
          <>
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
                    <th className="px-2 py-3 text-left w-12">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === contents.length && contents.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="px-3 py-3 text-left text-gray-300 w-24">코드</th>
                    <th className="px-3 py-3 text-left text-gray-300 w-48">이름</th>
                    <th className="px-3 py-3 text-left text-gray-300 w-20">이모지</th>
                    {activeTab === 'food' && (
                      <>
                        <th className="px-3 py-3 text-left text-gray-300 w-32">{category1Master?.masterDesc || '카테고리1'}</th>
                        <th className="px-3 py-3 text-left text-gray-300 w-32">{category2Master?.masterDesc || '카테고리2'}</th>
                        <th className="px-3 py-3 text-left text-gray-300 w-32">{category3Master?.masterDesc || '카테고리3'}</th>
                        <th className="px-3 py-3 text-left text-gray-300 w-32">{category4Master?.masterDesc || '카테고리4'}</th>
                        <th className="px-3 py-3 text-left text-gray-300 w-32">{category5Master?.masterDesc || '카테고리5'}</th>
                      </>
                    )}
                    <th className="px-3 py-3 text-center text-gray-300 w-24">사용여부</th>
                  </tr>
                </thead>
                <tbody>
                  {contents.length > 0 ? (
                    contents.map((content) => (
                      <tr key={content.code} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="px-2 py-3 w-12">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(content.code)}
                            onChange={(e) => handleSelectRow(content.code, e.target.checked)}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="px-3 py-3 text-gray-300 font-mono text-sm w-24">{content.code}</td>
                        <td className="px-3 py-3 w-48">
                          <input
                            type="text"
                            value={content.name || ''}
                            onChange={(e) => handleFieldChange(content.code, 'name', e.target.value)}
                            className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-full text-sm"
                          />
                        </td>
                        <td className="px-3 py-3 w-20">
                          <input
                            type="text"
                            value={content.emoji || ''}
                            onChange={(e) => handleFieldChange(content.code, 'emoji', e.target.value)}
                            className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-16 text-center text-lg"
                            maxLength={2}
                          />
                        </td>
                        {activeTab === 'food' && (
                          <>
                            <td className="px-3 py-3 w-32">
                              <select
                                value={content.category1 || ''}
                                onChange={(e) => handleFieldChange(content.code, 'category1', e.target.value)}
                                className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-full text-xs"
                              >
                                <option value="">선택</option>
                                {category1Options.map((opt) => (
                                  <option key={opt.detailCode} value={opt.detailCode}>
                                    {opt.detailName}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-3 w-32">
                              <select
                                value={content.category2 || ''}
                                onChange={(e) => handleFieldChange(content.code, 'category2', e.target.value)}
                                className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-full text-xs"
                              >
                                <option value="">선택</option>
                                {category2Options.map((opt) => (
                                  <option key={opt.detailCode} value={opt.detailCode}>
                                    {opt.detailName}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-3 w-32">
                              <select
                                value={content.category3 || ''}
                                onChange={(e) => handleFieldChange(content.code, 'category3', e.target.value)}
                                className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-full text-xs"
                              >
                                <option value="">선택</option>
                                {category3Options.map((opt) => (
                                  <option key={opt.detailCode} value={opt.detailCode}>
                                    {opt.detailName}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-3 w-32">
                              <select
                                value={content.category4 || ''}
                                onChange={(e) => handleFieldChange(content.code, 'category4', e.target.value)}
                                className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-full text-xs"
                              >
                                <option value="">선택</option>
                                {category4Options.map((opt) => (
                                  <option key={opt.detailCode} value={opt.detailCode}>
                                    {opt.detailName}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-3 w-32">
                              <select
                                value={content.category5 || ''}
                                onChange={(e) => handleFieldChange(content.code, 'category5', e.target.value)}
                                className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-full text-xs"
                              >
                                <option value="">선택</option>
                                {category5Options.map((opt) => (
                                  <option key={opt.detailCode} value={opt.detailCode}>
                                    {opt.detailName}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </>
                        )}
                        <td className="px-3 py-3 text-center w-24">
                          <input
                            type="checkbox"
                            checked={content.useYn === 'Y'}
                            onChange={(e) => handleFieldChange(content.code, 'useYn', e.target.checked ? 'Y' : 'N')}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={activeTab === 'food' ? 10 : 5} className="px-4 py-8 text-center text-gray-400">
                        데이터가 없습니다
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
          }
        </>
        )}

        {/* 공통코드 관리 탭 */}
        {activeTab === 'common' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Master 그리드 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">마스터 코드</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const tempId = createTempId();
                      const newMaster: CommonMaster = { 
                        seq: undefined,
                        tempId,
                        masterCode: '', 
                        masterName: '',
                        masterDesc: '', 
                        useYn: 'Y', 
                        sortNo: masters.length + 1 
                      };
                      setMasters([...masters, newMaster]);
                      setSelectedMasterIds(new Set([`m:tmp:${tempId}`]));
                      setSelectedMasterRowId(`m:tmp:${tempId}`);
                      setSelectedMasterCode('');
                      setDetails([]);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    추가
                  </button>
                  <button
                    onClick={async () => {
                      const selected = Array.from(selectedMasterIds);
                      if (selected.length === 0) {
                        showToast('삭제할 항목을 선택하세요', 'warning');
                        return;
                      }
                      
                      const confirmed = await showConfirm(
                        `선택한 ${selected.length}개 항목을 삭제하시겠습니까?`,
                        { type: 'danger' }
                      );
                      
                      if (confirmed) {
                        for (const rowId of selected) {
                          const master = masters.find(m => getMasterRowId(m) === rowId);
                          if (!master) continue;
                          
                          // seq가 있는 경우만 DB에서 삭제
                          if (master.seq) {
                            try {
                              await contentsApi.deleteCommonMaster(master.seq);
                            } catch (error) {
                              console.error('Failed to delete master:', error);
                              showToast(`마스터 코드 ${master.masterCode} 삭제 실패`, 'error');
                            }
                          }
                        }
                        
                        setMasters(masters.filter(m => !selected.includes(getMasterRowId(m))));
                        setSelectedMasterIds(new Set());
                        showToast(`${selected.length}개 항목이 삭제되었습니다`, 'success');
                      }
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    삭제 ({selectedMasterIds.size})
                  </button>
                  <button
                    onClick={async () => {
                      const selected = Array.from(selectedMasterIds);
                      if (selected.length === 0) {
                        showToast('저장할 항목을 선택하세요', 'warning');
                        return;
                      }
                      
                      setLoading(true);
                      try {
                        for (const rowId of selected) {
                          const master = masters.find(m => getMasterRowId(m) === rowId);
                          if (!master) continue;
                          
                          if (master.seq) {
                            // 기존 데이터 수정
                            await contentsApi.updateCommonMaster(master.seq, master);
                          } else {
                            // 신규 데이터 생성
                            await contentsApi.createCommonMaster(master);
                          }
                        }
                        showToast(`${selected.length}개 항목이 저장되었습니다`, 'success');
                        setSelectedMasterIds(new Set());
                        loadMasters();
                      } catch (error) {
                        console.error('Failed to save masters:', error);
                        showToast('마스터 코드 저장 실패', 'error');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    저장 ({selectedMasterIds.size})
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] border border-gray-700 rounded-lg">
                <table className="w-full min-w-[980px]">
                  <thead className="bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-3 py-3 text-left text-white w-12">
                        <input
                          type="checkbox"
                          checked={selectedMasterIds.size === masters.length && masters.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMasterIds(new Set(masters.map(m => getMasterRowId(m))));
                            } else {
                              setSelectedMasterIds(new Set());
                            }
                          }}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </th>
                      <th className="px-3 py-3 text-left text-white w-36">마스터 코드</th>
                      <th className="px-3 py-3 text-left text-white w-40">이름</th>
                      <th className="px-3 py-3 text-left text-white">설명</th>
                      <th className="px-3 py-3 text-center text-white w-20">사용</th>
                      
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800">
                    {masters.length > 0 ? (
                      masters.map((master) => {
                        const masterRowId = getMasterRowId(master);
                        return (
                          <tr
                            key={masterRowId}
                            className={`border-b border-gray-700 hover:bg-gray-700 transition-colors ${
                              selectedMasterRowId === masterRowId ? 'bg-gray-700' : ''
                            }`}
                          >
                            <td className="px-3 py-3">
                              <input
                                type="checkbox"
                                checked={selectedMasterIds.has(masterRowId)}
                                onChange={(e) => {
                                  const newIds = new Set(selectedMasterIds);
                                  if (e.target.checked) {
                                    newIds.add(masterRowId);
                                  } else {
                                    newIds.delete(masterRowId);
                                  }
                                  setSelectedMasterIds(newIds);
                                }}
                                className="w-5 h-5 cursor-pointer"
                              />
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="text"
                                value={master.masterCode}
                                onChange={(e) => handleMasterFieldChange(masterRowId, 'masterCode', e.target.value)}
                                onFocus={() => handleSelectMasterRow(master)}
                                className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-full"
                              />
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="text"
                                value={master.masterName || ''}
                                onChange={(e) => handleMasterFieldChange(masterRowId, 'masterName', e.target.value)}
                                onFocus={() => handleSelectMasterRow(master)}
                                className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-full"
                              />
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="text"
                                value={master.masterDesc || ''}
                                onChange={(e) => handleMasterFieldChange(masterRowId, 'masterDesc', e.target.value)}
                                onFocus={() => handleSelectMasterRow(master)}
                                className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-full"
                              />
                            </td>
                            <td className="px-3 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={master.useYn === 'Y'}
                                onChange={(e) => handleMasterFieldChange(masterRowId, 'useYn', e.target.checked ? 'Y' : 'N')}
                                onFocus={() => handleSelectMasterRow(master)}
                                className="w-5 h-5 cursor-pointer"
                              />
                            </td>
                            
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                          데이터가 없습니다
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail 그리드 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  상세 코드 {selectedMasterCode && `(${selectedMasterCode})`}
                </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                          const tempId = createTempId();
                          setDetails([...details, {
                          seq: undefined,
                            tempId,
                          masterCode: selectedMasterCode || '',
                          detailCode: '',
                          detailName: '',
                          useYn: 'Y',
                          sortNo: details.length + 1
                        }]);
                          setSelectedDetailIds(new Set([`d:tmp:${tempId}`]));
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      추가
                    </button>
                    <button
                      onClick={async () => {
                        const selected = Array.from(selectedDetailIds);
                        if (selected.length === 0) {
                          showToast('삭제할 항목을 선택하세요', 'warning');
                          return;
                        }
                        
                        const confirmed = await showConfirm(
                          `선택한 ${selected.length}개 항목을 삭제하시겠습니까?`,
                          { type: 'danger' }
                        );
                        
                        if (confirmed) {
                          for (const rowId of selected) {
                            const detail = details.find(d => getDetailRowId(d) === rowId);
                            if (!detail) continue;
                            
                            // seq가 있는 경우만 DB에서 삭제
                            if (detail.seq) {
                              try {
                                await contentsApi.deleteCommonDetail(detail.seq);
                              } catch (error) {
                                console.error('Failed to delete detail:', error);
                                showToast(`상세 코드 ${detail.detailCode} 삭제 실패`, 'error');
                              }
                            }
                          }
                          
                          setDetails(details.filter(d => !selected.includes(getDetailRowId(d))));
                          setSelectedDetailIds(new Set());
                          showToast(`${selected.length}개 항목이 삭제되었습니다`, 'success');
                        }
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      삭제 ({selectedDetailIds.size})
                    </button>
                    <button
                      onClick={async () => {
                        const selected = Array.from(selectedDetailIds);
                        if (selected.length === 0) {
                          showToast('저장할 항목을 선택하세요', 'warning');
                          return;
                        }
                        
                        setLoading(true);
                        try {
                          for (const rowId of selected) {
                            const detail = details.find(d => getDetailRowId(d) === rowId);
                            if (!detail) continue;
                            
                            if (detail.seq) {
                              // 기존 데이터 수정
                              await contentsApi.updateCommonDetail(detail.seq, detail);
                            } else {
                              // 신규 데이터 생성
                              await contentsApi.createCommonDetail(detail);
                            }
                          }
                          showToast(`${selected.length}개 항목이 저장되었습니다`, 'success');
                          setSelectedDetailIds(new Set());
                          loadDetails(selectedMasterCode);
                        } catch (error) {
                          console.error('Failed to save details:', error);
                          showToast('상세 코드 저장 실패', 'error');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      저장 ({selectedDetailIds.size})
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] border border-gray-700 rounded-lg">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-700 sticky top-0">
                      <tr>
                        <th className="px-3 py-3 text-left text-white w-12">
                          <input
                            type="checkbox"
                            checked={selectedDetailIds.size === details.length && details.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDetailIds(new Set(details.map(d => getDetailRowId(d))));
                              } else {
                                setSelectedDetailIds(new Set());
                              }
                            }}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </th>
                        <th className="px-3 py-3 text-left text-white w-48">상세코드</th>
                        <th className="px-3 py-3 text-left text-white w-96">상세명</th>
                        <th className="px-3 py-3 text-center text-white w-20">사용</th>
                        <th className="px-3 py-3 text-center text-white w-20">순서</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800">
                      {details.length > 0 ? (
                        details.map((detail) => {
                          const detailRowId = getDetailRowId(detail);
                          return (
                            <tr
                              key={detailRowId}
                              className={`border-b border-gray-700 hover:bg-gray-700 transition-colors ${
                                selectedDetailIds.has(detailRowId) ? 'bg-gray-700' : ''
                              }`}
                            >
                              <td className="px-3 py-3">
                                <input
                                  type="checkbox"
                                  checked={selectedDetailIds.has(detailRowId)}
                                  onChange={(e) => {
                                    const newIds = new Set(selectedDetailIds);
                                    if (e.target.checked) {
                                      newIds.add(detailRowId);
                                    } else {
                                      newIds.delete(detailRowId);
                                    }
                                    setSelectedDetailIds(newIds);
                                  }}
                                  className="w-5 h-5 cursor-pointer"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  type="text"
                                  value={detail.detailCode}
                                  onChange={(e) => handleDetailFieldChange(detailRowId, 'detailCode', e.target.value)}
                                  className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-full"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  type="text"
                                  value={detail.detailName}
                                  onChange={(e) => handleDetailFieldChange(detailRowId, 'detailName', e.target.value)}
                                  className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-full"
                                />
                              </td>
                              <td className="px-3 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={detail.useYn === 'Y'}
                                  onChange={(e) => handleDetailFieldChange(detailRowId, 'useYn', e.target.checked ? 'Y' : 'N')}
                                  className="w-5 h-5 cursor-pointer"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  type="number"
                                  min="0"
                                  value={detail.sortNo}
                                  onChange={(e) => handleDetailFieldChange(detailRowId, 'sortNo', Math.max(0, parseInt(e.target.value) || 0))}
                                  className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded w-full text-center"
                                />
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                            데이터가 없습니다
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
        )}

        {/* 통계 (음식/게임/퀴즈 탭만) */}
        {activeTab !== 'common' && (
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
        )}
      </div>
    </div>
  );
}

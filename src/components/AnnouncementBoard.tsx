import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Lock, 
  Unlock, 
  FileText, 
  Image as ImageIcon, 
  Download, 
  ChevronRight, 
  Grid, 
  List, 
  Layers,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw
} from 'lucide-react';
import { NewsItem } from '../types';

interface User {
  name: string;
  role: 'admin' | 'member' | 'guest';
}

export default function AnnouncementBoard() {
  // 1. Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tbchch_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // 2. Board List State
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCategory, setSearchCategory] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  // 3. Detail & CRUD UI State
  const [selectedPost, setSelectedPost] = useState<NewsItem | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formWriter, setFormWriter] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('공지사항');
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: string }>>([]);

  const itemsPerPage = 15;

  // Initialize data
  useEffect(() => {
    const savedPosts = localStorage.getItem('tbchch_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const generated = generateMockPosts();
      setPosts(generated);
      localStorage.setItem('tbchch_posts', JSON.stringify(generated));
    }
  }, []);

  const savePostsToStorage = (updatedPosts: NewsItem[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('tbchch_posts', JSON.stringify(updatedPosts));
  };

  // Generate mock data to match screenshot (starting from 1018 downwards)
  const generateMockPosts = (): NewsItem[] => {
    const list: NewsItem[] = [];
    const viewsList = [1, 18, 24, 18, 23, 21, 35, 29, 34, 36, 41, 38, 68, 77, 91];
    
    // Generate 120 posts to give exactly 8 pages (120 / 15 = 8)
    for (let i = 0; i < 120; i++) {
      const num = 1018 - i;
      
      // Date calculation (decreasing by 7 days per post - every Sunday schedule)
      const baseDate = new Date();
      // Adjust start point to 2026-06-19
      const startDate = new Date('2026-06-19');
      startDate.setDate(startDate.getDate() - i * 7);
      
      const dateString = startDate.getFullYear() + '.' + 
        String(startDate.getMonth() + 1).padStart(2, '0') + '.' + 
        String(startDate.getDate()).padStart(2, '0');
      
      // Sunday date corresponding to this announcement
      const sundayDate = new Date(startDate);
      // Let's find the Sunday of that week (Friday + 2 days)
      sundayDate.setDate(sundayDate.getDate() + (7 - sundayDate.getDay()));
      const sundayMonth = sundayDate.getMonth() + 1;
      const sundayDay = sundayDate.getDate();
      
      const title = `[2026. ${sundayMonth}. ${sundayDay}] 모임, 목회일정, 교회소식`;
      const views = viewsList[i % viewsList.length] + Math.floor(Math.random() * 3);

      list.push({
        id: `post-${num}`,
        title: num === 1004 ? `${title} [1]` : title,
        date: dateString,
        category: '공지사항',
        writer: '서유미',
        content: `할렐루야!\n태평빛나는교회 성도 여러분의 가정과 일터 위에 주님의 평강이 가득하시기를 기원합니다.\n\n[${sundayMonth}월 ${sundayDay}일 주일 모임 및 예배 안내]\n\n1. 예배 안내\n- 1부 예배: 오전 9:10 (대성전)\n- 2부 예배: 오전 11:00 (대성전)\n- 오후 찬양예배: 오후 1:30 (대성전)\n\n2. 주중 모임\n- 수요기도회: 매주 수요일 오후 7:30\n- 금요성령기도회: 매주 금요일 오후 8:00\n- 새벽기도회: 월~금 오전 5:00\n\n3. 공지사항\n- 이번 주일 오후 예배 후에 구역 연합 예배 및 다과 모임이 준비되어 있습니다.\n- 다음 세대 여름 성경 학교 지원을 위한 봉사자 모집이 진행 중이오니 로비의 신청서 작성을 부탁드립니다.\n\n자세한 예배 내용 및 주보는 우측 상단의 첨부 파일을 다운로드하여 참고해 주시기 바랍니다.\n\n주님의 사랑 안에서 늘 강건하시길 기도합니다.\n\n태평빛나는교회 당회 드림.`,
        views: num === 1018 ? 1 : views,
        files: num % 2 === 0 
          ? [
              { name: `${sundayMonth}월_${sundayDay}일_주보.pdf`, size: '2.4 MB' },
              { name: '목회일정안내.hwp', size: '154 KB' }
            ]
          : [
              { name: `${sundayMonth}월_${sundayDay}일_주보.pdf`, size: '2.4 MB' }
            ],
        hasImage: true,
        commentsCount: num === 1004 ? 1 : 0,
        isNew: i < 3 // Mark the first 3 as new
      });
    }
    return list;
  };

  // Mock Login Handler
  const handleMockLogin = (role: 'admin' | 'member') => {
    const user: User = role === 'admin' 
      ? { name: '서유미 목사', role: 'admin' }
      : { name: '홍길동 성도', role: 'member' };
    
    setCurrentUser(user);
    localStorage.setItem('tbchch_user', JSON.stringify(user));
    setShowLoginModal(false);
    setLoginError('');
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === 'admin' && loginPassword === 'admin') {
      handleMockLogin('admin');
    } else if (loginId === 'member' && loginPassword === 'member') {
      handleMockLogin('member');
    } else {
      setLoginError('아이디 또는 비밀번호가 올바르지 않습니다. (테스트용: admin/admin 또는 member/member)');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tbchch_user');
  };

  // Reset Board Data to Default
  const handleResetData = () => {
    if (window.confirm('게시판 데이터를 초기 목업 상태로 리셋하시겠습니까? (추가/수정된 글이 사라집니다)')) {
      const generated = generateMockPosts();
      savePostsToStorage(generated);
      setCurrentPage(1);
      setSelectedPost(null);
    }
  };

  // Search filter
  const filteredPosts = posts.filter(post => {
    if (!activeSearchQuery) return true;
    const query = activeSearchQuery.toLowerCase();
    if (searchCategory === 'title') {
      return post.title.toLowerCase().includes(query);
    } else if (searchCategory === 'writer') {
      return post.writer.toLowerCase().includes(query);
    } else if (searchCategory === 'content') {
      return post.content.toLowerCase().includes(query);
    }
    return true;
  });

  // Pagination calculations
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / itemsPerPage);
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Read post with authorization check
  const handleSelectPost = (post: NewsItem) => {
    if (!currentUser) {
      alert('이 글은 권한이 부여된 사용자만 열람 가능합니다. 먼저 로그인을 해주세요.');
      setShowLoginModal(true);
      return;
    }

    // Increment View Count
    const updated = posts.map(p => {
      if (p.id === post.id) {
        const currentViews = p.views || 0;
        return { ...p, views: currentViews + 1 };
      }
      return p;
    });
    savePostsToStorage(updated);
    
    // Open detail
    setSelectedPost({ ...post, views: (post.views || 0) + 1 });
  };

  // Write new post (Admin only)
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'admin') {
      alert('글쓰기 권한이 없습니다. 관리자로 로그인하세요.');
      return;
    }

    if (!formTitle.trim()) {
      alert('제목을 입력하세요.');
      return;
    }

    const nextNumber = posts.length > 0 
      ? parseInt(posts[0].id.replace('post-', '')) + 1 
      : 1019;

    const today = new Date();
    const dateString = today.getFullYear() + '.' + 
      String(today.getMonth() + 1).padStart(2, '0') + '.' + 
      String(today.getDate()).padStart(2, '0');

    const newPost: NewsItem = {
      id: `post-${nextNumber}`,
      title: formTitle,
      date: dateString,
      category: formCategory,
      writer: formWriter || currentUser.name,
      content: formContent,
      views: 0,
      files: attachedFiles,
      hasImage: attachedFiles.some(f => /\.(jpg|jpeg|png|gif)$/i.test(f.name)),
      commentsCount: 0,
      isNew: true
    };

    const updated = [newPost, ...posts];
    savePostsToStorage(updated);

    // Reset Form
    setFormTitle('');
    setFormWriter('');
    setFormContent('');
    setAttachedFiles([]);
    setIsWriting(false);
    setCurrentPage(1); // Go to page 1 to see the new post
    
    alert('새 글이 성공적으로 등록되었습니다.');
  };

  // Edit existing post (Admin only)
  const handleUpdatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'admin' || !selectedPost) {
      alert('수정 권한이 없습니다.');
      return;
    }

    const updated = posts.map(p => {
      if (p.id === selectedPost.id) {
        return {
          ...p,
          title: formTitle,
          content: formContent,
          category: formCategory,
          writer: formWriter,
          files: attachedFiles,
          hasImage: attachedFiles.some(f => /\.(jpg|jpeg|png|gif)$/i.test(f.name))
        };
      }
      return p;
    });

    savePostsToStorage(updated);
    setSelectedPost(null);
    setIsEditing(false);
    alert('글이 수정되었습니다.');
  };

  // Delete post (Admin only)
  const handleDeletePost = (id: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      alert('삭제 권한이 없습니다.');
      return;
    }

    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      const updated = posts.filter(p => p.id !== id);
      savePostsToStorage(updated);
      setSelectedPost(null);
      alert('글이 삭제되었습니다.');
    }
  };

  // File Upload Simulation Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(file => {
        const sizeInKB = Math.round(file.size / 1024);
        const sizeStr = sizeInKB > 1024 
          ? (sizeInKB / 1024).toFixed(1) + ' MB'
          : sizeInKB + ' KB';
        return {
          name: file.name,
          size: sizeStr
        };
      });
      setAttachedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Start edit form
  const startEdit = (post: NewsItem) => {
    setFormTitle(post.title);
    setFormWriter(post.writer);
    setFormContent(post.content);
    setFormCategory(post.category);
    setAttachedFiles(post.files || []);
    setIsEditing(true);
  };

  // Page navigation helpers
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* MOCK AUTH STATUS BAR & QUICK LOGIN */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${currentUser ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {currentUser ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </div>
          <div>
            <div className="text-sm font-black text-slate-800">
              {currentUser 
                ? `로그인 상태: ${currentUser.role === 'admin' ? '✨ 관리자' : '👤 성도'} (${currentUser.name})`
                : '🔒 권한 상태: 비로그인 (비회원/새가족)'
              }
            </div>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              {currentUser 
                ? '공지사항 게시글 조회가 가능하며, 관리자는 글쓰기/수정/삭제 권한을 가집니다.'
                : '글 목록은 볼 수 있으나 상세 내용을 조회하거나 글을 쓰려면 로그인이 필요합니다.'
              }
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all"
            >
              로그아웃
            </button>
          ) : (
            <>
              <button
                onClick={() => handleMockLogin('admin')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-3 py-2 rounded-xl transition-all shadow-xs"
              >
                관리자 1초 로그인
              </button>
              <button
                onClick={() => handleMockLogin('member')}
                className="bg-slate-800 hover:bg-slate-950 text-white font-extrabold text-xs px-3 py-2 rounded-xl transition-all shadow-xs"
              >
                일반성도 1초 로그인
              </button>
              <button
                onClick={() => setShowLoginModal(true)}
                className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-extrabold text-xs px-3 py-2 rounded-xl transition-all"
              >
                아이디 로그인
              </button>
            </>
          )}
          <button
            onClick={handleResetData}
            title="게시판 초기화"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* MAIN BOARD COMPONENT */}
      {!isWriting && !isEditing ? (
        <div className="bg-white p-6 md:p-10 rounded-[35px] border border-slate-100 shadow-xl space-y-6 animate-fadeIn">
          
          {/* TITLE & HEADER CONTROLS */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">교회소식</h2>
              <p className="text-xs text-slate-400 font-light mt-1 font-mono">Home &gt; 교회소식 &gt; 알림 및 공지사항</p>
            </div>
            
            {/* Search Bar */}
            <div className="flex items-center gap-1.5 w-full md:w-auto">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-600 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-purple-400"
              >
                <option value="title">제목</option>
                <option value="writer">작성자</option>
                <option value="content">내용</option>
              </select>
              <div className="relative flex-1 md:flex-none">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveSearchQuery(searchQuery)}
                  className="w-full md:w-56 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
                <button 
                  onClick={() => setActiveSearchQuery(searchQuery)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
              {activeSearchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setActiveSearchQuery(''); }}
                  className="text-xs text-red-500 hover:text-red-700 font-extrabold px-1 shrink-0"
                >
                  초기화
                </button>
              )}
            </div>
          </div>

          {/* LAYOUT SELECTOR & METRICS */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-4">
              {/* Fake layout selector icons as shown in screenshot */}
              <div className="flex border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-slate-400">
                <button className="p-1 bg-white text-purple-600 rounded shadow-xs" title="리스트형"><List className="h-3.5 w-3.5" /></button>
                <button className="p-1 hover:text-slate-700" title="바둑판형"><Grid className="h-3.5 w-3.5" /></button>
                <button className="p-1 hover:text-slate-700" title="블로그형"><Layers className="h-3.5 w-3.5" /></button>
              </div>
              <span className="text-slate-700 font-bold">
                새글 <span className="text-purple-600 font-extrabold">1</span> / {totalPosts.toLocaleString()}
              </span>
            </div>
            
            {/* Write button shown at top too if Admin */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => {
                  setFormTitle('');
                  setFormWriter(currentUser.name);
                  setFormContent('');
                  setFormCategory('공지사항');
                  setAttachedFiles([]);
                  setIsWriting(true);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Plus className="h-3.5 w-3.5" /> 글쓰기
              </button>
            )}
          </div>

          {/* BOARD TABLE LAYOUT */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-t-2 border-b border-fuchsia-600 text-fuchsia-700 text-xs font-black bg-fuchsia-50/20">
                  <th className="py-3 px-4 text-center w-[8%] font-extrabold">번호</th>
                  <th className="py-3 px-4 text-left w-[58%] font-extrabold">제목</th>
                  <th className="py-3 px-4 text-center w-[12%] font-extrabold">작성자</th>
                  <th className="py-3 px-4 text-center w-[14%] font-extrabold">등록일</th>
                  <th className="py-3 px-4 text-center w-[8%] font-extrabold">조회수</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs md:text-sm text-slate-500">
                {currentPosts.length > 0 ? (
                  currentPosts.map((post) => {
                    const postNum = post.id.replace('post-', '');
                    return (
                      <tr 
                        key={post.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        {/* 번호 */}
                        <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-xs">
                          {postNum}
                        </td>
                        
                        {/* 제목 */}
                        <td className="py-3.5 px-4 font-normal text-slate-800">
                          <div className="flex items-center flex-wrap gap-1.5">
                            <button
                              onClick={() => handleSelectPost(post)}
                              className="text-left font-semibold text-slate-700 hover:text-blue-700 hover:underline focus:outline-none"
                            >
                              {post.title.replace(/ \[\d+\]$/, '')}
                            </button>
                            
                            {/* Comments count [1] */}
                            {post.commentsCount && post.commentsCount > 0 ? (
                              <span className="text-pink-600 font-black font-mono ml-0.5">
                                [{post.commentsCount}]
                              </span>
                            ) : null}

                            {/* Floppy file icon */}
                            {post.files && post.files.length > 0 && (
                              <span 
                                className="inline-flex items-center text-blue-600 p-0.5 bg-blue-50 border border-blue-100 rounded" 
                                title={`첨부파일: ${post.files.length}개`}
                              >
                                <FileText className="h-3 w-3" />
                              </span>
                            )}
                            
                            {/* Image icon */}
                            {post.hasImage && (
                              <span 
                                className="inline-flex items-center text-emerald-600 p-0.5 bg-emerald-50 border border-emerald-100 rounded" 
                                title="이미지 포함"
                              >
                                <ImageIcon className="h-3 w-3" />
                              </span>
                            )}

                            {/* New tag */}
                            {post.isNew && (
                              <span className="bg-orange-500 text-white font-extrabold text-[9px] px-1 rounded-sm uppercase tracking-wide leading-none py-0.5">
                                N
                              </span>
                            )}
                          </div>
                        </td>
                        
                        {/* 작성자 */}
                        <td className="py-3.5 px-4 text-center text-slate-500 font-normal">
                          {post.writer}
                        </td>
                        
                        {/* 등록일 */}
                        <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-xs">
                          {post.date}
                        </td>
                        
                        {/* 조회수 */}
                        <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-xs">
                          {post.views || 0}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      검색 조건에 맞는 게시글이 존재하지 않습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* BOTTOM REGION: WRITE BUTTON & PAGINATION */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <div className="w-20 hidden md:block" /> {/* Spacer */}
            
            {/* Classic Custom Pagination */}
            {totalPages > 0 && (
              <div className="flex items-center gap-1 text-xs">
                {/* Chevrons Left */}
                <button
                  onClick={() => handlePageClick(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronsLeft className="h-3.5 w-3.5" />
                </button>
                
                {/* Chevron Left */}
                <button
                  onClick={() => handlePageClick(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {/* Page numbers: e.g. 1 2 3 4 5 6 7 8 */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show pages around current page
                    return Math.abs(page - currentPage) < 4 || page === 1 || page === totalPages;
                  })
                  .map((page, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && page - prev > 1;
                    
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-1 text-slate-400">...</span>}
                        <button
                          onClick={() => handlePageClick(page)}
                          className={`min-w-8 h-8 font-mono text-center rounded-lg border font-bold ${
                            currentPage === page
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}

                {/* Chevron Right */}
                <button
                  onClick={() => handlePageClick(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>

                {/* Chevrons Right */}
                <button
                  onClick={() => handlePageClick(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronsRight className="h-3.5 w-3.5" />
                </button>
                
                <button
                  onClick={() => handlePageClick(totalPages)}
                  className="text-[11px] font-bold text-slate-500 hover:text-purple-600 px-1 ml-1"
                >
                  last
                </button>
              </div>
            )}

            {/* Bottom Write Button (visible to admin) */}
            <div>
              {currentUser?.role === 'admin' ? (
                <button
                  onClick={() => {
                    setFormTitle('');
                    setFormWriter(currentUser.name);
                    setFormContent('');
                    setFormCategory('공지사항');
                    setAttachedFiles([]);
                    setIsWriting(true);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Plus className="h-3.5 w-3.5" /> 글쓰기
                </button>
              ) : (
                <div className="w-20" /> // Spacer matching for layout
              )}
            </div>
          </div>

        </div>
      ) : (
        /* WRITE & EDIT FORM COMPONENT */
        <div className="bg-white p-6 md:p-10 rounded-[35px] border border-slate-100 shadow-xl space-y-6 animate-scaleUp">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-800">
              {isEditing ? '게시글 수정하기' : '새로운 교회 소식 등록'}
            </h3>
            <button 
              onClick={() => { setIsWriting(false); setIsEditing(false); }}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={isEditing ? handleUpdatePost : handleCreatePost} className="space-y-4">
            
            {/* Category & Writer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">구분</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-600 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                  <option value="공지사항">공지사항</option>
                  <option value="교회동정">교회동정</option>
                  <option value="새가족소식">새가족소식</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">작성자</label>
                <input
                  type="text"
                  placeholder="작성자 이름을 입력하세요"
                  value={formWriter}
                  onChange={(e) => setFormWriter(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">제목</label>
              <input
                type="text"
                placeholder="공지글 제목을 입력하세요..."
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">내용</label>
              <textarea
                rows={10}
                placeholder="교회 소식의 상세 정보를 작성해 주세요..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400 leading-relaxed font-light"
              />
            </div>

            {/* File Upload Attachment */}
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">첨부 파일</label>
              <p className="text-[10px] text-slate-400 font-light mb-2">교회의 주보나 소식 안내장 파일(PDF, HWP, PNG 등)을 첨부하실 수 있습니다.</p>
              
              <input
                type="file"
                multiple
                id="board-file-upload"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="board-file-upload"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-xl cursor-pointer hover:bg-purple-100 transition-all shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" /> 파일 추가
              </label>

              {/* List of attached files */}
              {attachedFiles.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {attachedFiles.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                        <span className="font-medium truncate max-w-xs md:max-w-md">{file.name}</span>
                        <span className="text-[10px] text-slate-400">({file.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachedFile(index)}
                        className="text-red-400 hover:text-red-600 p-0.5"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setIsWriting(false); setIsEditing(false); }}
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all"
              >
                작성 취소
              </button>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-2 rounded-xl shadow-xs transition-all"
              >
                {isEditing ? '수정 완료' : '글 등록'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* DETAIL VIEW MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 animate-scaleUp">
            
            {/* Header */}
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {selectedPost.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">No. {selectedPost.id.replace('post-', '')}</span>
              </div>
              <button 
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-white rounded-full p-1 hover:bg-slate-900 transition-colors"
                title="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg md:text-xl font-extrabold text-slate-900 leading-tight">
                  {selectedPost.title.replace(/ \[\d+\]$/, '')}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
                  <span>작성자: <strong className="text-slate-600">{selectedPost.writer}</strong></span>
                  <span>등록일: {selectedPost.date}</span>
                  <span>조회수: {selectedPost.views || 0}회</span>
                </div>
              </div>

              <div className="w-12 h-1 bg-purple-600 rounded-full" />
              
              {/* Main text content */}
              <div className="text-xs md:text-sm text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100 font-light whitespace-pre-line max-h-60 overflow-y-auto">
                {selectedPost.content}
              </div>

              {/* Attachments Section */}
              {selectedPost.files && selectedPost.files.length > 0 && (
                <div className="border border-slate-100 rounded-2xl p-4 bg-blue-50/20 space-y-2">
                  <span className="block text-xs font-bold text-slate-700">첨부 파일 ({selectedPost.files.length})</span>
                  <div className="space-y-1.5">
                    {selectedPost.files.map((file, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          // Simulate mock file download
                          alert(`'${file.name}' (${file.size}) 파일 다운로드를 시작합니다 (시뮬레이션).`);
                        }}
                        className="w-full flex items-center justify-between bg-white border border-blue-100 hover:border-blue-300 hover:bg-blue-50/50 rounded-xl px-4 py-2 text-xs text-slate-700 text-left transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold truncate max-w-xs md:max-w-md">{file.name}</span>
                          <span className="text-[10px] text-slate-400 font-light">({file.size})</span>
                        </div>
                        <Download className="h-4.5 w-4.5 text-slate-400 hover:text-blue-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons (Edit/Delete only for admin) */}
              <div className="pt-4 flex flex-col sm:flex-row gap-2 sm:justify-between items-center border-t border-slate-100">
                
                {/* Admin actions (Edit/Delete) */}
                {currentUser?.role === 'admin' ? (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        startEdit(selectedPost);
                        setSelectedPost(null);
                      }}
                      className="flex-1 sm:flex-none border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> 수정
                    </button>
                    <button
                      onClick={() => handleDeletePost(selectedPost.id)}
                      className="flex-1 sm:flex-none border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> 삭제
                    </button>
                  </div>
                ) : (
                  <div className="hidden sm:block w-20" /> // Spacer
                )}

                {/* Confirm/Close */}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl text-center shadow-xs transition-all"
                >
                  확인 완료
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 animate-scaleUp">
            
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
              <span className="text-sm font-bold flex items-center gap-2">
                <Lock className="h-4 w-4" /> 게시판 본인 로그인
              </span>
              <button 
                onClick={() => { setShowLoginModal(false); setLoginError(''); }}
                className="text-slate-400 hover:text-white rounded-full p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <form onSubmit={handleCustomLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">아이디</label>
                  <input
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">비밀번호</label>
                  <input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                </div>

                {loginError && (
                  <p className="text-[10px] text-red-500 font-semibold">{loginError}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs transition-all"
                >
                  로그인
                </button>
              </form>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 text-center">테스트용 계정 간편 선택</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleMockLogin('admin')}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[10.5px] py-2 rounded-xl border border-purple-200 transition-all"
                  >
                    관리자 (admin)
                  </button>
                  <button
                    onClick={() => handleMockLogin('member')}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[10.5px] py-2 rounded-xl border border-slate-200 transition-all"
                  >
                    정성도 (member)
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
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
  ArrowLeft,
  Eye,
  FileImage
} from 'lucide-react';
import { NewsItem } from '../types';

interface User {
  name: string;
  role: string;
  grade?: string;
}

interface AttachedFile {
  name: string;
  size: string;
  dataUrl?: string;
  type?: string;
}

interface AnnouncementBoardProps {
  currentUser: User | null;
  onOpenLogin: () => void;
}

export default function AnnouncementBoard({ currentUser, onOpenLogin }: AnnouncementBoardProps) {
  // 1. Board List State
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCategory, setSearchCategory] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  // 2. Detail & CRUD UI State
  const [selectedPost, setSelectedPost] = useState<NewsItem | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Preview State
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState<string>('');

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formWriter, setFormWriter] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('공지사항');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  const itemsPerPage = 15;

  // Initialize data (default to empty board, filter out '서유미' to clear cache)
  useEffect(() => {
    const savedPostsV2 = localStorage.getItem('tbchch_posts_v2');
    const savedPostsV1 = localStorage.getItem('tbchch_posts');
    
    let rawPosts: NewsItem[] = [];
    if (savedPostsV2) {
      try {
        rawPosts = JSON.parse(savedPostsV2);
      } catch {
        rawPosts = [];
      }
    } else if (savedPostsV1) {
      try {
        rawPosts = JSON.parse(savedPostsV1);
      } catch {
        rawPosts = [];
      }
    }
    
    // Safety guard: filter out any mock posts written by '서유미'
    const cleanedPosts = rawPosts.filter(p => p.writer !== '서유미');
    
    setPosts(cleanedPosts);
    localStorage.setItem('tbchch_posts_v2', JSON.stringify(cleanedPosts));
    
    // Clean up old key
    if (savedPostsV1) {
      localStorage.removeItem('tbchch_posts');
    }
  }, []);

  const savePostsToStorage = (updatedPosts: NewsItem[]) => {
    const cleaned = updatedPosts.filter(p => p.writer !== '서유미');
    setPosts(cleaned);
    localStorage.setItem('tbchch_posts_v2', JSON.stringify(cleaned));
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
  const totalPages = Math.ceil(totalPosts / itemsPerPage) || 1;
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Read post with authorization check
  const handleSelectPost = (post: NewsItem) => {
    if (!currentUser) {
      alert('이 글은 권한이 부여된 사용자만 열람 가능합니다. 먼저 로그인해 주세요.');
      onOpenLogin();
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
    
    // Open detail inline
    setSelectedPost({ ...post, views: (post.views || 0) + 1 });
  };

  // Write new post (Admin only)
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'admin') {
      alert('글쓰기 권한이 없습니다.');
      return;
    }

    if (!formTitle.trim()) {
      alert('제목을 입력하세요.');
      return;
    }

    const nextNumber = posts.length > 0 
      ? Math.max(...posts.map(p => parseInt(p.id.replace('post-', '')) || 0)) + 1 
      : 1019; // Start at 1019 to match sequential numbering

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
      files: attachedFiles as any,
      hasImage: attachedFiles.some(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name) || (f.type && f.type.startsWith('image/'))),
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
    setCurrentPage(1);
    
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
          files: attachedFiles as any,
          hasImage: attachedFiles.some(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name) || (f.type && f.type.startsWith('image/')))
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

  // File Upload with DataURL Reader for Previews
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesList = Array.from(e.target.files);
      const promises = filesList.map(file => {
        return new Promise<AttachedFile>((resolve) => {
          const sizeInKB = Math.round(file.size / 1024);
          const sizeStr = sizeInKB > 1024 
            ? (sizeInKB / 1024).toFixed(1) + ' MB'
            : sizeInKB + ' KB';
            
          const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);
          
          if (isImage) {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve({
                name: file.name,
                size: sizeStr,
                dataUrl: event.target?.result as string,
                type: file.type
              });
            };
            reader.readAsDataURL(file);
          } else {
            resolve({
              name: file.name,
              size: sizeStr,
              type: file.type
            });
          }
        });
      });

      Promise.all(promises).then((newFiles) => {
        setAttachedFiles(prev => [...prev, ...newFiles]);
      });
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startEdit = (post: NewsItem) => {
    setFormTitle(post.title);
    setFormWriter(post.writer);
    setFormContent(post.content);
    setFormCategory(post.category);
    setAttachedFiles((post.files as any) || []);
    setIsEditing(true);
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Helper to check if file is an image
  const isImageFile = (fileName: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  };

  // Helper to get preview mockup images (if uploaded file is mock or real)
  const getFilePreviewSrc = (file: AttachedFile, index: number) => {
    if (file.dataUrl) return file.dataUrl;
    
    // If no real dataUrl, provide beautiful Unsplash placeholders based on file names for mockup preview
    const mockupImages = [
      'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1512418490979-9179599339e0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600'
    ];
    return mockupImages[index % mockupImages.length];
  };

  const hasWritePermission = currentUser && currentUser.role === 'admin';

  return (
    <div className="space-y-6">

      {/* 1. WRITE OR EDIT FORM (INLINE) */}
      {(isWriting || isEditing) && (
        <div className="bg-white p-6 md:p-10 rounded-[35px] border border-slate-100 shadow-xl space-y-6 animate-scaleUp">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-800">
              {isEditing ? '게시글 수정하기' : '새로운 교회 소식 등록'}
            </h3>
            <button 
              onClick={() => { setIsWriting(false); setIsEditing(false); }}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={isEditing ? handleUpdatePost : handleCreatePost} className="space-y-4">
            
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
              <p className="text-[10px] text-slate-400 font-light mb-2">이미지 파일 첨부 시 자동으로 본문 하단에 미리보기가 추가됩니다.</p>
              
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
                        className="text-red-400 hover:text-red-600 p-0.5 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setIsWriting(false); setIsEditing(false); }}
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                작성 취소
              </button>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {isEditing ? '수정 완료' : '글 등록'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* 2. DETAIL VIEW (INLINE - REPLACES THE TABLE LIST) */}
      {!isWriting && !isEditing && selectedPost && (
        <div className="bg-white p-6 md:p-10 rounded-[35px] border border-slate-100 shadow-xl space-y-6 animate-fadeIn">
          
          {/* Header Action Button (Back to list) */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-700 font-black cursor-pointer"
            >
              <ArrowLeft className="h-4.5 w-4.5" /> 목록으로 돌아가기
            </button>
            <div className="flex items-center gap-2">
              <span className="bg-purple-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                {selectedPost.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">No. {selectedPost.id.replace('post-', '')}</span>
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 leading-tight">
              {selectedPost.title.replace(/ \[\d+\]$/, '')}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
              <span>작성자: <strong className="text-slate-700">{selectedPost.writer}</strong></span>
              <span className="w-px h-3 bg-slate-200 self-center" />
              <span>등록일: {selectedPost.date}</span>
              <span className="w-px h-3 bg-slate-200 self-center" />
              <span>조회수: {selectedPost.views || 0}회</span>
            </div>
          </div>

          <div className="w-16 h-1.5 bg-purple-600 rounded-full" />
          
          {/* Main text content */}
          <div className="text-xs md:text-sm text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100 font-light whitespace-pre-line">
            {selectedPost.content}
          </div>

          {/* MATERIAL/FILE PREVIEW SECTION */}
          {selectedPost.files && (selectedPost.files as any).length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileImage className="h-4 w-4 text-purple-600" />
                첨부 자료 미리보기 ({(selectedPost.files as any).length})
              </h4>
              
              {/* Previews Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(selectedPost.files as any).map((file: AttachedFile, idx: number) => {
                  const isImage = isImageFile(file.name);
                  const previewSrc = getFilePreviewSrc(file, idx);
                  
                  return (
                    <div 
                      key={idx}
                      className="group relative border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 aspect-square shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      {/* Image Thumbnail */}
                      {isImage ? (
                        <div className="flex-1 relative overflow-hidden bg-slate-200">
                          <img 
                            src={previewSrc} 
                            alt={file.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            onClick={() => {
                              setPreviewImage(previewSrc);
                              setPreviewFileName(file.name);
                            }}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" /> 크게 보기
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-100">
                          <FileText className="h-8 w-8 text-blue-500 mb-2" />
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{file.name.split('.').pop() || 'FILE'}</span>
                        </div>
                      )}
                      
                      {/* File Name & Download Bar */}
                      <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-1.5">
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold text-slate-700 truncate" title={file.name}>
                            {file.name}
                          </span>
                          <span className="block text-[8px] text-slate-400 font-light mt-0.5">{file.size}</span>
                        </div>
                        <button
                          onClick={() => alert(`'${file.name}' (${file.size}) 파일 다운로드를 시작합니다.`)}
                          className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-purple-600 rounded-lg transition-all cursor-pointer"
                          title="다운로드"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Action buttons */}
          <div className="pt-6 flex flex-col sm:flex-row gap-3 sm:justify-between items-center border-t border-slate-100">
            {hasWritePermission ? (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    startEdit(selectedPost);
                    setSelectedPost(null);
                  }}
                  className="flex-1 sm:flex-none border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" /> 수정
                </button>
                <button
                  onClick={() => handleDeletePost(selectedPost.id)}
                  className="flex-1 sm:flex-none border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> 삭제
                </button>
              </div>
            ) : (
              <div className="hidden sm:block w-20" />
            )}

            <button
              onClick={() => setSelectedPost(null)}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl text-center shadow-xs transition-all cursor-pointer"
            >
              목록으로
            </button>
          </div>

        </div>
      )}

      {/* 3. MAIN BOARD LIST TABLE */}
      {!isWriting && !isEditing && !selectedPost && (
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
              <div className="flex border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-slate-400">
                <button className="p-1 bg-white text-purple-600 rounded shadow-xs" title="리스트형"><List className="h-3.5 w-3.5" /></button>
                <button className="p-1 hover:text-slate-700" title="바둑판형"><Grid className="h-3.5 w-3.5" /></button>
                <button className="p-1 hover:text-slate-700" title="블로그형"><Layers className="h-3.5 w-3.5" /></button>
              </div>
              <span className="text-slate-700 font-bold">
                새글 <span className="text-purple-600 font-extrabold">{posts.filter(p => p.isNew).length}</span> / {totalPosts.toLocaleString()}
              </span>
            </div>
            
            {hasWritePermission && (
              <button
                onClick={() => {
                  setFormTitle('');
                  setFormWriter(currentUser?.name || '');
                  setFormContent('');
                  setFormCategory('공지사항');
                  setAttachedFiles([]);
                  setIsWriting(true);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
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
                        <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-xs">
                          {postNum}
                        </td>
                        
                        <td className="py-3.5 px-4 font-normal text-slate-800">
                          <div className="flex items-center flex-wrap gap-1.5">
                            <button
                              onClick={() => handleSelectPost(post)}
                              className="text-left font-semibold text-slate-700 hover:text-blue-700 hover:underline focus:outline-none cursor-pointer"
                            >
                              {post.title.replace(/ \[\d+\]$/, '')}
                            </button>
                            
                            {post.commentsCount && post.commentsCount > 0 ? (
                              <span className="text-pink-600 font-black font-mono ml-0.5">
                                [{post.commentsCount}]
                              </span>
                            ) : null}

                            {post.files && post.files.length > 0 && (
                              <span 
                                className="inline-flex items-center text-blue-600 p-0.5 bg-blue-50 border border-blue-100 rounded" 
                                title={`첨부파일: ${post.files.length}개`}
                              >
                                <FileText className="h-3 w-3" />
                              </span>
                            )}
                            
                            {post.hasImage && (
                              <span 
                                className="inline-flex items-center text-emerald-600 p-0.5 bg-emerald-50 border border-emerald-100 rounded" 
                                title="이미지 포함"
                              >
                                <ImageIcon className="h-3 w-3" />
                              </span>
                            )}

                            {post.isNew && (
                              <span className="bg-orange-500 text-white font-extrabold text-[9px] px-1 rounded-sm uppercase tracking-wide leading-none py-0.5 animate-pulse">
                                N
                              </span>
                            )}
                          </div>
                        </td>
                        
                        <td className="py-3.5 px-4 text-center text-slate-500 font-normal">
                          {post.writer}
                        </td>
                        
                        <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-xs">
                          {post.date}
                        </td>
                        
                        <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-xs">
                          {post.views || 0}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400 font-light leading-relaxed">
                      등록된 게시글이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* BOTTOM REGION: WRITE BUTTON & PAGINATION */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <div className="w-20 hidden md:block" />
            
            {totalPages > 1 && (
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => handlePageClick(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronsLeft className="h-3.5 w-3.5" />
                </button>
                
                <button
                  onClick={() => handlePageClick(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => Math.abs(page - currentPage) < 4 || page === 1 || page === totalPages)
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

                <button
                  onClick={() => handlePageClick(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => handlePageClick(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronsRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <div>
              {hasWritePermission ? (
                <button
                  onClick={() => {
                    setFormTitle('');
                    setFormWriter(currentUser?.name || '');
                    setFormContent('');
                    setFormCategory('공지사항');
                    setAttachedFiles([]);
                    setIsWriting(true);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> 글쓰기
                </button>
              ) : (
                <div className="w-20" />
              )}
            </div>
          </div>

        </div>
      )}

      {/* 4. LIGHTBOX PREVIEW MODAL */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 z-55 animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-4 text-white">
            <span className="text-xs font-bold">{previewFileName}</span>
            <button 
              onClick={() => setPreviewImage(null)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <img 
            src={previewImage} 
            alt="Expanded Preview" 
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
          <div className="mt-4 text-slate-400 text-xs flex gap-4">
            <span>클릭하여 닫기</span>
          </div>
        </div>
      )}

    </div>
  );
}

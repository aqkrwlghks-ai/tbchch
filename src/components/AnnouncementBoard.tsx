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
import { saveFileToDB, getFileFromDB, deleteFilesForPost } from '../utils/fileDb';

interface User {
  name: string;
  role: string;
  grade?: string;
}

interface AttachedFile {
  name: string;
  size: string;
  dataUrl?: string;
  googleDriveId?: string;
  type?: string;
}

function parseGoogleDriveLink(url: string): string | null {
  const matchD = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];

  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return matchId[1];

  const matchOpen = url.match(/open\?id=([a-zA-Z0-9_-]+)/);
  if (matchOpen && matchOpen[1]) return matchOpen[1];

  return null;
}

interface AnnouncementBoardProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  boardType?: 'news' | 'bulletin';
  googleDriveApiUrl?: string;
}

const defaultBulletins: NewsItem[] = [
  {
    id: 'bulletin-1002',
    title: '금주의 주보 (2026년 6월 둘째 주)',
    date: '2026.06.07',
    category: '주보',
    writer: '미디어부',
    content: '은혜 가득한 예배 주보 및 구역 성경 공부 가이드북을 다운로드하셔서 가정에서도 묵상과 연합의 은혜를 확장하시기 바랍니다.',
    files: [
      { name: '주보_2026-06-07.pdf', size: '1.2 MB' }
    ] as any,
    hasImage: false,
    commentsCount: 0,
    isNew: false
  },
  {
    id: 'bulletin-1001',
    title: '금주의 주보 (2026년 5월 다섯째 주)',
    date: '2026.05.31',
    category: '주보',
    writer: '미디어부',
    content: '5월 다섯째 주 예배 주보입니다.',
    files: [
      { name: '주보_2026-05-31.pdf', size: '1.2 MB' }
    ] as any,
    hasImage: false,
    commentsCount: 0,
    isNew: false
  }
];

export default function AnnouncementBoard({ currentUser, onOpenLogin, boardType = 'news', googleDriveApiUrl }: AnnouncementBoardProps) {
  const storageKey = boardType === 'bulletin' ? 'tbchch_bulletins' : 'tbchch_posts_v2';
  // 1. Board List State
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
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

  // Loaded file data URLs state
  const [fileDataUrls, setFileDataUrls] = useState<Record<string, string>>({});

  // Track which post is being edited
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  useEffect(() => {
    if (boardType === 'bulletin') {
      setFormCategory('주보');
    } else {
      setFormCategory('공지사항');
    }
  }, [boardType]);

  const canEditPost = (post: NewsItem | null) => {
    if (!post || !currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return post.writer === currentUser.name;
  };

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formWriter, setFormWriter] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('공지사항');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  const itemsPerPage = 15;

  // Initialize data (default to empty board/default bulletins, filter out '서유미' to clear cache)
  useEffect(() => {
    const savedPosts = localStorage.getItem(storageKey);
    
    let rawPosts: NewsItem[] = [];
    if (savedPosts) {
      try {
        rawPosts = JSON.parse(savedPosts);
      } catch {
        rawPosts = [];
      }
    } else {
      // If empty and it is bulletin board, initialize with default bulletins
      if (boardType === 'bulletin') {
        rawPosts = defaultBulletins;
      }
    }
    
    // Safety guard: filter out any mock posts written by '서유미'
    let cleanedPosts = rawPosts.filter(p => p.writer !== '서유미');

    // Migration: Migrate any embedded file dataUrl from localStorage to IndexedDB to free space
    let needsSave = false;
    cleanedPosts = cleanedPosts.map(post => {
      if (post.files && post.files.length > 0) {
        let postModified = false;
        const cleanedFiles = (post.files as any).map((file: any) => {
          if (file.dataUrl) {
            // Save to IndexedDB asynchronously
            saveFileToDB(post.id, file.name, file.dataUrl).catch(err => {
              console.error(`Migration failed for ${post.id} ${file.name}:`, err);
            });
            postModified = true;
            needsSave = true;
            const { dataUrl, ...rest } = file;
            return rest;
          }
          return file;
        });
        if (postModified) {
          return { ...post, files: cleanedFiles };
        }
      }
      return post;
    });
    
    setPosts(cleanedPosts);
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(cleanedPosts));
    } catch (e) {
      console.error('Failed to save initial posts to localStorage:', e);
    }
    
    // Clean up old key if news board
    if (boardType === 'news') {
      const savedPostsV1 = localStorage.getItem('tbchch_posts');
      if (savedPostsV1) {
        localStorage.removeItem('tbchch_posts');
      }
    }

    // --- FETCH FROM GOOGLE SPREADSHEET (GAS WEB APP) ---
    if (googleDriveApiUrl) {
      setLoading(true);
      fetch(`${googleDriveApiUrl}?action=getPosts&type=${boardType}`)
        .then(res => res.json())
        .then(serverPosts => {
          if (Array.isArray(serverPosts)) {
            const isValidPosts = serverPosts.length === 0 || (serverPosts[0] && 'title' in serverPosts[0]);
            if (isValidPosts) {
              const cleanedServerPosts = serverPosts.filter(p => p.writer !== '서유미');
              setPosts(cleanedServerPosts);
              localStorage.setItem(storageKey, JSON.stringify(cleanedServerPosts));
            } else {
              console.warn('Received invalid posts data format from Google Sheets API, skipping sync.');
            }
          }
        })
        .catch(err => {
          console.error('Failed to fetch posts from Google Sheets:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [boardType, storageKey, googleDriveApiUrl]);

  // Fetch file DataURLs from IndexedDB when a post is selected
  useEffect(() => {
    if (selectedPost && selectedPost.files) {
      const loadUrls = async () => {
        const urls: Record<string, string> = {};
        for (const file of (selectedPost.files as any)) {
          try {
            const dataUrl = await getFileFromDB(selectedPost.id, file.name);
            if (dataUrl) {
              urls[file.name] = dataUrl;
            }
          } catch (err) {
            console.error('Failed to get file from IndexedDB:', err);
          }
        }
        setFileDataUrls(urls);
      };
      loadUrls();
    } else {
      setFileDataUrls({});
    }
  }, [selectedPost]);

  const savePostsToStorage = (updatedPosts: NewsItem[]) => {
    const cleaned = updatedPosts.filter(p => p.writer !== '서유미');
    setPosts(cleaned);
    try {
      localStorage.setItem(storageKey, JSON.stringify(cleaned));
    } catch (e) {
      console.error('Failed to save posts to localStorage:', e);
      alert('저장 용량이 초과되어 로컬 저장소 저장에 실패했습니다. 페이지를 새로고침하여 불필요한 데이터를 정리한 후 다시 시도해 주세요.');
    }

    // --- POST TO GOOGLE SPREADSHEET (GAS WEB APP) ---
    if (googleDriveApiUrl) {
      fetch(googleDriveApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          action: 'savePosts',
          type: boardType,
          posts: cleaned
        })
      })
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.success) {
          console.log('Successfully synced posts to Google Sheets.');
        } else {
          console.error('Failed to sync posts response:', resData);
        }
      })
      .catch(err => {
        console.error('Failed to sync posts to Google Sheets:', err);
      });
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

    const postId = `post-${nextNumber}`;

    // Store file data in IndexedDB and strip dataUrl from localStorage list
    attachedFiles.forEach(file => {
      if (file.dataUrl) {
        saveFileToDB(postId, file.name, file.dataUrl).catch(err => {
          console.error('Failed to save file to IndexedDB:', err);
        });
      }
    });

    const filesWithoutDataUrl = attachedFiles.map(({ name, size, type, googleDriveId }) => ({ name, size, type, googleDriveId }));

    const newPost: NewsItem = {
      id: postId,
      title: formTitle,
      date: dateString,
      category: formCategory,
      writer: formWriter || currentUser.name,
      content: formContent,
      views: 0,
      files: filesWithoutDataUrl as any,
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

  // Edit existing post (Admin or Author)
  const handleUpdatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editingPostId) {
      alert('수정 권한이 없습니다.');
      return;
    }

    const postToUpdate = posts.find(p => p.id === editingPostId);
    if (!postToUpdate || !canEditPost(postToUpdate)) {
      alert('수정 권한이 없습니다.');
      return;
    }

    // Store file data in IndexedDB and strip dataUrl from localStorage list
    attachedFiles.forEach(file => {
      if (file.dataUrl) {
        saveFileToDB(editingPostId, file.name, file.dataUrl).catch(err => {
          console.error('Failed to save file to IndexedDB:', err);
        });
      }
    });

    const filesWithoutDataUrl = attachedFiles.map(({ name, size, type, googleDriveId }) => ({ name, size, type, googleDriveId }));

    const updated = posts.map(p => {
      if (p.id === editingPostId) {
        return {
          ...p,
          title: formTitle,
          content: formContent,
          category: formCategory,
          writer: formWriter,
          files: filesWithoutDataUrl as any,
          hasImage: attachedFiles.some(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name) || (f.type && f.type.startsWith('image/')))
        };
      }
      return p;
    });

    savePostsToStorage(updated);
    setEditingPostId(null);
    setIsEditing(false);
    alert('글이 수정되었습니다.');
  };

  // Delete post (Admin or Author)
  const handleDeletePost = (id: string) => {
    if (!currentUser) {
      alert('삭제 권한이 없습니다.');
      return;
    }

    const postToDelete = posts.find(p => p.id === id);
    if (!postToDelete || !canEditPost(postToDelete)) {
      alert('삭제 권한이 없습니다.');
      return;
    }

    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      const updated = posts.filter(p => p.id !== id);
      savePostsToStorage(updated);
      deleteFilesForPost(id).catch(err => {
        console.error('Failed to delete files from IndexedDB:', err);
      });
      setSelectedPost(null);
      alert('글이 삭제되었습니다.');
    }
  };

  // File Upload with DataURL Reader for Previews
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesList = Array.from(e.target.files);
      const promises = filesList.map((file: File) => {
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
    setEditingPostId(post.id);
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
    if (file.googleDriveId) return `https://docs.google.com/uc?export=download&id=${file.googleDriveId}`;
    
    // If no real dataUrl, provide beautiful Unsplash placeholders based on file names for mockup preview
    const mockupImages = [
      'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600'
    ];
    return mockupImages[index % mockupImages.length];
  };

  const handleDownload = async (file: AttachedFile, index: number) => {
    if (file.googleDriveId) {
      const directUrl = `https://docs.google.com/uc?export=download&id=${file.googleDriveId}`;
      window.open(directUrl, '_blank');
      return;
    }
    const dataUrl = fileDataUrls[file.name] || file.dataUrl;
    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Mockup download
      const previewSrc = getFilePreviewSrc(file, index);
      if (previewSrc && previewSrc.startsWith('http')) {
        try {
          const response = await fetch(previewSrc);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = file.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        } catch (e) {
          window.open(previewSrc, '_blank');
        }
      } else {
        alert(`'${file.name}' 파일의 데이터를 찾을 수 없습니다.`);
      }
    }
  };

  const hasWritePermission = currentUser && currentUser.role === 'admin';

  return (
    <div className="space-y-6">

      {/* 1. WRITE OR EDIT FORM (INLINE) */}
      {(isWriting || isEditing) && (
        <div className="bg-white p-6 md:p-10 rounded-[35px] border border-slate-100 shadow-xl space-y-6 animate-scaleUp">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-800">
              {isEditing ? (boardType === 'bulletin' ? '주보 수정하기' : '게시글 수정하기') : (boardType === 'bulletin' ? '새로운 주보 등록' : '새로운 교회 소식 등록')}
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
              {boardType !== 'bulletin' ? (
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
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">구분</label>
                  <input
                    type="text"
                    value="주보"
                    disabled
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-400 bg-slate-50 focus:outline-none font-bold"
                  />
                </div>
              )}
              
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

              <button
                type="button"
                onClick={() => {
                  const url = prompt('구글 드라이브 공유 링크를 입력하세요:');
                  if (!url) return;
                  const fileId = parseGoogleDriveLink(url);
                  if (!fileId) {
                    alert('올바른 구글 드라이브 링크가 아닙니다. 공유 링크를 다시 확인해 주세요.');
                    return;
                  }
                  const name = prompt('파일의 이름을 확장자 포함하여 입력하세요 (예: 영화설교_자료.jpg):', '영화설교_자료.jpg');
                  if (!name) return;
                  
                  const newDriveFile: AttachedFile = {
                    name,
                    size: '구글 드라이브',
                    googleDriveId: fileId,
                    type: isImageFile(name) ? 'image/jpeg' : 'application/octet-stream'
                  };
                  setAttachedFiles(prev => [...prev, newDriveFile]);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-xl cursor-pointer hover:bg-purple-100 transition-all shadow-xs ml-2"
              >
                <Plus className="h-3.5 w-3.5" /> 구글 드라이브 링크 추가
              </button>

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
                  const dataUrl = fileDataUrls[file.name] || file.dataUrl;
                  const previewSrc = dataUrl || getFilePreviewSrc(file, idx);
                  
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
                          onClick={() => handleDownload(file, idx)}
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
            {canEditPost(selectedPost) ? (
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
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {boardType === 'bulletin' ? '주보' : '교회소식'}
              </h2>
              <p className="text-xs text-slate-400 font-light mt-1 font-mono">
                {boardType === 'bulletin' ? 'Home > 교회소식 > 주보' : 'Home > 교회소식 > 알림 및 공지사항'}
              </p>
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
                  setFormCategory(boardType === 'bulletin' ? '주보' : '공지사항');
                  setAttachedFiles([]);
                  setIsWriting(true);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> {boardType === 'bulletin' ? '주보 올리기' : '글쓰기'}
              </button>
            )}
          </div>

          {/* BOARD TABLE LAYOUT */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-t-2 border-b border-fuchsia-600 text-fuchsia-700 text-xs font-black bg-fuchsia-50/20">
                  <th className="py-3 px-4 text-center w-[8%] font-extrabold">번호</th>
                  <th className="py-3 px-4 text-left w-[58%] font-extrabold">
                    {boardType === 'bulletin' ? '주보 제목' : '제목'}
                  </th>
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
                ) : loading ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400 font-light leading-relaxed">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-slate-400">목록을 불러오는 중...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400 font-light leading-relaxed">
                      {boardType === 'bulletin' ? '등록된 주보가 없습니다.' : '등록된 게시글이 없습니다.'}
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
                    setFormCategory(boardType === 'bulletin' ? '주보' : '공지사항');
                    setAttachedFiles([]);
                    setIsWriting(true);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> {boardType === 'bulletin' ? '주보 올리기' : '글쓰기'}
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

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight, 
  Calendar, 
  Play, 
  CheckCircle, 
  Sparkles, 
  ChevronRight, 
  AlertCircle, 
  BookOpen, 
  Heart, 
  Users, 
  GraduationCap, 
  FileText, 
  User,
  ChevronDown,
  Volume2,
  Map,
  ArrowUp,
  Download,
  ExternalLink,
  FolderOpen,
  Home,
  Smile,
  ShoppingBag,
  ShieldCheck,
  Car
} from 'lucide-react';
import { gnbMenuData, bannerSlogans, worshipSchedules, sermonData, churchNews, galleryPhotos, polishedPastorMessage } from '../data';
import { MenuItem, SermonItem, NewsItem } from '../types';
import mainChurchImg from '../main-church.jpg';
import slide2 from '../slide2.jpg';
import slide3 from '../slide3.jpg';
import slide4 from '../slide4.jpg';
import slide5 from '../slide5.jpg';
import crossBg from '../cross_bg.png';
import prayerHandsBg from '../prayer_hands_bg.png';
import skyBg from '../sky_bg.png';
import pastorPortrait from '../pastor_portrait.png';

interface ChurchHomeProps {
  activeSloganId: string;
  selectedFontCombo: number;
  onOpenPlanning: () => void;
}

const bgSliderImages = [
  mainChurchImg,
  slide2,
  slide3,
  slide4,
  slide5
];

// 구글 앱스 스크립트 웹앱 배포 URL (여기에 발급받으신 웹앱 URL을 입력하시면 구글 드라이브와 자동 연동됩니다)
const GOOGLE_DRIVE_API_URL = 'https://script.google.com/macros/s/AKfycbyplnfEvCxHfD-eNk6GMsIe0OeQeIEL1TM0P6CUIjMZrY7_HqmJsEoCQxNhqx_jbREC/exec';

// 오늘의 묵상글 연동 링크 (여기에 연동하고자 하시는 묵상글 링크를 입력하세요)
const TODAY_MEDITATION_LINK = 'https://script.google.com/macros/s/AKfycbyplnfEvCxHfD-eNk6GMsIe0OeQeIEL1TM0P6CUIjMZrY7_HqmJsEoCQxNhqx_jbREC/exec';

const getLocalCategories = () => {
  return [
    {
      id: 'local-cat-1',
      name: '교회학교',
      coverUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800',
      albums: [
        {
          id: 'local-alb-1',
          title: '주일 학교 은혜 가득한 소그룹 성경공부',
          date: '2026-06-07',
          coverUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800',
          photos: [
            'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1456406644174-8dba4c7f7d2c?auto=format&fit=crop&q=80&w=800'
          ]
        }
      ]
    },
    {
      id: 'local-cat-2',
      name: '예배사진',
      coverUrl: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=800',
      albums: [
        {
          id: 'local-alb-2',
          title: '본 예배당 성전 꽃꽂이 감사 봉사',
          date: '2026-05-18',
          coverUrl: 'https://images.unsplash.com/photo-1456406644174-8dba4c7f7d2c?auto=format&fit=crop&q=80&w=800',
          photos: [
            'https://images.unsplash.com/photo-1456406644174-8dba4c7f7d2c?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=800'
          ]
        }
      ]
    },
    {
      id: 'local-cat-3',
      name: '청청',
      coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
      albums: [
        {
          id: 'local-alb-3',
          title: '청년 연합 야외 가을 묵상제',
          date: '2026-06-01',
          coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
          photos: [
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
          ]
        }
      ]
    },
    {
      id: 'local-cat-4',
      name: '행사사진',
      coverUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
      albums: [
        {
          id: 'local-alb-4',
          title: '여신도회 주관 나눔과 섬김 반찬 배달',
          date: '2026-05-25',
          coverUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
          photos: [
            'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800'
          ]
        }
      ]
    }
  ];
};

export default function ChurchHome({ 
  activeSloganId, 
  selectedFontCombo,
  onOpenPlanning 
}: ChurchHomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [activeVideo, setActiveVideo] = useState<SermonItem | null>(null);
  const [bulletinModalOpen, setBulletinModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Custom dialogs/forms
  const [newFamilyFormOpen, setNewFamilyFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [activeValue, setActiveValue] = useState<number | null>(null);

  // User Authentication States
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('tbch_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'users' | 'families'>('users');

  // Initialize mock database for users and default admins
  useEffect(() => {
    try {
      if (!localStorage.getItem('tbch_users')) {
        const defaultUsers = [
          {
            username: 'jehee',
            name: '김제희',
            password: '1234',
            gender: '남성',
            denomination: '대한예수교장로회(합동)',
            phone: '010-1111-2222',
            role: 'admin',
            grade: '정회원',
            createdAt: new Date().toISOString()
          },
          {
            username: 'aqkrwlghks',
            name: '박지환',
            password: '1234',
            gender: '남성',
            denomination: '대한예수교장로회(합동)',
            phone: '010-3333-4444',
            role: 'admin',
            grade: '정회원',
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem('tbch_users', JSON.stringify(defaultUsers));
      }

      if (!localStorage.getItem('tbch_new_families')) {
        const dummyFamilies = [
          {
            id: 1,
            name: '이영희',
            phone: '010-9999-8888',
            note: '양재동 거주, 스스로 등록 신청',
            registeredAt: new Date().toISOString()
          }
        ];
        localStorage.setItem('tbch_new_families', JSON.stringify(dummyFamilies));
      }
    } catch (e) {
      console.error('Failed to initialize mock localStorage database:', e);
    }
  }, []);

  const coreValues = [
    {
      title: '하나님 사랑 복음',
      number: '01',
      icon: Sparkles,
      accentColor: 'emerald',
      bgLight: 'bg-emerald-50/50',
      borderCol: 'border-emerald-200/60',
      badgeBg: 'bg-emerald-500/10 text-emerald-700',
      textAccent: 'text-[#659b41]',
      shadowGlow: 'hover:shadow-emerald-100',
      scriptures: [
        { ref: '신명기 6:4~5', text: '이스라엘아 들으라 우리 하나님 여호와는 오직 유일한 여호와이시니 너는 마음을 다하고 뜻을 다하고 힘을 다하여 네 하나님 여호와를 사랑하라' },
        { ref: '로마서 1:16~17', text: '내가 복음을 부끄러워하지 아니하노니 이 복음은 모든 믿는 자에게 구원을 주시는 하나님의 능력이 됨이라... 복음에는 하나님의 의가 나타나서 믿음으로 믿음에 이르게 하나니' }
      ],
      description: '오직 하나님의 사랑과 십자가 복음만을 자랑하며, 그 복음의 능력으로 영혼을 살리고 회복시키는 구원의 통로가 됩니다.'
    },
    {
      title: '예배',
      number: '02',
      icon: BookOpen,
      accentColor: 'blue',
      bgLight: 'bg-blue-50/50',
      borderCol: 'border-blue-200/60',
      badgeBg: 'bg-blue-500/10 text-blue-700',
      textAccent: 'text-blue-600',
      shadowGlow: 'hover:shadow-blue-100',
      scriptures: [
        { ref: '이사야 43:21', text: '이 백성은 내가 나를 위하여 지었나니 나를 찬송하게 하려 함이니라' },
        { ref: '요한복음 4:23', text: '아버지께 참되게 예배하는 자들은 영과 진리로 예배할 때가 오나니 곧 이 때라 아버지께서는 자기에게 이렇게 예배하는 자들을 찾으시느니라' },
        { ref: '로마서 12:1', text: '너희 몸을 하나님이 기뻐하시는 거룩한 산 제물로 드리라 이는 너희가 드릴 영적 예배니라' }
      ],
      description: '하나님의 임재를 경험하는 감격이 있고 영과 진리로 드리는 공적인 예배와, 매일의 삶을 거룩한 산 제물로 드리는 삶의 예배를 드립니다.'
    },
    {
      title: '가정·교육',
      number: '03',
      icon: Home,
      accentColor: 'amber',
      bgLight: 'bg-amber-50/50',
      borderCol: 'border-amber-200/60',
      badgeBg: 'bg-amber-500/10 text-amber-700',
      textAccent: 'text-amber-600',
      shadowGlow: 'hover:shadow-amber-100',
      scriptures: [
        { ref: '신명기 6:6~9', text: '오늘 내가 네게 명하는 이 말씀을 너는 마음에 새기고 네 자녀에게 부지런히 가르치며 집에 앉았을 때에든지 길을 갈 때에든지 누워 있을 때에든지 일어날 때에든지 이 말씀을 강론할 것이며' }
      ],
      description: '가정을 주님이 세우신 최초의 교회이자 축복의 터전으로 세우고, 다음세대 자녀들을 하나님의 말씀과 사랑으로 부지런히 가르쳐 영적 지도자로 길러냅니다.'
    },
    {
      title: '교회·제자',
      number: '04',
      icon: Users,
      accentColor: 'indigo',
      bgLight: 'bg-indigo-50/50',
      borderCol: 'border-indigo-200/60',
      badgeBg: 'bg-indigo-500/10 text-indigo-700',
      textAccent: 'text-indigo-600',
      shadowGlow: 'hover:shadow-indigo-100',
      scriptures: [
        { ref: '마태복음 16:18', text: '내가 이 반석 위에 내 교회를 세우리니 음부의 권세가 이기지 못하리라' }
      ],
      description: '예수 그리스도를 머리로 한 건강한 믿음의 공동체이자 반석 위에 서서 음부의 권세를 이기는 교회를 이루며, 철저한 말씀 훈련을 통해 세상 속 제자로 파송합니다.'
    },
    {
      title: '전도/섬김',
      number: '05',
      icon: Heart,
      accentColor: 'rose',
      bgLight: 'bg-rose-50/50',
      borderCol: 'border-rose-200/60',
      badgeBg: 'bg-rose-500/10 text-rose-700',
      textAccent: 'text-rose-600',
      shadowGlow: 'hover:shadow-rose-100',
      scriptures: [
        { ref: '마가복음 16:15', text: '너희는 온 천하에 다니며 만민에게 복음을 전파하라' },
        { ref: '요한복음 13:34~35', text: '새 계명을 너희에게 주노니 서로 사랑하라... 너희가 서로 사랑하면 이로써 모든 사람이 너희가 내 제자인 줄 알리라' },
        { ref: '마태복음 5:16', text: '이같이 너희 빛이 사람 앞에 비치게 하여 그들로 너희 착한 행실을 보고 하늘에 계신 너희 아버지께 영광을 돌리게 하라' }
      ],
      description: '천하보다 귀한 생명을 구원하기 위해 힘써 복음을 전하며, 예수님의 마음으로 이웃의 아픔을 보듬고 착한 행실과 사랑으로 지역 사회를 섬깁니다.'
    },
    {
      title: '지상명령 선교',
      number: '06',
      icon: Map,
      accentColor: 'red',
      bgLight: 'bg-red-50/50',
      borderCol: 'border-red-200/60',
      badgeBg: 'bg-red-500/10 text-red-700',
      textAccent: 'text-red-600',
      shadowGlow: 'hover:shadow-red-100',
      scriptures: [
        { ref: '마태복음 28:18~20', text: '하늘과 땅의 모든 권세를 내게 주셨으니 그러므로 너희는 가서 모든 민족을 제자로 삼아... 내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라 볼지어다 내가 세상 끝날까지 너희와 항상 함께 있으리라' }
      ],
      description: '예수님의 마지막 유언이자 지상명령을 따라 열방을 향해 나아가 모든 민족을 제자로 삼으며, 주님의 임재와 평강을 땅 끝까지 흘려보냅니다.'
    }
  ];

  // 오늘의 묵상 팝업 상태
  const [meditationOpen, setMeditationOpen] = useState(false);

  useEffect(() => {
    // 오늘 하루 이 창 열지 않기 여부 확인
    const todayStr = new Date().toISOString().slice(0, 10);
    const hideMeditation = localStorage.getItem(`hideMeditationPopup_${todayStr}`);
    if (!hideMeditation) {
      setMeditationOpen(true);
    }
  }, []);

  const handleCloseMeditation = (hideToday: boolean) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (hideToday) {
      localStorage.setItem(`hideMeditationPopup_${todayStr}`, 'true');
    }
    setMeditationOpen(false);
  };

  type PageType = 
    | 'home' | 'about' | 'greeting' | 'vision' | 'worship' 
    | 'sermon-sunday' | 'sermon-wednesday' | 'sermon-friday' | 'praise-wednesday' | 'praise-friday'
    | 'meditation-life' | 'mission-group' | 'home-worship'
    | 'kids-school' | 'youth-adults'
    | 'announcement' | 'activity-gallery' | 'form-archive'
    | 'member-business' | 'car-transportation' | 'safety-guide' | 'admin';

  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const getFilteredSermons = () => {
    switch (currentPage) {
      case 'sermon-sunday':
        return sermonData.filter(s => s.type === '주일설교');
      case 'sermon-wednesday':
        return sermonData.filter(s => s.type === '수요설교');
      case 'sermon-friday':
        return sermonData.filter(s => s.type === '금요설교');
      case 'praise-wednesday':
        return sermonData.filter(s => s.type === '수요찬양');
      case 'praise-friday':
        return sermonData.filter(s => s.type === '금요찬양');
      default:
        return sermonData;
    }
  };
  const filteredSermons = getFilteredSermons();

  const getNavigationTarget = (link: string): { page: PageType; hash?: string } => {
    if (!link.startsWith('#')) {
      return { page: 'home' };
    }
    const id = link.substring(1);
    switch (id) {
      case 'welcome-section':
        return { page: 'about' };
      case 'pastor-welcome':
        return { page: 'greeting' };
      case 'new-family':
        return { page: 'about' };
      case 'vision-guide':
        return { page: 'vision' };
        
      case 'nextgen-section':
        return { page: 'kids-school' };
      case 'kids-school':
        return { page: 'kids-school' };
      case 'youth-adults':
        return { page: 'youth-adults' };
        
      case 'community-intro':
        return { page: 'meditation-life' };
      case 'meditation-life':
        return { page: 'meditation-life' };
      case 'mission-group':
        return { page: 'mission-group' };
      case 'home-worship':
        return { page: 'home-worship' };
        
      case 'schedule-section':
      case 'worship-time':
        return { page: 'worship' };
        
      case 'sermon-section':
        return { page: 'sermon-sunday' };
      case 'sermon-sunday':
        return { page: 'sermon-sunday' };
      case 'sermon-wednesday':
        return { page: 'sermon-wednesday' };
      case 'sermon-friday':
        return { page: 'sermon-friday' };
      case 'praise-wednesday':
        return { page: 'praise-wednesday' };
      case 'praise-friday':
        return { page: 'praise-friday' };
        
      case 'news-section':
        return { page: 'announcement' };
      case 'announcement':
        return { page: 'announcement' };
      case 'gallery-section':
        return { page: 'activity-gallery' };
      case 'activity-gallery':
        return { page: 'activity-gallery' };
      case 'form-archive':
        return { page: 'form-archive' };
        
      case 'member-business':
        return { page: 'member-business' };
      case 'car-transportation':
        return { page: 'car-transportation' };
      case 'safety-guide':
        return { page: 'safety-guide' };
        
      case 'footer-map':
      case 'church-map':
        return { page: 'about', hash: 'footer-map' };
        
      default:
        return { page: 'home' };
    }
  };

  const navigateToPage = (page: PageType, hash?: string) => {
    setCurrentPage(page);
    setActiveVideo(null);
    setMobileMenuOpen(false);
    
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const headerOffset = 85;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link.startsWith('http')) {
      return; // External links
    }
    e.preventDefault();
    const { page, hash } = getNavigationTarget(link);
    navigateToPage(page, hash);
  };

  const renderPermissionLock = (requiredGrade: '정회원' | '로그인') => {
    const isNotLoggedIn = !currentUser;
    const isInsufficientGrade = currentUser && requiredGrade === '정회원' && currentUser.grade !== '정회원' && currentUser.role !== 'admin';

    if (isNotLoggedIn) {
      return (
        <div className="relative overflow-hidden bg-slate-50 py-20 min-h-[60vh] flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-150 shadow-xl max-w-md w-full text-center space-y-6">
            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">로그인이 필요합니다</h3>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                이 페이지는 빛나는교회 등록 성도 전용 공간입니다.<br />
                로그인 하신 후 더 많은 서비스를 안전하게 이용해 보세요.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setLoginModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                성도 로그인하기
              </button>
              <button
                onClick={() => setSignupModalOpen(true)}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs py-3 rounded-xl transition-all"
              >
                신규 회원가입 신청
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (isInsufficientGrade) {
      return (
        <div className="relative overflow-hidden bg-slate-50 py-20 min-h-[60vh] flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-150 shadow-xl max-w-md w-full text-center space-y-6">
            <div className="h-16 w-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">정회원 등급 권한이 필요합니다</h3>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                현재 성도님의 등급은 <strong className="text-blue-600">{currentUser.grade}</strong>입니다.<br />
                이 페이지는 <strong className="text-indigo-900">정회원</strong> 등급 이상만 열람이 가능합니다.<br />
                사무처 또는 관리자(김제희, 박지환)에게 등급 승인을 요청하세요.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => navigateToPage('home')}
                className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                홈페이지 메인으로 가기
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Subpage Hero Banner
  const renderSubHero = () => {
    let title = '';
    let description = '';
    switch (currentPage) {
      case 'greeting':
        title = '목사님 인사말';
        description = '그리스도의 몸 된 지체로 오신 당신을 주님의 이름으로 축복합니다.';
        break;
      case 'about':
        title = '교회 소개';
        description = '오직 예수 복음의 능력과 따뜻한 섬김을 통해 하나님의 눈부신 영광을 비추는 영적 예배 공동체입니다.';
        break;
      case 'vision':
        title = '핵심 가치';
        description = '빛나는 교회가 지향하는 6대 핵심 가치와 신앙 비전입니다.';
        break;
      case 'worship':
        title = '예배 안내';
        description = '매주 혹은 매일 성령의 역사하심과 화평한 성도의 교제가 피어나는 거룩한 예배 시간표를 안내합니다.';
        break;
      case 'sermon-sunday':
        title = '주일설교';
        description = '빛나는교회 주일 공동체 대예배 설교 말씀을 전해드립니다.';
        break;
      case 'sermon-wednesday':
        title = '수요설교';
        description = '주일 말씀의 은혜를 주중 삶으로 이어가는 수요 성경강설입니다.';
        break;
      case 'sermon-friday':
        title = '금요설교';
        description = '뜨거운 연합 기도회와 은혜 가득한 금요 성경 나눔 말씀입니다.';
        break;
      case 'praise-wednesday':
        title = '수요찬양';
        description = '수요예배를 더욱 영광스럽게 비추는 빛나는교회 찬양대의 은혜로운 고백입니다.';
        break;
      case 'praise-friday':
        title = '금요찬양';
        description = '금요기도회를 채우는 뜨거운 성령의 임재와 은혜로운 경배 찬양입니다.';
        break;
      case 'meditation-life':
        title = '묵상과 삶 (소그룹)';
        description = '매주 삶의 묵상과 소통을 통해 은혜의 강물로 나아가는 소그룹방입니다.';
        break;
      case 'mission-group':
        title = '남·여전도회 연합';
        description = '연령별 신도회 친교와 교류를 통해 이웃 사랑을 실천하는 사역 연합회입니다.';
        break;
      case 'home-worship':
        title = '가정 및 구역 예배';
        description = '가정의 화평과 구역원 간의 든든한 신앙적 보살핌을 위한 연합 예배입니다.';
        break;
      case 'kids-school':
        title = '교회학교 (어린이)';
        description = '예수님의 따스한 인격을 배우며 꿈을 키우는 영유치·초등부 예배 공동체입니다.';
        break;
      case 'youth-adults':
        title = '청청 공동체 (청소년&청년)';
        description = '10대와 대학 청년들의 복음 정체성을 든든히 세우는 역동적인 젊은이 예배입니다.';
        break;
      case 'announcement':
        title = '알림 및 공지사항';
        description = '빛나는교회의 최신 공지, 행사 알림 및 주요 주간 교회 소식을 전해드립니다.';
        break;
      case 'activity-gallery':
        title = '갤러리 (교회활동)';
        description = '성도들의 아름다운 만남과 나눔, 교회의 교제 현장을 사진첩으로 공유합니다.';
        break;
      case 'form-archive':
        title = '서식 자료실';
        description = '온라인 신앙 신청 서식 원본 및 주보 다운로드를 신속히 지원합니다.';
        break;
      case 'member-business':
        title = '교우 기업 소식';
        description = '성도님들이 운영하시는 업종과 복된 일터를 서로 소개하고 응원합니다.';
        break;
      case 'car-transportation':
        title = '셔틀 및 차량 운행';
        description = '주일 오전 성도님들의 편안하고 기품있는 성전 이동을 돕는 운행 시간표입니다.';
        break;
      case 'safety-guide':
        title = '안전 및 편의 위원회';
        description = '가장 쾌적하고 안전한 교회 생활과 보조 지원을 위해 묵묵히 봉사하는 부서입니다.';
        break;
      default:
        return null;
    }

    return (
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 md:py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 bg-no-repeat" 
          style={{ backgroundImage: `url('${skyBg}')` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 to-slate-950/95" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            {currentPage.toUpperCase()}
          </span>
          <h1 className="text-3xl md:text-4.5xl font-black tracking-tight text-white mt-2">{title}</h1>
          <p className="text-xs md:text-sm text-slate-350 font-medium max-w-xl mx-auto leading-relaxed">{description}</p>
          <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full mt-3" />
        </div>
      </section>
    );
  };


  // 구글 드라이브 연동용 갤러리 카테고리 상태 및 로딩 상태
  const [galleryCategories, setGalleryCategories] = useState<any[]>(getLocalCategories());
  const [loadingGallery, setLoadingGallery] = useState(false);

  // Dynamic automatic image transition
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bgSliderImages.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // 구글 드라이브 실시간 갤러리 연동 Fetch
  useEffect(() => {
    if (!GOOGLE_DRIVE_API_URL) return;

    setLoadingGallery(true);
    fetch(GOOGLE_DRIVE_API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGalleryCategories(data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch gallery categories from Google Drive:', err);
      })
      .finally(() => {
        setLoadingGallery(false);
      });
  }, []);

  // Monitor scroll for "back to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentSlogan = bannerSlogans.find(s => s.id === activeSloganId) || bannerSlogans[0];

  // Dynamic Font Styling for Demoing Live Fonts in planning!
  const getFontStyle = () => {
    switch (selectedFontCombo) {
      case 0:
        return {
          header: 'font-sans tracking-tight',
          body: 'font-sans',
        };
      case 1:
        return {
          header: 'font-serif tracking-normal leading-relaxed',
          body: 'font-sans text-stone-700',
        };
      case 2:
        return {
          header: 'font-serif font-semibold tracking-wide',
          body: 'font-sans tracking-wide',
        };
      default:
        return {
          header: 'font-sans',
          body: 'font-sans',
        };
    }
  };

  const fontStyle = getFontStyle();

  return (
    <div className={`min-h-screen bg-slate-50 relative ${fontStyle.body}`}>
      
      {/* 1. CHURCH AUDIO SOUND EFFECT BANNER (MICRO-ACTION WITH USER GREETING) */}
      <div className="bg-slate-900 border-b border-white/10 text-slate-300 text-xs py-2 px-4 shadow-sm z-40 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span><strong>예수님이 주인이신 빛나는 교회</strong></span>
          </div>
        </div>
      </div>

      {/* 2. HEADER & NAVIGATION (GNB) */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md shadow-md z-30 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Elegant Church Brand Logo */}
            <a href="#" onClick={(e) => { e.preventDefault(); navigateToPage('home'); }} className="flex items-center gap-2.5 shrink-0 group">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-700 to-indigo-900 shadow-lg group-hover:scale-105 transition-transform">
                {/* Custom glowing cross SVG icon */}
                <svg className="w-8 h-8 text-white filter drop-shadow-[0px_0px_5px_rgba(255,255,255,0.7)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-6-8h12" />
                </svg>
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full border border-blue-400 opacity-30 animate-ping"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                  빛나는 교회
                </span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono font-bold leading-none">
                  The Brightening Church
                </span>
              </div>
            </a>

            {/* Desktop Navigation (GNB) with beautiful interactive hovers */}
            <nav className="hidden lg:flex items-center gap-1">
              {gnbMenuData.map((menu) => (
                <div 
                  key={menu.id} 
                  className="relative group py-2"
                  onMouseEnter={() => setActiveDropdown(menu.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a 
                    href={menu.link}
                    onClick={(e) => handleNavigation(e, menu.link)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-slate-800 hover:text-blue-700 hover:bg-slate-50 text-[14.5px] font-bold tracking-tight transition-all"
                  >
                    {menu.name}
                    <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-blue-700 transition-transform group-hover:rotate-180" />
                  </a>

                  {/* Submenu Drawer */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="absolute top-0 left-1/4 -mt-1 w-3 h-3 bg-white border-t border-l border-slate-100 transform rotate-45 -translate-x-1/2"></div>
                    {menu.subMenu?.map((sub) => (
                      <a
                        key={sub.id}
                        href={sub.link}
                        target={sub.link.startsWith('http') ? '_blank' : undefined}
                        rel={sub.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        onClick={(e) => handleNavigation(e, sub.link)}
                        className="flex items-center justify-between px-5 py-2 text-[13px] text-slate-600 hover:text-blue-700 hover:bg-blue-50 font-medium transition-colors"
                      >
                        <span>{sub.name}</span>
                        {sub.link.startsWith('http') && <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-blue-700" />}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            {/* Right Action Widgets (Authentication Only) */}
            <div className="hidden lg:flex items-center gap-3 animate-fadeIn">
              {/* Authentication Widgets */}
              <div className="flex items-center gap-2 pl-1">
                {currentUser ? (
                  <div className="flex items-center gap-2.5">
                    <div className="flex flex-col text-right">
                      <span className="text-[11.5px] font-black text-slate-900 leading-none">
                        {currentUser.name} {currentUser.role === 'admin' ? '관리자' : currentUser.grade}님
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium tracking-tight mt-0.5">환영합니다</span>
                    </div>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => navigateToPage('admin' as any)}
                        className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          currentPage === 'admin'
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
                        }`}
                      >
                        관리자 모드
                      </button>
                    )}
                    <button
                      onClick={() => {
                        localStorage.removeItem('tbch_current_user');
                        setCurrentUser(null);
                        navigateToPage('home');
                        alert('로그아웃 완료: 평안한 하루 되십시오.');
                      }}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 border border-slate-200/50 text-slate-600 font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setLoginModalOpen(true)}
                      className="text-xs text-slate-700 hover:text-blue-700 font-bold px-3 py-2 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      로그인
                    </button>
                    <span className="text-slate-300 text-xs">|</span>
                    <button
                      onClick={() => setSignupModalOpen(true)}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3.5 py-2 rounded-lg shadow-sm hover:scale-102 active:scale-98 transition-all cursor-pointer"
                    >
                      회원가입
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-700 hover:text-blue-700 focus:outline-none p-2 rounded-lg hover:bg-slate-100 transition-colors"
                title="메인 메뉴 열기"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Sidebar overlay dropdowns */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white py-3 px-4 shadow-inner space-y-2 animate-fadeIn max-h-[80vh] overflow-y-auto">
            {/* Mobile User Authentication Section */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2 mb-2 text-left">
              {currentUser ? (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900">
                      {currentUser.name} {currentUser.role === 'admin' ? '관리자' : currentUser.grade}님
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">빛나는교회에 오신 것을 환영합니다</span>
                  </div>
                  <div className="flex gap-1.5">
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigateToPage('admin' as any);
                        }}
                        className="text-[10.5px] bg-blue-600 text-white font-extrabold px-2.5 py-1.5 rounded-md shadow-sm cursor-pointer"
                      >
                        관리자
                      </button>
                    )}
                    <button
                      onClick={() => {
                        localStorage.removeItem('tbch_current_user');
                        setCurrentUser(null);
                        setMobileMenuOpen(false);
                        navigateToPage('home');
                        alert('로그아웃 완료: 평안한 하루 되십시오.');
                      }}
                      className="text-[10.5px] bg-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-md cursor-pointer"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500">서비스 이용을 위해 로그인해주세요.</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setLoginModalOpen(true);
                      }}
                      className="text-xs bg-slate-200 text-slate-800 font-bold px-3 py-2 rounded-lg cursor-pointer"
                    >
                      로그인
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setSignupModalOpen(true);
                      }}
                      className="text-xs bg-blue-600 text-white font-extrabold px-3 py-2 rounded-lg cursor-pointer"
                    >
                      회원가입
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Youtube Action in mobile prominent placement */}
            <div className="p-2">
              <a 
                href="https://www.youtube.com/@TheBrighteningchurch"
                target="_blank"
                referrerPolicy="no-referrer"
                className="w-full flex items-center justify-center gap-2 bg-rose-600 text-white font-extrabold text-sm py-3 rounded-lg shadow-sm"
              >
                <Youtube className="h-5 w-5 fill-white animate-bounce" />
                <span>빛나는교회 공식 유튜브 가기</span>
              </a>
            </div>

            {gnbMenuData.map((menu) => (
              <div key={menu.id} className="border-b border-slate-50 pb-2">
                <span className="block px-3 py-1.5 text-[15px] font-extrabold text-slate-900 bg-slate-50 rounded">
                  {menu.name}
                </span>
                <div className="ml-3 mt-1 grid grid-cols-2 gap-1.5 pl-2">
                  {menu.subMenu?.map((sub) => (
                    <a
                      key={sub.id}
                      href={sub.link}
                      target={sub.link.startsWith('http') ? '_blank' : undefined}
                      rel={sub.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        handleNavigation(e, sub.link);
                      }}
                      className="flex items-center justify-between px-2 py-1.5 text-[12.5px] text-slate-600 hover:text-blue-700 font-medium bg-slate-50/40 rounded transition-all"
                    >
                      <span>• {sub.name}</span>
                      {sub.link.startsWith('http') && <ExternalLink className="h-3 w-3 text-slate-400" />}
                    </a>
                  ))}
                </div>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-2 pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setBulletinModalOpen(true);
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <FileText className="h-4 w-4 text-blue-600" />
                주보 다운로드
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPlanning();
                }}
                className="w-full bg-blue-50 text-blue-800 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-blue-100"
              >
                <Sparkles className="h-4 w-4 text-blue-600" />
                기획 제안서
              </button>
            </div>
          </div>
        )}
      </header>

      {currentPage === 'home' && (
        <>
          {/* 3. HERO HERO CAROUSEL BANNER (With Yeoju Church Style ARC-CLIP CURVED BOTTOM) */}
          <section className="relative bg-slate-900 text-white min-h-[520px] md:min-h-[580px] lg:min-h-[630px] flex flex-col justify-between overflow-hidden">
        
        {/* Dynamic sliding background imagery */}
        <div className="absolute inset-0 z-0">
          {bgSliderImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out bg-cover ${
                idx === 0 ? 'bg-[30%_top]' : 'bg-center'
              } ${
                currentSlide === idx ? 'opacity-75 scale-105' : 'opacity-0 scale-100'
              }`}
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-slate-950/65 to-slate-950/85" />
        </div>

        {/* Top-Right/Left slider control arrow mocks */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
          <button 
            onClick={() => setCurrentSlide(prev => (prev - 1 + bgSliderImages.length) % bgSliderImages.length)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full hover:scale-110 transition-transform text-white border border-white/10"
            title="이전 슬라이드"
          >
            <svg className="w-6 h-6" fill="black" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
          <button 
            onClick={() => setCurrentSlide(prev => (prev + 1) % bgSliderImages.length)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full hover:scale-110 transition-transform text-white border border-white/10"
            title="다음 슬라이드"
          >
            <svg className="w-6 h-6" fill="black" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24 text-center flex-1 flex flex-col justify-center items-center">
          
          {/* Slogan Theme Tag */}
          <span className="bg-amber-500/20 text-yellow-400 border border-amber-500/30 font-sans tracking-widest text-[11px] font-black uppercase px-3 py-1 rounded-full mb-6 py-1.5 animate-pulse">
            ★ TBCH THEME : {currentSlogan.tag}
          </span>

          {/* Slogan Title */}
          <h1 className={`text-3xl md:text-5xl lg:text-5xl font-black tracking-tight mb-4 text-white drop-shadow-md leading-tight max-w-4xl text-center ${fontStyle.header}`}>
            {currentSlogan.title}
          </h1>

          {/* Slogan Description */}
          <p className="text-sm md:text-lg text-slate-200 max-w-2xl leading-relaxed font-light mb-8 opacity-95">
            {currentSlogan.subTitle}
          </p>

          {/* Scripture Verse Box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 max-w-2xl backdrop-blur-sm shadow-xl flex flex-col gap-1">
            <span className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Today Scripture Promise</span>
            <p className="text-xs md:text-sm font-serif italic text-slate-100 max-w-lg mx-auto leading-relaxed">
              {currentSlogan.verse}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
            <a 
              href="#sermon-section" 
              onClick={(e) => handleNavigation(e, '#sermon-section')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-xs font-black shadow-lg transition-transform hover:-translate-y-0.5 inline-flex items-center gap-1.5"
            >
              <span>주일 예배영상 바로보기</span>
              <Play className="h-3 w-3 fill-white" />
            </a>
            <button
              onClick={onOpenPlanning}
              className="bg-transparent hover:bg-white/10 text-slate-300 hover:text-white border border-slate-500/40 px-5 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-1"
            >
              <span>카피라이터 시안 교체</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2 justify-center mt-12">
            {bgSliderImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${currentSlide === idx ? 'w-6 bg-blue-500' : 'w-1.5 bg-white/20'}`}
                title={`슬라이드 ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* THE UNIQUE YEOJU CHURCH ARC-CLIP EFFECT LAYER */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-50 arc-clip pointer-events-none z-10"></div>
      </section>

      {/* 4. OVERLAPPING QUICK LINK CARDS (Yeoju Church Benchmarked Centerpiece) */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-10 sm:-mt-12 md:-mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD 1: 금주의 주보 */}
          <button 
            onClick={() => setBulletinModalOpen(true)}
            className="bg-white hover:bg-slate-50 text-slate-800 rounded-2xl p-6 shadow-xl border border-slate-150 transition-all hover:scale-[1.02] flex flex-col justify-between group min-h-[160px] text-left"
          >
            <div className="flex justify-between items-start w-full">
              <div className="rounded-xl bg-blue-50 text-blue-700 p-3.5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <FileText className="h-6 w-6" />
              </div>
              <span className="bg-blue-100 text-blue-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full">LIVE PDF</span>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">금주의 주보</h3>
              <p className="text-xs text-slate-500 mt-1">예배 주보 및 교회 주요 동정을 한 눈에 읽어봅니다.</p>
            </div>
          </button>

          {/* CARD 2: 예배시간표 바로보기 */}
          <a
            href="#schedule-section"
            onClick={(e) => handleNavigation(e, '#schedule-section')}
            className="bg-blue-900 text-white rounded-2xl p-6 shadow-xl border border-blue-950 transition-all hover:scale-[1.02] flex flex-col justify-between group min-h-[160px] text-left"
          >
            <div className="flex justify-between items-start w-full">
              <div className="rounded-xl bg-white/10 text-white p-3.5 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <Clock className="h-6 w-6" />
              </div>
              <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full">SCHEDULE</span>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-extrabold text-white group-hover:text-amber-400 transition-colors">예배시간 안내</h3>
              <p className="text-xs text-slate-200 mt-1">각 예배 계층별 예배 시간과 전 성전 처소를 확인하세요.</p>
            </div>
          </a>

          {/* CARD 3: 유튜브 바로가기 */}
          <a
            href="https://www.youtube.com/@TheBrighteningchurch"
            target="_blank"
            referrerPolicy="no-referrer"
            className="bg-white hover:bg-slate-50 text-slate-800 rounded-2xl p-6 shadow-xl border border-slate-150 transition-all hover:scale-[1.02] flex flex-col justify-between group min-h-[160px] text-left"
          >
            <div className="flex justify-between items-start w-full">
              <div className="rounded-xl bg-red-50 text-red-600 p-3.5 group-hover:bg-red-600 group-hover:text-white transition-all">
                <Youtube className="h-6 w-6 fill-current" />
              </div>
              <span className="bg-rose-100 text-rose-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">YOUTUBE</span>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-extrabold text-slate-900 group-hover:text-red-600 transition-colors">유튜브 방송국</h3>
              <p className="text-xs text-slate-500 mt-1">주일 대예배 실시간 스트리밍 시청 및 지난 아카이브 보기.</p>
            </div>
          </a>

        </div>
      </div>
        </>
      )}

      {currentPage !== 'home' && currentPage !== 'greeting' && currentPage !== 'worship' && currentPage !== 'admin' && renderSubHero()}

      {/* 5. WELCOME SECTION (Pastor's Remodeled Greeting + 4 core grids) */}
      {currentPage === 'home' && (
        <section className="relative overflow-hidden bg-white py-16 md:py-24" id="welcome-section">
        {/* Faded wooden cross watermark on the right */}
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-contain bg-no-repeat opacity-[0.06] pointer-events-none mix-blend-multiply hidden md:block" 
          style={{ backgroundImage: `url('${crossBg}')`, backgroundPosition: 'right center' }}
        />
        {/* Faint center church outline logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0">
          <svg className="w-[400px] h-[400px] text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-blue-600 font-extrabold bg-blue-50 px-3 py-1.5 rounded-full">Welcome greeting</span>
          <h2 className="text-2xl md:text-3.5xl font-black tracking-tight text-slate-950 mt-3 md:mt-4 leading-normal">
            빛나는 교회에 오신 것을 영적으로 진심으로 기뻐합니다
          </h2>
          <div className="w-12 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Pastor greeting details */}
        <div id="pastor-welcome" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 pb-16 border-b border-slate-200">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-1">
              <Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
              <span className="text-amber-700 font-extrabold text-sm tracking-tight font-sans">목사님의 축복 인사</span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
              {polishedPastorMessage.headline}
            </h3>
            
            <p className="text-xs text-slate-400 font-bold tracking-normal uppercase border-l-2 border-blue-600 pl-2.5">
              {polishedPastorMessage.subHeadline}
            </p>

            <div className="text-slate-600 leading-relaxed text-sm md:text-[14.5px] space-y-4 font-light">
              {polishedPastorMessage.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Quick Registration Button */}
            <div className="pt-3">
              <button
                onClick={() => setNewFamilyFormOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3 rounded-full shadow-md flex items-center gap-1.5"
              >
                <span>새가족 등록 및 온라인 등록 안내</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Vector Graphics Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center justify-center text-center py-12 overflow-hidden">
              {/* Background light ring */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-200/50 filter blur-xl"></div>
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-indigo-200/50 filter blur-xl"></div>

              {/* Glowing vector church cross logo */}
              <div className="relative bg-white rounded-full p-6 shadow-md mb-6 inline-flex border border-slate-100">
                <svg className="w-16 h-16 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>

              <h4 className="text-lg font-black text-slate-800">우리가 세상의 눈부신 빛입니다</h4>
              <p className="text-xs text-slate-500 mt-2 max-w-sm">
                “형제가 연합하여 동거함이 어찌 그리 좋은가.” 세상 가장 따스하고 안전한 양육 정원, 빛나는 교회에서 당신의 온 만남을 준비 중입니다.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-200 w-full grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-black text-blue-900">7개</div>
                  <span className="text-[10px] text-slate-400 font-bold font-sans">예배 부서 및 모임</span>
                </div>
                <div>
                  <div className="text-lg font-black text-blue-900">100%</div>
                  <span className="text-[10px] text-slate-400 font-bold font-sans">말씀 중심 연합 케어</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Yeoju Church 4 major value layouts */}
        <div id="vision-guide" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: 목사님 인사말 */}
          <div 
            onClick={() => navigateToPage('greeting')}
            className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-md flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 hover:border-emerald-100 transition-all duration-300 cursor-pointer"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <Smile className="h-5 w-5 text-emerald-600" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">목사님 인사말</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                그리스도의 몸 된 지체로 빛나는교회에 오신 당신을 예수님의 사랑으로 축복하며 기쁘게 환영합니다.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 text-xs font-bold text-emerald-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              인사말 보기 <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 2: 교회 소개 */}
          <div 
            onClick={() => navigateToPage('about')}
            className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-md flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 hover:border-blue-100 transition-all duration-300 cursor-pointer"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">교회 소개</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                오직 예수 복음의 능력과 사랑의 섬김으로 하나님의 찬란한 영광을 비추는 영적 예배 공동체입니다.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 text-xs font-bold text-blue-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              소개 보기 <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 3: 예배 안내 */}
          <div 
            onClick={() => navigateToPage('worship')}
            className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-md flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 hover:border-amber-100 transition-all duration-300 cursor-pointer"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">예배 안내</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                성령의 역사하심과 따뜻한 성도의 교제가 피어나는 주일 예배 및 평일 기도회 시간 안내입니다.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 text-xs font-bold text-amber-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              시간표 보기 <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 4: 핵심 가치 */}
          <div 
            onClick={() => navigateToPage('vision')}
            className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-md flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 hover:border-purple-100 transition-all duration-300 cursor-pointer"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">핵심 가치</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                빛나는교회가 오직 복음 위에 굳게 서서 하나님 나라를 세워가는 6대 신앙 비전입니다.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 text-xs font-bold text-purple-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              6대 가치 보기 <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

        </div>
      </div>
      </section>
      )}

      {/* 5-A. GREETING PAGE VIEW */}
      {currentPage === 'greeting' && (
        <section className="relative overflow-hidden bg-white py-12 md:py-16 animate-fadeIn" id="pastor-welcome-page">
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumb Header */}
            <div className="flex justify-between items-end border-b border-slate-200 pb-3 mb-10">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 font-sans">인사말</h2>
              <span className="text-[11px] md:text-xs text-slate-400 font-medium font-sans">HOME &gt; 빛나는교회 &gt; 인사말</span>
            </div>

            {/* Headline */}
            <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-snug mb-10 tracking-tight text-left">
              성령의 능력 안에서 <span className="text-[#659b41]">복음</span>과 <span className="text-[#659b41]">섬김</span>으로<br className="hidden md:block" />
              하나님의 영광을 드러내는 <span className="text-[#3b5998]">빛나는 교회</span> <span className="text-slate-400 text-xs md:text-sm font-light font-sans tracking-normal">(사43:21,고후5:18)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              
              {/* Left Column: Photo + Caption */}
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="w-full max-w-[260px] border border-slate-200 p-1 bg-white shadow-sm rounded-sm">
                  <img 
                    src={pastorPortrait} 
                    alt="김제희 목사" 
                    className="w-full h-auto object-cover rounded-sm"
                  />
                </div>
                <span className="text-xs md:text-sm text-slate-700 font-sans font-bold mt-4 tracking-tight text-center">
                  빛나는교회 목사 <span className="text-slate-950 font-extrabold">김제희</span>
                </span>
              </div>

              {/* Right Column: Greetings Content */}
              <div className="md:col-span-8 space-y-6 text-slate-800 leading-relaxed text-[13.5px] md:text-[14.5px] font-sans font-normal tracking-wide text-left">
                <p>
                  안녕하십니까?<br />
                  빛나는 교회 오신 것을 환영하고 축복합니다.
                </p>

                <div>
                  <p className="text-slate-500">하나님께서 시편133편1절에서 이렇게 말씀하십니다.</p>
                  <p className="text-[#659b41] font-extrabold text-[14px] md:text-[15px] mt-1">
                    “보라 형제가 연합하여 동거함이 어찌 그리 선하고 아름다운지요”
                  </p>
                </div>

                <p>
                  하나님께서 삼위일체로 존재하십니다.<br />
                  하나님께서도 공동체로 존재하시는 것입니다.<br />
                  그래서 하나님께서 공동체(가정&amp;교회)를 창조하셨습니다.<br />
                  함께하는 것을<br />
                  기뻐하셨기 때문입니다.<br />
                  이런 이유로<br />
                  사람은 각각 예수 그리스도를 통해 구원받아야할 뿐 아니라<br />
                  함께함으로<br />
                  연합함으로<br />
                  공동체(가정과 교회)를 이루어야 하는 것입니다.<br />
                  사람은 건강한 공동체 안에 거할 때<br />
                  참된 보호와 성숙과 안정을 경험하게 됩니다.<br />
                  예수님 안에서<br />
                  서로 사랑하고 섬겨<br />
                  그리스도의 몸을 이루고<br />
                  사명과 비전을 온전히 감당할 수 있게 되는 것입니다.
                </p>

                <p>
                  사람이 교회입니다.<br />
                  당신이 바로 교회입니다.<br />
                  당신은 소중한 사람입니다.<br />
                  함께 그리스도의 몸으로 불러 주신<br />
                  주님을 찬송합니다. 할렐루야.
                </p>

                <p>
                  당신을 환영하고 사랑하고 축복합니다.
                </p>

                <p className="pt-4 text-[14px] md:text-[15px] text-slate-900">
                  <span className="font-extrabold">김제희 목사와 성도 일동</span>
                </p>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 5-B. CHURCH ABOUT (INTRO) PAGE VIEW */}
      {currentPage === 'about' && (
        <section className="relative overflow-hidden bg-white py-16 md:py-24 animate-fadeIn" id="about-church-page">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none z-0">
            <svg className="w-[400px] h-[400px] text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-blue-600 font-extrabold bg-blue-50 px-3 py-1.5 rounded-full">About The Brightening Church</span>
              <h2 className="text-2xl md:text-3.5xl font-black tracking-tight text-slate-950 mt-3 md:mt-4 leading-normal">
                빛나는 교회에 오신 것을 영적으로 진심으로 기뻐합니다
              </h2>
              <div className="w-12 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              <div className="lg:col-span-7 space-y-8">
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-700 font-extrabold text-sm uppercase tracking-wider">
                    <Sparkles className="h-4.5 w-4.5 text-blue-600" />
                    <span>교회 비전 및 표어</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">“성령의 능력 안에서 복음과 섬김으로 하나님의 영광을 드러내는 공동체”</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    빛나는 교회는 이 시대의 방황하는 영혼들에게 참된 평안과 예수 그리스도의 복음의 소망을 전하고자 세워진 공동체입니다. 
                    우리는 온 성도가 하나님의 복음을 풍성히 누리며 서로 사랑으로 연합하고 세상을 향해 가진 사랑을 흘려보내는 거룩한 처소입니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-sm uppercase tracking-wider">
                    <Heart className="h-4.5 w-4.5 text-indigo-600" />
                    <span>빛나는 교회의 이름 뜻</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    우리는 세상의 소금이자 어두운 세상을 환히 비추는 <strong>'눈부신 빛(The Brightening Church)'</strong>으로 부름을 받았습니다. 
                    주님의 말씀이 우리를 날마다 새롭게 빛내시며, 우리 또한 주변 이웃과 지역 사회, 나아가 전 세계에 하나님의 찬란한 소망과 사랑을 반사하는 통로가 되길 지향합니다.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-150 space-y-4">
                  <h4 className="text-md font-extrabold text-slate-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>새가족 등록 안내 (Welcome Process)</span>
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    빛나는 교회의 정식 등록 교우가 되기 위한 새가족 과정은 다음과 같이 구성되어 있습니다. 
                    등록을 원하시는 성도님들은 예배당 로비의 새가족부 부스로 문의하시거나 하단의 온라인 링크를 통해 편리하게 등록 신청을 하실 수 있습니다.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-2 font-medium">
                    <li className="flex items-center gap-1.5">• <strong>1주차:</strong> 만남과 환영 (교회 안내 및 등록 접수)</li>
                    <li className="flex items-center gap-1.5">• <strong>2주차:</strong> 믿음의 기초 (예수 그리스도와 복음의 의미)</li>
                    <li className="flex items-center gap-1.5">• <strong>3주차:</strong> 공동체의 축복 (교회와 성도의 거룩한 연합)</li>
                    <li className="flex items-center gap-1.5">• <strong>4주차:</strong> 사명으로 전진 (구역 배정 및 소그룹 활동 시작)</li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => setNewFamilyFormOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>온라인 새가족 등록 바로 신청하기</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center justify-center text-center py-12 overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-200/50 filter blur-xl"></div>
                  <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-indigo-200/50 filter blur-xl"></div>

                  <div className="relative bg-white rounded-full p-6 shadow-md mb-6 inline-flex border border-slate-100">
                    <svg className="w-16 h-16 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>

                  <h4 className="text-lg font-black text-slate-800">우리가 세상의 눈부신 빛입니다</h4>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm">
                    “형제가 연합하여 동거함이 어찌 그리 좋은가.” 세상 가장 따스하고 안전한 양육 정원, 빛나는 교회에서 당신의 온 만남을 준비 중입니다.
                  </p>

                  <div className="mt-6 pt-6 border-t border-slate-200 w-full grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-black text-blue-900">7개</div>
                      <span className="text-[10px] text-slate-400 font-bold font-sans">예배 부서 및 모임</span>
                    </div>
                    <div>
                      <div className="text-lg font-black text-blue-900">100%</div>
                      <span className="text-[10px] text-slate-400 font-bold font-sans">말씀 중심 연합 케어</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>
      )}

      {/* 5-C. CORE VALUES (VISION) PAGE VIEW */}
      {currentPage === 'vision' && (
        <section className="relative overflow-hidden bg-[#fbfcfd] py-12 md:py-16 min-h-screen animate-fadeIn" id="vision-values-page">
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumb Header */}
            <div className="flex justify-between items-end border-b border-slate-200 pb-3 mb-10">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 font-sans">핵심가치</h2>
              <span className="text-[11px] md:text-xs text-slate-400 font-medium font-sans">HOME &gt; 빛나는교회 &gt; 핵심가치</span>
            </div>

            {/* Header Section */}
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-widest text-[#0f3b64] font-extrabold bg-blue-50 px-3 py-1.5 rounded-full">
                Core Values
              </span>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mt-4 leading-snug">
                빛나는교회가 지향하는 <span className="text-[#0f3b64]">6대 핵심 가치</span>
              </h3>
              <p className="text-slate-500 text-xs md:text-sm mt-3 max-w-xl mx-auto font-medium leading-relaxed">
                빛나는교회는 오직 예수 복음 위에 든든히 서서, 예배와 교육, 교회와 제자 훈련, 그리고 전도와 선교를 통해 하나님의 나라를 세워갑니다.
              </p>
              <div className="w-12 h-1 bg-[#0f3b64] mx-auto mt-5 rounded-full opacity-35" />
            </div>

            {/* Interactive Core Value Map (CSS Diagram) - Hidden on Mobile */}
            <div className="relative w-[600px] h-[640px] mx-auto my-12 hidden md:block select-none">
              {/* Connection Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 640">
                {/* Outer Ellipse connecting Top, Left, Right, Bottom */}
                <ellipse 
                  cx="300" 
                  cy="315" 
                  rx="180" 
                  ry="215" 
                  fill="none" 
                  stroke="#cbd5e1" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  className="opacity-70"
                />
                
                {/* Concentric Circles wrapping the middle column */}
                <circle 
                  cx="300" 
                  cy="315" 
                  r="80" 
                  fill="none" 
                  stroke="#e2e8f0" 
                  strokeWidth="1.5" 
                  strokeDasharray="3 3" 
                  className="opacity-60"
                />
                <circle 
                  cx="300" 
                  cy="315" 
                  r="150" 
                  fill="none" 
                  stroke="#cbd5e1" 
                  strokeWidth="1" 
                  strokeDasharray="3 3" 
                  className="opacity-50"
                />

                {/* Vertical Central Line */}
                <line 
                  x1="300" 
                  y1="180" 
                  x2="300" 
                  y2="450" 
                  stroke="#cbd5e1" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  className="opacity-50"
                />

                {/* Horizontal Left-Right Connector Line */}
                <line 
                  x1="200" 
                  y1="315" 
                  x2="400" 
                  y2="315" 
                  stroke="#cbd5e1" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  className="opacity-50"
                />
              </svg>

              {/* Nodes */}
              {/* Node 1: 하나님 사랑 복음 (Top) */}
              <div 
                className="absolute transition-all duration-300 z-20 cursor-pointer"
                style={{ left: '300px', top: '100px', transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setActiveValue(0)}
                onMouseLeave={() => setActiveValue(null)}
                onClick={() => document.getElementById('value-card-0')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              >
                <div className={`w-40 h-40 rounded-full bg-gradient-to-tr from-[#659b41] via-[#85b961] to-[#cbd5e1] p-[3px] shadow-[0_10px_25px_-5px_rgba(101,155,65,0.3)] transition-all duration-300 ${activeValue === 0 ? 'scale-105 ring-4 ring-emerald-200 ring-offset-2' : ''}`}>
                  <div className="w-full h-full rounded-full bg-[#659b41] flex flex-col items-center justify-center text-white p-3 text-center transition-colors">
                    <Sparkles className="w-6 h-6 mb-1 text-yellow-300 animate-bounce duration-1000" />
                    <span className="font-black text-[15px] leading-tight font-sans tracking-wide">하나님 사랑</span>
                    <span className="font-black text-[15px] leading-tight font-sans tracking-wide mb-1">복음</span>
                    <div className="border-t border-white/30 my-1 w-12" />
                    <span className="text-[9px] text-white/90 font-mono tracking-tighter">신 6:4~5</span>
                    <span className="text-[9px] text-white/90 font-mono tracking-tighter">롬 1:16~17</span>
                  </div>
                </div>
              </div>

              {/* Node 2: 가정·교육 (Middle 1) */}
              <div 
                className="absolute transition-all duration-300 z-20 cursor-pointer"
                style={{ left: '300px', top: '250px', transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setActiveValue(2)}
                onMouseLeave={() => setActiveValue(null)}
                onClick={() => document.getElementById('value-card-2')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              >
                <div className={`w-[110px] h-[110px] rounded-full p-[2px] bg-slate-300 transition-all duration-300 ${activeValue === 2 ? 'scale-105 ring-4 ring-amber-200 ring-offset-2 bg-amber-400' : 'hover:bg-slate-400'}`}>
                  <div className={`w-full h-full rounded-full flex flex-col items-center justify-center p-2 text-center transition-colors ${activeValue === 2 ? 'bg-amber-500 text-white' : 'bg-[#8fa0b5] text-white'}`}>
                    <Home className="w-5 h-5 mb-0.5 text-white/80" />
                    <span className="font-bold text-[12.5px] tracking-wide font-sans">가정·교육</span>
                    <div className="border-t border-white/20 my-1 w-8" />
                    <span className="text-[8.5px] opacity-90 font-mono">신 6:6~9</span>
                  </div>
                </div>
              </div>

              {/* Node 3: 교회·제자 (Middle 2) */}
              <div 
                className="absolute transition-all duration-300 z-20 cursor-pointer"
                style={{ left: '300px', top: '390px', transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setActiveValue(3)}
                onMouseLeave={() => setActiveValue(null)}
                onClick={() => document.getElementById('value-card-3')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              >
                <div className={`w-[110px] h-[110px] rounded-full p-[2px] bg-slate-300 transition-all duration-300 ${activeValue === 3 ? 'scale-105 ring-4 ring-indigo-200 ring-offset-2 bg-indigo-400' : 'hover:bg-slate-400'}`}>
                  <div className={`w-full h-full rounded-full flex flex-col items-center justify-center p-2 text-center transition-colors ${activeValue === 3 ? 'bg-indigo-500 text-white' : 'bg-[#8fa0b5] text-white'}`}>
                    <Users className="w-5 h-5 mb-0.5 text-white/80" />
                    <span className="font-bold text-[12.5px] tracking-wide font-sans">교회·제자</span>
                    <div className="border-t border-white/20 my-1 w-8" />
                    <span className="text-[8.5px] opacity-90 font-mono">마 16:18</span>
                  </div>
                </div>
              </div>

              {/* Node 4: 지상명령 선교 (Bottom) */}
              <div 
                className="absolute transition-all duration-300 z-20 cursor-pointer"
                style={{ left: '300px', top: '530px', transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setActiveValue(5)}
                onMouseLeave={() => setActiveValue(null)}
                onClick={() => document.getElementById('value-card-5')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              >
                <div className={`w-[110px] h-[110px] rounded-full p-[2px] bg-slate-300 transition-all duration-300 ${activeValue === 5 ? 'scale-105 ring-4 ring-red-200 ring-offset-2 bg-red-400' : 'hover:bg-slate-400'}`}>
                  <div className={`w-full h-full rounded-full flex flex-col items-center justify-center p-2 text-center transition-colors ${activeValue === 5 ? 'bg-red-500 text-white' : 'bg-[#8fa0b5] text-white'}`}>
                    <Map className="w-5 h-5 mb-0.5 text-white/80" />
                    <span className="font-bold text-[12.5px] tracking-wide font-sans">지상명령</span>
                    <span className="font-bold text-[12.5px] tracking-wide font-sans">선교</span>
                    <div className="border-t border-white/20 my-1 w-8" />
                    <span className="text-[8.5px] opacity-90 font-mono">마 28:18~20</span>
                  </div>
                </div>
              </div>

              {/* Node 5: 예배 (Left) */}
              <div 
                className="absolute transition-all duration-300 z-20 cursor-pointer"
                style={{ left: '120px', top: '315px', transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setActiveValue(1)}
                onMouseLeave={() => setActiveValue(null)}
                onClick={() => document.getElementById('value-card-1')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              >
                <div className={`w-[120px] h-[120px] rounded-full p-[2px] bg-slate-300 transition-all duration-300 ${activeValue === 1 ? 'scale-105 ring-4 ring-blue-200 ring-offset-2 bg-blue-400' : 'hover:bg-slate-400'}`}>
                  <div className={`w-full h-full rounded-full flex flex-col items-center justify-center p-3 text-center transition-colors ${activeValue === 1 ? 'bg-blue-500 text-white' : 'bg-[#8fa0b5] text-white'}`}>
                    <BookOpen className="w-5.5 h-5.5 mb-0.5 text-white/80" />
                    <span className="font-bold text-[13.5px] tracking-wide font-sans">예배</span>
                    <div className="border-t border-white/20 my-1 w-8" />
                    <span className="text-[8px] opacity-90 font-mono leading-none">사 43:21</span>
                    <span className="text-[8px] opacity-90 font-mono leading-none mt-0.5">요 4:23 | 롬 12:1</span>
                  </div>
                </div>
              </div>

              {/* Node 6: 전도/섬김 (Right) */}
              <div 
                className="absolute transition-all duration-300 z-20 cursor-pointer"
                style={{ left: '480px', top: '315px', transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setActiveValue(4)}
                onMouseLeave={() => setActiveValue(null)}
                onClick={() => document.getElementById('value-card-4')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              >
                <div className={`w-[120px] h-[120px] rounded-full p-[2px] bg-slate-300 transition-all duration-300 ${activeValue === 4 ? 'scale-105 ring-4 ring-rose-200 ring-offset-2 bg-rose-400' : 'hover:bg-slate-400'}`}>
                  <div className={`w-full h-full rounded-full flex flex-col items-center justify-center p-3 text-center transition-colors ${activeValue === 4 ? 'bg-rose-500 text-white' : 'bg-[#8fa0b5] text-white'}`}>
                    <Heart className="w-5.5 h-5.5 mb-0.5 text-white/80" />
                    <span className="font-bold text-[13.5px] tracking-wide font-sans">전도/섬김</span>
                    <div className="border-t border-white/20 my-1 w-8" />
                    <span className="text-[8px] opacity-90 font-mono leading-none">막 16:15</span>
                    <span className="text-[8px] opacity-90 font-mono leading-none mt-0.5">요13 | 마5:16</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Diagram View (Vertical Flow) */}
            <div className="block md:hidden max-w-sm mx-auto my-8 bg-slate-50 p-6 rounded-2xl border border-slate-100/80">
              <h4 className="text-[10px] font-bold text-slate-400 mb-6 text-center uppercase tracking-wider">핵심가치 연결 흐름도</h4>
              <div className="flex flex-col items-center space-y-4">
                {/* 1. 하나님 사랑 복음 */}
                <button 
                  onClick={() => document.getElementById('value-card-0')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="w-full bg-[#659b41] text-white p-3 rounded-xl shadow-sm text-center flex items-center justify-between hover:bg-opacity-95 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span className="font-extrabold text-xs">1. 하나님 사랑 복음</span>
                  </div>
                  <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-mono">신 6:4~5 외</span>
                </button>

                <div className="w-0.5 h-3 bg-slate-300 border-l border-dashed border-slate-400" />

                {/* 2. 예배 */}
                <button 
                  onClick={() => document.getElementById('value-card-1')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="w-full bg-[#8fa0b5] text-white p-3 rounded-xl shadow-sm text-center flex items-center justify-between hover:bg-opacity-95 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-white/80" />
                    <span className="font-bold text-xs">2. 예배</span>
                  </div>
                  <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-mono">사 43:21 외</span>
                </button>

                <div className="w-0.5 h-3 bg-slate-300 border-l border-dashed border-slate-400" />

                {/* 3. 가정·교육 */}
                <button 
                  onClick={() => document.getElementById('value-card-2')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="w-full bg-[#8fa0b5] text-white p-3 rounded-xl shadow-sm text-center flex items-center justify-between hover:bg-opacity-95 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4 text-white/80" />
                    <span className="font-bold text-xs">3. 가정·교육</span>
                  </div>
                  <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-mono">신 6:6~9</span>
                </button>

                <div className="w-0.5 h-3 bg-slate-300 border-l border-dashed border-slate-400" />

                {/* 4. 교회·제자 */}
                <button 
                  onClick={() => document.getElementById('value-card-3')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="w-full bg-[#8fa0b5] text-white p-3 rounded-xl shadow-sm text-center flex items-center justify-between hover:bg-opacity-95 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-white/80" />
                    <span className="font-bold text-xs">4. 교회·제자</span>
                  </div>
                  <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-mono">마 16:18</span>
                </button>

                <div className="w-0.5 h-3 bg-slate-300 border-l border-dashed border-slate-400" />

                {/* 5. 전도/섬김 */}
                <button 
                  onClick={() => document.getElementById('value-card-4')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="w-full bg-[#8fa0b5] text-white p-3 rounded-xl shadow-sm text-center flex items-center justify-between hover:bg-opacity-95 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-white/80" />
                    <span className="font-bold text-xs">5. 전도/섬김</span>
                  </div>
                  <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-mono">막 16:15 외</span>
                </button>

                <div className="w-0.5 h-3 bg-slate-300 border-l border-dashed border-slate-400" />

                {/* 6. 지상명령 선교 */}
                <button 
                  onClick={() => document.getElementById('value-card-5')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="w-full bg-[#8fa0b5] text-white p-3 rounded-xl shadow-sm text-center flex items-center justify-between hover:bg-opacity-95 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Map className="w-4 h-4 text-white/80" />
                    <span className="font-bold text-xs">6. 지상명령 선교</span>
                  </div>
                  <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-mono">마 28:18~20</span>
                </button>
              </div>
            </div>

            {/* 6-Card Scripture Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
              {coreValues.map((val, idx) => {
                const IconComponent = val.icon;
                const isHoveredOrActive = activeValue === idx;
                
                return (
                  <div 
                    key={idx}
                    id={`value-card-${idx}`}
                    className={`bg-white rounded-3xl p-6 md:p-8 border transition-all duration-500 flex flex-col justify-between ${
                      isHoveredOrActive 
                        ? `${val.borderCol} shadow-xl -translate-y-2 ring-1 ring-offset-2 ${val.shadowGlow}` 
                        : 'border-slate-150 shadow-md hover:shadow-lg'
                    }`}
                    onMouseEnter={() => setActiveValue(idx)}
                    onMouseLeave={() => setActiveValue(null)}
                  >
                    <div>
                      {/* Card Top: Number + Icon */}
                      <div className="flex justify-between items-start mb-5">
                        <span className={`text-2xl font-black font-sans leading-none tracking-tight opacity-20`}>
                          {val.number}
                        </span>
                        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${val.bgLight} ${val.textAccent}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                      </div>

                      {/* Card Title */}
                      <h4 className="text-[16px] font-black text-slate-900 tracking-tight mb-2">
                        {val.title}
                      </h4>

                      {/* Card Description */}
                      <p className="text-[12px] text-slate-500 leading-relaxed mb-6 font-medium">
                        {val.description}
                      </p>

                      {/* Scripture Quotes */}
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        {val.scriptures.map((scrip, sidx) => (
                          <div key={sidx} className="text-left bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                            <span className={`text-[9.5px] font-bold tracking-wide ${val.badgeBg} px-2 py-0.5 rounded-md`}>
                              {scrip.ref}
                            </span>
                            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed font-serif italic font-medium">
                              "{scrip.text}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* 6. WEEKLY SERMON & PRAISE SECTION ([필수 요구사항: 이번주 설교영상 즉시 재생 연동]) */}
      {(currentPage === 'home' || 
        currentPage === 'sermon-sunday' || 
        currentPage === 'sermon-wednesday' || 
        currentPage === 'sermon-friday' || 
        currentPage === 'praise-wednesday' || 
        currentPage === 'praise-friday') && (
        <section className="relative overflow-hidden bg-slate-100/70 border-y border-slate-200 py-16 md:py-24" id="sermon-section">
        {/* Soft prayer hands watermark on the left */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-contain bg-no-repeat opacity-[0.04] pointer-events-none mix-blend-multiply hidden md:block" 
          style={{ backgroundImage: `url('${prayerHandsBg}')`, backgroundPosition: 'left center' }}
        />
        {/* Soft prayer hands watermark on the right */}
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-contain bg-no-repeat opacity-[0.04] pointer-events-none mix-blend-multiply hidden md:block transform scale-x-[-1]" 
          style={{ backgroundImage: `url('${prayerHandsBg}')`, backgroundPosition: 'right center' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-blue-600 font-extrabold">Weekly worship media</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950 mt-2">
                금주의 예배와 감동 찬양
              </h2>
              <p className="text-xs text-slate-500 mt-1">말씀을 듣고 삶 속에서 깊게 묵상하며 성지 같은 하루를 고백합니다.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <a 
                href="https://www.youtube.com/@TheBrighteningchurch"
                target="_blank"
                referrerPolicy="no-referrer"
                className="inline-flex items-center gap-1 text-xs font-extrabold text-rose-600 hover:text-rose-700"
              >
                교회 유튜브 아카이브보기 <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {filteredSermons.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-3xl bg-white shadow-md">
              등록된 설교 또는 찬양 영상이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Sermon Playback Zone */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-5 md:p-6 shadow-xl border border-slate-200">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 group shadow-inner">
                  
                  {/* Active YouTube embed controller if activeVideo state is set */}
                  {activeVideo ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                      title={activeVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img 
                        src={filteredSermons[0]?.thumbnail || sermonData[0].thumbnail} 
                        alt="Sermon backdrop"
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30 flex flex-col justify-between p-6">
                        
                        {/* Badge info */}
                        <span className="self-start bg-blue-600 text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-full space-x-1">
                          ● 최근 말씀 LIVE 재생 가능
                        </span>

                        {/* Play Action button overlay */}
                        <button 
                          onClick={() => setActiveVideo(filteredSermons[0])}
                          className="self-center bg-white hover:bg-amber-400 hover:text-slate-950 text-slate-900 rounded-full p-6 shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-200"
                          title="예배 동영상 바로 듣기"
                        >
                          <Play className="h-8 w-8 fill-current ml-1" />
                        </button>

                        {/* Video Title and bible info */}
                        <div className="text-left py-1 text-white">
                          <span className="text-xs text-blue-300 font-bold block">
                            {(filteredSermons[0] || sermonData[0]).date} • {(filteredSermons[0] || sermonData[0]).preacher} {(filteredSermons[0] || sermonData[0]).type.includes('찬양') ? '찬양대' : '목사'}
                          </span>
                          <h3 className="text-lg md:text-xl font-bold mt-1 leading-tight group-hover:text-amber-300 transition-colors">
                            {(filteredSermons[0] || sermonData[0]).title}
                          </h3>
                          <p className="text-xs text-slate-300 mt-1 font-serif">성경본문: {(filteredSermons[0] || sermonData[0]).passage}</p>
                        </div>

                      </div>
                    </>
                  )}

                </div>

                {/* Player details block */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-extrabold">now playing info</span>
                    <p className="text-sm font-extrabold text-slate-800">
                      {activeVideo ? activeVideo.title : (filteredSermons[0]?.title || sermonData[0].title)}
                    </p>
                    <p className="text-[11px] text-slate-500 font-serif mt-0.5">
                      성경구절: {activeVideo ? activeVideo.passage : (filteredSermons[0]?.passage || sermonData[0].passage)}
                    </p>
                  </div>
                  {activeVideo && (
                    <button 
                      onClick={() => setActiveVideo(null)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                    >
                      동영상 플레이어 닫기
                    </button>
                  )}
                </div>
              </div>

              {/* Right sermons list sidebar */}
              <div className="lg:col-span-4 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1">
                  <Volume2 className="h-4 w-4 text-blue-600" />
                  동영상 목록 (클릭 연동)
                </h3>
                
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {filteredSermons.map((sermon) => {
                    const isCurrentActive = activeVideo?.id === sermon.id || (!activeVideo && sermon.id === filteredSermons[0].id);
                    return (
                      <button
                        key={sermon.id}
                        onClick={() => setActiveVideo(sermon)}
                        className={`w-full rounded-2xl p-4 border text-left transition-all ${
                          isCurrentActive 
                            ? 'border-blue-600 bg-white shadow-md ring-2 ring-blue-100' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="text-[10px] text-blue-600 font-bold block">{sermon.date} {sermon.type}</span>
                        <h4 className="text-xs md:text-sm font-extrabold text-slate-900 mt-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                          {sermon.title}
                        </h4>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                          <span>구절: {sermon.passage}</span>
                          <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[9px] font-mono select-none">
                            {sermon.preacher}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* YouTube Banner CTA */}
                <div className="rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-950 p-5 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                    <Youtube className="w-40 h-40 fill-white" />
                  </div>
                  <span className="bg-red-600 text-white rounded text-[8.5px] font-black uppercase px-1.5 py-0.5 inline-block tracking-wider mb-2">
                    Live Stream
                  </span>
                  <h4 className="text-md font-bold mb-1 leading-tight">빛나는 교회 온라인 예배국</h4>
                  <p className="text-xs text-slate-300 leading-snug">매주 주일 오전 11:00 실시간 주일 연합 예배가 즉시 고화질 생중계됩니다.</p>
                  <a 
                    href="https://www.youtube.com/@TheBrighteningchurch"
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="mt-4 bg-white hover:bg-amber-400 text-slate-900 hover:scale-105 font-extrabold text-[11px] py-1.5 px-3.5 rounded-full shadow-md transition-all inline-flex items-center gap-1.5"
                  >
                    공식 채널 가기 <ArrowRight className="h-3 w-3" />
                  </a>
                </div>

              </div>

            </div>
          )}

        </div>
      </section>
      )}

      {/* 7. REDESIGNED WORSHIP TIMETABLE SECTION ([가독성 전격 가공 및 모바일 밀착 분할]) */}
      {currentPage === 'home' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24" id="schedule-section">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-extrabold">Faith Life Timetable</span>
          <h2 className="text-2xl md:text-3.5xl font-black tracking-tight text-slate-950 mt-3 md:mt-4">
            빛나는 교회 정규 예배 시간표
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            매주 혹은 매일 성령의 역사하심과 화평한 성도의 교제가 피어나는 거룩한 예배 시간표를 안내합니다.
          </p>
          <div className="w-12 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Timetable grid list - extremely clean UI */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Legend headers/headings (Desktop only) */}
          <div className="hidden md:grid grid-cols-4 gap-4 bg-slate-900 text-white px-8 py-4.5 font-bold text-xs select-none">
            <div>예배 명칭</div>
            <div>대상 및 안내구역</div>
            <div>시간</div>
            <div>예배 장소</div>
          </div>

          {/* Table list */}
          <div className="divide-y divide-slate-100">
            {worshipSchedules.map((schedule, idx) => (
              <div 
                key={idx} 
                className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 px-6 md:px-8 py-5 md:py-6 text-sm items-center hover:bg-slate-50/50 transition-colors"
              >
                {/* 1. Name */}
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <strong className="text-slate-900 font-extrabold text-sm md:text-md">
                    {schedule.name}
                  </strong>
                </div>

                {/* 2. Target info */}
                <div className="md:text-slate-600 text-slate-500 flex items-center md:block gap-1 pl-4 md:pl-0">
                  <span className="inline md:hidden text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full mr-2">대상</span>
                  <span className="text-xs font-semibold">{schedule.target}</span>
                </div>

                {/* 3. Time info */}
                <div className="text-blue-700 font-mono font-extrabold flex items-center md:block pl-4 md:pl-0">
                  <span className="inline md:hidden text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full mr-2">시간</span>
                  <span className="text-sm">{schedule.time}</span>
                </div>

                {/* 4. Location info */}
                <span className="text-slate-600 flex items-center md:block pl-4 md:pl-0 text-xs font-medium">
                  <span className="inline md:hidden text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full mr-2">장소</span>
                  {schedule.location}
                </span>

              </div>
            ))}
          </div>

        </div>

      </section>
      )}

      {/* 7-A. DEDICATED WORSHIP PAGE VIEW */}
      {currentPage === 'worship' && (
        <section className="relative overflow-hidden bg-[#faf7f2] py-12 md:py-16 min-h-screen animate-fadeIn" id="worship-guide-page">
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumb Header */}
            <div className="flex justify-between items-end border-b border-slate-300/30 pb-3 mb-10">
              <h2 className="text-xl md:text-2xl font-black text-[#0f3b64] font-sans">예배안내</h2>
              <span className="text-[11px] md:text-xs text-slate-500 font-medium font-sans">HOME &gt; 빛나는교회 &gt; 예배안내</span>
            </div>

            {/* 1. 예배시간 Section */}
            <div className="space-y-6 mb-12">
              <div className="flex">
                <span className="bg-[#e6856c] text-white text-xs font-bold px-3 py-1.5 rounded-[4px] uppercase tracking-wider">
                  예배시간
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { title: '주일 1부 예배', time: '오전 9:10', loc: '본당 (2층 대성전)' },
                  { title: '주일 2부 예배', time: '오전 11:00', loc: '본당 (2층 대성전)' },
                  { title: '주일 오후 예배', time: '오후 1:30', loc: '본당 (2층 대성전)' },
                  { title: '수요예배', time: '오후 7:30', loc: '본당 (2층 대성전)' },
                  { title: '금요기도회', time: '오후 8:00', loc: '본당 (2층 대성전)' },
                  { title: '새벽기도회', time: '오전 5:00', loc: '본당 (2층 대성전)' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-6 shadow-sm border border-slate-150/40 hover:shadow-md transition-shadow text-left">
                    <h4 className="text-[15px] font-black text-[#0f3b64]">{item.title}</h4>
                    <p className="text-[12.5px] text-slate-500 mt-2 font-medium">
                      {item.time} <span className="text-slate-300 mx-1">|</span> {item.loc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. 교육부서 Section */}
            <div className="space-y-6">
              <div className="flex">
                <span className="bg-[#e6856c] text-white text-xs font-bold px-3 py-1.5 rounded-[4px] uppercase tracking-wider">
                  교육부서
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { title: '교회학교 (영유치부)', time: '주일 오전 10:40', loc: '교육관 1층 자비실' },
                  { title: '교회학교 (초등부)', time: '주일 오전 10:40', loc: '교육관 지하 1층 소강당' },
                  { title: '청청 공동체 (청소년부)', time: '주일 오전 10:40', loc: '목양관 3층 시온홀' },
                  { title: '청청 공동체 (청년부)', time: '주일 오후 1:30', loc: '목양관 3층 시온홀' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-6 shadow-sm border border-slate-150/40 hover:shadow-md transition-shadow text-left">
                    <h4 className="text-[15px] font-black text-[#0f3b64]">{item.title}</h4>
                    <p className="text-[12.5px] text-slate-500 mt-2 font-medium">
                      {item.time} <span className="text-slate-300 mx-1">|</span> {item.loc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Combined News & Gallery Section with Sky Background and Floating Panels */}
      {currentPage === 'home' && (
        <div 
          className="relative bg-cover bg-center py-16 md:py-24 space-y-12 overflow-hidden"
          style={{ backgroundImage: `url('${skyBg}')` }}
        >
        {/* Soft white gradient overlays for smooth transition from previous section and to footer */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />

        {/* 8. CHURCH NEWS & MAIN BANNER POSTER */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-16 bg-white/90 backdrop-blur-md rounded-[40px] md:rounded-[60px] shadow-2xl border border-white/20" id="news-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left side board news list */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-blue-600 font-extrabold">Active church boards</span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-950 mt-1">빛나는 교회 새소식</h3>
                </div>
                <button
                  onClick={() => navigateToPage('announcement')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 inline-flex items-center gap-0.5"
                >
                  더보기 <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="divide-y divide-slate-150 space-y-3 pt-2">
                {churchNews.map((news) => (
                  <button
                    key={news.id}
                    onClick={() => setSelectedNews(news)}
                    className="w-full text-left py-4 px-2 hover:bg-slate-50/70 rounded-xl transition-all duration-150 block group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                            news.category === '공지사항' 
                              ? 'bg-red-50 text-red-700 border border-red-200' 
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {news.category}
                          </span>
                          <span className="text-[11.5px] text-slate-400 font-mono font-medium">{news.date}</span>
                        </div>
                        <h4 className="text-xs md:text-sm font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {news.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{news.content}</p>
                      </div>

                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right side beautifully formatted Scripture Poster */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-gradient-to-br from-blue-800 to-indigo-950 text-white p-8 shadow-xl relative overflow-hidden flex flex-col justify-between aspect-square md:aspect-auto md:min-h-[380px]">
                {/* Decorative background vectors */}
                <div className="absolute top-0 right-0 -m-12 w-64 h-64 rounded-full bg-white/5 border border-white/5 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -m-20 w-80 h-80 rounded-full bg-white/5 border border-white/5 pointer-events-none"></div>

                <div className="z-10">
                  <span className="bg-white/10 text-white text-[9.5px] font-extrabold uppercase px-2.5 py-1 rounded-full inline-block tracking-widest mb-6 border border-white/15">
                    Church Faith Core Key Call
                  </span>
                  <h4 className="text-xl md:text-2xl font-serif font-black leading-snug drop-shadow-md">
                    “하나님의 사랑, 상상 이상의 사랑”
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 font-mono">2026년도 성전 표어 및 핵심 구절 말씀</p>
                </div>

                <div className="z-10 mt-8 pt-8 border-t border-white/10 text-left">
                  <strong className="text-yellow-400 text-xs uppercase tracking-widest font-bold">이사야 43:21 (사43:21)</strong>
                  <p className="text-sm md:text-md italic font-serif leading-relaxed text-slate-100 mt-1.5">
                    “이 백성은 내가 나를 위하여 지었나니 나를 찬송하게 하려 함이니라”
                  </p>
                  <p className="text-[11px] text-slate-400 font-serif leading-relaxed mt-2.5">
                    그리스도의 화평한 동거와 예배를 기뻐하시는 하나님께 매일 찬양과 복음의 빛 가득 흘려보내는 처소가 되게 하옵소서.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 9. GALLERY SECTION & UTILITY ACTION BUTTON GRIDS */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-16 bg-white/90 backdrop-blur-md rounded-[40px] md:rounded-[60px] shadow-2xl border border-white/20" id="gallery-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Gallery list */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-blue-600 font-extrabold">Active beautiful moments</span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1">빛나는 교회 갤러리</h3>
                </div>
                <button
                  onClick={() => navigateToPage('activity-gallery')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 inline-flex items-center gap-0.5"
                >
                  더보기 <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-8">
                {loadingGallery ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-slate-400 font-medium">구글 드라이브에서 사진첩을 가져오는 중...</p>
                  </div>
                ) : galleryCategories.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-2xl">
                    등록된 사진첩이 없습니다.
                  </div>
                ) : (() => {
                  const sortedCategories = [...galleryCategories].sort((a, b) => {
                    const getLatestDate = (cat: any) => {
                      if (!cat.albums || cat.albums.length === 0) return '';
                      const dates = cat.albums.map((alb: any) => alb.date).filter(Boolean);
                      if (dates.length === 0) return '';
                      return dates.sort().reverse()[0];
                    };
                    const dateA = getLatestDate(a);
                    const dateB = getLatestDate(b);
                    return dateB.localeCompare(dateA);
                  });

                  const featuredCategory = sortedCategories[0];
                  const otherCategories = sortedCategories.slice(1);

                  return (
                    <div className="space-y-10">
                      {/* Featured Album */}
                      {featuredCategory && featuredCategory.albums && featuredCategory.albums[0] && (
                        <div className="bg-slate-50 rounded-3xl p-5 md:p-6 border border-slate-100 flex flex-col md:flex-row gap-6 items-center shadow-inner">
                          <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden shadow bg-slate-900 relative group">
                            <img 
                              src={featuredCategory.albums[0].coverUrl || featuredCategory.albums[0].photos?.[0] || 'https://images.unsplash.com/photo-1456406644174-8dba4c7f7d2c?auto=format&fit=crop&q=80&w=800'} 
                              alt="Featured Album Cover" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] uppercase font-black px-2 py-0.5 rounded-full">
                              New Featured Photo
                            </div>
                          </div>
                          <div className="w-full md:w-1/2 text-left space-y-3">
                            <span className="text-[10px] text-blue-600 font-extrabold uppercase font-sans tracking-wider">{featuredCategory.name}</span>
                            <h4 className="text-md md:text-lg font-black text-slate-900 leading-tight">
                              {featuredCategory.albums[0].title}
                            </h4>
                            <p className="text-xs text-slate-400 font-mono">{featuredCategory.albums[0].date} 업데이트</p>
                            <button
                              onClick={() => setSelectedActivity(featuredCategory.albums[0])}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-full shadow transition-all inline-flex items-center gap-1 mt-2"
                            >
                              <span>앨범 사진첩 전체보기</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Small Albums Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {otherCategories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              if (cat.albums && cat.albums[0]) {
                                setSelectedActivity(cat.albums[0]);
                              } else {
                                alert('앨범 목록이 비어있습니다.');
                              }
                            }}
                            className="bg-slate-50/50 hover:bg-white rounded-2xl overflow-hidden border border-slate-100 flex shadow-sm hover:shadow group text-left transition-all"
                          >
                            <div className="w-24 md:w-28 aspect-square bg-slate-200 shrink-0 relative overflow-hidden">
                              <img 
                                src={cat.albums && cat.albums[0] ? (cat.albums[0].coverUrl || cat.albums[0].photos?.[0]) : 'https://images.unsplash.com/photo-1456406644174-8dba4c7f7d2c?auto=format&fit=crop&q=80&w=300'} 
                                alt="Album Cover Thumbnail" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="p-4.5 flex-1 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-blue-600">행사 사진첩</span>
                                <h4 className="text-sm font-extrabold text-slate-900 mt-1 group-hover:text-blue-700 transition-colors">
                                  {cat.name}
                                </h4>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10.5px] text-slate-400 font-medium">
                                <span>최근 업데이트</span>
                                <span>{cat.albums && cat.albums[0] ? cat.albums[0].date : '없음'}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Utility grid buttons (Yeoju church UI benchmarks) */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-400">교회 주요 행정 및 온라인 사무처</h3>
              
              <div className="grid grid-cols-1 gap-4">
                
                {/* Button 1 */}
                <button
                  onClick={() => {
                    navigateToPage('form-archive');
                  }}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-blue-50 border border-slate-200 rounded-2xl text-left group shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-100/60 p-3 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="text-xs md:text-sm font-extrabold text-slate-900 block leading-tight">교회 소책자 및 서식자료실</strong>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">교인증명, 세례희망 신청원 양식 구비</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </button>

                {/* Button 2 */}
                <button
                  onClick={() => {
                    alert('성도 사업체 게시판:\n빛나는 교회 성도님들이 운영하시는 성실하고 거룩한 소상공인 목록을 준비하고 있습니다. 주일 사무실로 제보해주세요.');
                  }}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-blue-50 border border-slate-200 rounded-2xl text-left group shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-100/60 p-3 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="text-xs md:text-sm font-extrabold text-slate-900 block leading-tight">성도 교우 기업단 찾기</strong>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">서로 연합하고 가정을 돕는 우리 일터 소개</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </button>

                {/* Button 3 */}
                <button
                  onClick={() => {
                    alert('빛나는 교회 차량운행 안내:\n- 1호차 노선: 교회 로비 출발 (오전 08:35)\n- 2호차 노선: 빛나는 아파트 단지 상가 (오전 10:20)\n안전하고 기품있는 셔틀 운전사 집사님들이 성심껏 주차를 돌봅니다.');
                  }}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-blue-50 border border-slate-200 rounded-2xl text-left group shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-100/60 p-3 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-all">
                      <Map className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="text-xs md:text-sm font-extrabold text-slate-900 block leading-tight">차량 운행 노선 및 버스정보</strong>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">주요 정차 지점 및 주일 주차 수칙 가이드</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </button>

                {/* Button 4 */}
                <button
                  onClick={() => setNewFamilyFormOpen(true)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-blue-50 border border-slate-200 rounded-2xl text-left group shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-rose-100/60 p-3 text-rose-700 group-hover:bg-rose-600 group-hover:text-white transition-all">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="text-xs md:text-sm font-extrabold text-slate-900 block leading-tight">온라인 행정 청원 처소</strong>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">기도 청원 카드, 자치 회비 수납 및 안내원</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </button>

              </div>
            </div>

          </div>
        </section>
      </div>
      )}

      {/* 9.1.1 묵상과 삶 (소그룹) */}
      {currentPage === 'meditation-life' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">말씀 묵상과 함께 성장하는 소그룹 공동체</h3>
                <p className="text-slate-600 leading-relaxed font-light text-[15px]">
                  빛나는교회 소그룹은 매주 하나님의 말씀을 개인의 삶에 적용한 간증과 묵상을 나누며, 서로를 위해 중보기도하고 주님의 사랑을 삶 속에서 구체적으로 실천하는 신앙의 모체입니다.
                </p>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 text-sm text-slate-700">
                  <h4 className="font-extrabold text-slate-900">소그룹 운영 및 모임 안내</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>모임 시간:</strong> 매주 주일 낮 대예배 직후 (오전 12:30 ~ )
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>모임 장소:</strong> 본관 2층 대성전 옆 소그룹실 및 교육관 각 실
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>진행 내용:</strong> 금주의 주일 말씀 요약 묵상, 나눔 교제, 중보기도 시간
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Active Small Groups list mockup */}
              <div className="space-y-6">
                <h4 className="text-lg font-black text-slate-900">현재 활동 중인 대표 구역(소그룹)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow hover:shadow-md transition-all space-y-3">
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-bold">장년 1교구</span>
                    <h5 className="font-black text-slate-900 text-base">에덴 구역 (구역장: 김영자 권사)</h5>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">가장 오랜 전통을 자랑하며, 따뜻한 어머니의 품과 같은 기도로 교우들을 품고 매주 사랑방 모임을 이어갑니다.</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow hover:shadow-md transition-all space-y-3">
                    <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-bold">장년 2교구</span>
                    <h5 className="font-black text-slate-900 text-base">시온 구역 (구역장: 박민수 집사)</h5>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">3040 직장인 및 신혼 부부 중심으로 구성되어 퇴근 후 온/오프라인 연합 묵상을 실천하며 기도로 동행합니다.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[40px] text-white p-8 shadow-lg text-center space-y-6">
                <Sparkles className="h-10 w-10 text-amber-300 mx-auto animate-pulse" />
                <h4 className="text-lg font-black leading-snug">소그룹 모임에 함께 동참하세요</h4>
                <p className="text-xs text-slate-200 leading-relaxed font-light">
                  성도 간의 긴밀한 교제와 기도는 영적 성장의 가장 빠른 길입니다. 빛나는교회 소그룹의 문은 언제나 열려있습니다.
                </p>
                <button
                  onClick={() => alert('소그룹 신청 안내:\n소그룹(구역) 배정을 요청하셨습니다. 교회 행정처에서 확인 후 이번 주 중으로 유선 연락 드리겠습니다.')}
                  className="w-full bg-white hover:bg-amber-400 hover:text-slate-950 text-slate-900 font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-transform hover:-translate-y-0.5"
                >
                  소그룹 모임 가입 신청하기
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">오늘의 추천 성구</h4>
                <p className="text-xs text-slate-600 font-serif italic leading-relaxed">
                  "두세 사람이 내 이름으로 모인 곳에는 나도 그들 중에 있느니라" (마태복음 18:20)
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 9.1.2 남·여전도회 연합 */}
      {currentPage === 'mission-group' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16 animate-fadeIn">
          <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
            <div className="max-w-3xl space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">선교와 친교를 도모하는 남·여전도회 연합회</h3>
              <p className="text-slate-600 leading-relaxed font-light text-[15px]">
                남·여전도회는 성도들의 연령대별 친밀한 교류와 사역적 연합을 바탕으로 주님의 지상명령인 세계 선교를 후원하고, 교회 내부의 봉사와 이웃 사랑을 실천하는 선교 동역 공동체입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* 남전도회 */}
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                  <h4 className="text-lg font-black text-slate-900">남전도회 구성원 안내</h4>
                </div>
                <div className="space-y-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <strong className="text-sm font-black text-slate-900 block">제1남전도회</strong>
                      <span className="text-[11px] text-slate-400">연령: 만 65세 이상 성도</span>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">친교 및 원로 지원</span>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <strong className="text-sm font-black text-slate-900 block">제2남전도회</strong>
                      <span className="text-[11px] text-slate-400">연령: 만 55세 ~ 64세 성도</span>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">예배 및 주차 봉사</span>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <strong className="text-sm font-black text-slate-900 block">제3남전도회</strong>
                      <span className="text-[11px] text-slate-400">연령: 만 45세 ~ 54세 성도</span>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">안전 방재 및 선교 후원</span>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <strong className="text-sm font-black text-slate-900 block">제4남전도회</strong>
                      <span className="text-[11px] text-slate-400">연령: 만 45세 미만 청장년 성도</span>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">미디어 사역 및 청년 멘토링</span>
                  </div>
                </div>
              </div>

              {/* 여전도회 */}
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-pink-600 rounded-full"></span>
                  <h4 className="text-lg font-black text-slate-900">여전도회 구성원 안내</h4>
                </div>
                <div className="space-y-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <strong className="text-sm font-black text-slate-900 block">제1여전도회</strong>
                      <span className="text-[11px] text-slate-400">연령: 만 65세 이상 성도</span>
                    </div>
                    <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded">기도 중보 및 심방 조력</span>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <strong className="text-sm font-black text-slate-900 block">제2여전도회</strong>
                      <span className="text-[11px] text-slate-400">연령: 만 55세 ~ 64세 성도</span>
                    </div>
                    <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded">친교 봉사 및 이웃 구제</span>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <strong className="text-sm font-black text-slate-900 block">제3여전도회</strong>
                      <span className="text-[11px] text-slate-400">연령: 만 45세 ~ 54세 성도</span>
                    </div>
                    <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded">성전 데코 및 주방 봉사</span>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <strong className="text-sm font-black text-slate-900 block">제4여전도회</strong>
                      <span className="text-[11px] text-slate-400">연령: 만 45세 미만 청장년 성도</span>
                    </div>
                    <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded">교회학교 후원 및 찬양 사역</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-rose-100 p-8 rounded-3xl border border-pink-100 text-center max-w-4xl mx-auto space-y-4 mt-8">
              <h4 className="text-lg font-black text-pink-900">“서로 대접하기를 원망 없이 하고 각각 은사를 받은 대로... 봉사하라” (베드로전서 4:9-10)</h4>
              <p className="text-xs text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
                남·여전도회는 월례회를 통해 영의 양식을 나눌 뿐 아니라 교회의 기둥 부서로서 연중 다양한 사랑 나눔 행사를 펼치고 있습니다. 여러분의 헌신과 기도가 빛나는 교회를 더욱 눈부시게 비춥니다.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 9.1.3 가정 및 구역 예배 */}
      {currentPage === 'home-worship' && (
        renderPermissionLock('정회원') || (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
                <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Home className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">가정을 화평케 하는 연합 구역 예배</h3>
                <p className="text-slate-600 leading-relaxed font-light text-[15px]">
                  가정 및 구역 예배는 모든 구역원이 각 가정을 순회하며 예수 복음 중심의 말씀 안에서 삶을 나누는 거룩한 단기 연합 예배입니다. 가정을 성전 삼아 드려지는 이 작은 예배를 통해 온전한 신앙 보살핌과 평안을 누리게 됩니다.
                </p>
                
                {/* Liturgy Order List */}
                <div className="space-y-4">
                  <h4 className="font-extrabold text-slate-900 text-base border-b border-slate-150 pb-2">기본 구역 예배 순서 가이드</h4>
                  <div className="flow-root">
                    <ul className="-mb-8">
                      <li className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black">1</span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-xs font-extrabold text-slate-900">신앙고백 및 묵상기도</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">사도신경을 고백하며 다함께 예배의 마음을 정돈합니다.</p>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black">2</span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-xs font-extrabold text-slate-900">찬송 및 인도자 기도</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">구역 찬송과 대표 기도자로 선정된 지체의 은혜로운 인도 기도.</p>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black">3</span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-xs font-extrabold text-slate-900">성경 봉독 및 말씀 나눔</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">금주의 구역 말씀 교재를 낭독하고 한 주간 은혜를 실시간 나눕니다.</p>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="relative">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black">4</span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-xs font-extrabold text-slate-900">중보기도 및 주기도문</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">가정과 구역, 교회를 위한 합심기도 후 주기도문으로 예배를 마칩니다.</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 rounded-[40px] text-white p-8 shadow-xl text-center space-y-6">
                <FileText className="h-10 w-10 text-amber-400 mx-auto" />
                <h4 className="text-base font-black">금주의 가정예배 순서지 PDF</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  구역예배 및 가정 대예배 시 활용하실 수 있는 공식 교안과 순서지 원본 파일입니다.
                </p>
                <button
                  onClick={() => alert('구역예배 순서지 다운로드:\n[빛나는교회_가정예배순서지_6월호.pdf] 파일 다운로드를 시작합니다.')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  예배 교안 다운로드 (PDF)
                </button>
              </div>

              <div className="bg-amber-50/60 p-6 rounded-3xl border border-amber-100 space-y-3">
                <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider">가정 예배 권장 사항</h5>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  - 격주 금요일 저녁 구역별 지정 세대 방문.<br/>
                  - 예배 직후 지나친 향응이나 식사를 지양하고 따뜻한 차 위주의 다과 권장.<br/>
                  - 이웃 주민 소음 방지를 위해 구역 찬송 시 음량 배려.
                </p>
              </div>
            </div>
          </div>
        </section>
        )
      )}

      {/* 9.2.1 교회학교 (어린이) */}
      {currentPage === 'kids-school' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16 animate-fadeIn">
          <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
              <div className="max-w-3xl space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Smile className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">예수님의 꿈을 꾸는 빛나는 교회학교</h3>
                <p className="text-slate-600 leading-relaxed font-light text-[15px]">
                  다음세대 어린이들이 하나님의 크신 사랑 안에서 마음껏 뛰어놀며, 바른 성경 말씀 교육을 바탕으로 건강한 기독교 가치관을 품고 성장할 수 있도록 돕습니다.
                </p>
              </div>
              <div>
                <button
                  onClick={() => alert('교회학교 안내:\n교회학교 입학 및 등록 관련 상담을 요청하셨습니다. 담당 교육전도사님이 이번 주 중으로 문자 연락 드리겠습니다.')}
                  className="bg-emerald-650 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all shrink-0"
                >
                  자녀 교회학교 등록 문의
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 영유치부 */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 space-y-5">
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">만 0세 ~ 7세</span>
                <h4 className="text-lg font-black text-slate-900">영·유치부 예배 (Dream-Seed)</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  생애 첫 신앙생활을 시작하는 아기들과 부모님이 함께 드리는 사랑 넘치는 예배입니다. 오감을 자극하는 성경 오르프 연주 놀이, 다채로운 인형극 놀이 교안 등을 가르칩니다.
                </p>
                <div className="bg-white p-4.5 rounded-2xl border border-slate-150 text-xs text-slate-600 space-y-2 font-light">
                  <div className="flex justify-between"><strong>예배 시간:</strong> <span>매주 주일 오전 10:40</span></div>
                  <div className="flex justify-between"><strong>예배 장소:</strong> <span>본관 1층 자비실</span></div>
                  <div className="flex justify-between"><strong>교육 비전:</strong> <span>말씀 안에서 바르고 착하게 자라기</span></div>
                </div>
              </div>

              {/* 초등부 */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 space-y-5">
                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-bold">초등학교 1학년 ~ 6학년</span>
                <h4 className="text-lg font-black text-slate-900">초등부 예배 (Bright-Kids)</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  학교 생활을 본격 시작하는 아이들의 눈높이에 맞춘 활기찬 찬양 워십과 체험 중심 성경공부 반별 활동입니다. 매년 여름성경학교와 말씀 캠프를 통해 성경 인격을 기릅니다.
                </p>
                <div className="bg-white p-4.5 rounded-2xl border border-slate-150 text-xs text-slate-600 space-y-2 font-light">
                  <div className="flex justify-between"><strong>예배 시간:</strong> <span>매주 주일 오전 10:40</span></div>
                  <div className="flex justify-between"><strong>예배 장소:</strong> <span>교육관 지하 1층 소강당</span></div>
                  <div className="flex justify-between"><strong>교육 비전:</strong> <span>스스로 성경 읽고 이웃 사랑 가치 갖기</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 9.2.2 청청 공동체 (청소년&청년) */}
      {currentPage === 'youth-adults' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16 animate-fadeIn">
          <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl space-y-10">
            <div className="max-w-3xl space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">비전과 열정의 세대, 청청 공동체</h3>
              <p className="text-slate-600 leading-relaxed font-light text-[15px]">
                청청 공동체는 '청소년(10대)'과 '청년(2030)'이 연합하여 복음의 기독교 가치관을 주도적으로 배우고, 세상에서 선한 영향력을 끼치는 믿음의 리더로 무장하는 열정적인 예배 공동체입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 중고등부 */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 space-y-5">
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-bold">중·고등학생 대상 (만 13세 ~ 18세)</span>
                <h4 className="text-lg font-black text-slate-900">중·고등부 예배</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  청소년 사춘기 시절의 고민과 학업 진로의 부담감을 기도로 극복하고 성경 속 비전을 향해 나아갑니다. 또래 모임을 통해 돈독한 신앙 우정을 나눕니다.
                </p>
                <div className="bg-white p-4.5 rounded-2xl border border-slate-150 text-xs text-slate-600 space-y-2 font-light">
                  <div className="flex justify-between"><strong>예배 시간:</strong> <span>매주 주일 오전 10:40</span></div>
                  <div className="flex justify-between"><strong>예배 장소:</strong> <span>목양관 3층 시온홀</span></div>
                  <div className="flex justify-between"><strong>특별 활동:</strong> <span>동계 수련회, 찬양단 워십 스쿨, 학교 기도 모임</span></div>
                </div>
              </div>

              {/* 대학청년부 */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 space-y-5">
                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-bold">대학생 및 청년 (만 19세 ~ 35세)</span>
                <h4 className="text-lg font-black text-slate-900">대학청년부 예배</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  청년 지체들이 세상의 기준을 넘어 하나님 나라를 꿈꾸며 뜨거운 찬양과 논리적인 성경공부 교제를 통해 취업, 결혼 등 삶의 비전을 함께 설계합니다.
                </p>
                <div className="bg-white p-4.5 rounded-2xl border border-slate-150 text-xs text-slate-600 space-y-2 font-light">
                  <div className="flex justify-between"><strong>예배 시간:</strong> <span>매주 주일 오후 01:30</span></div>
                  <div className="flex justify-between"><strong>예배 장소:</strong> <span>목양관 3층 시온홀</span></div>
                  <div className="flex justify-between"><strong>특별 사역:</strong> <span>국내 오지 낙도 단기선교, 소그룹 독서 토론 모임</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 9.3.1 알림 및 공지사항 (교회소식) */}
      {currentPage === 'announcement' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-8 animate-fadeIn">
          <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-150 pb-4">
              <h3 className="text-xl font-black text-slate-900">빛나는교회 알림 소식 게시판</h3>
              <span className="text-xs text-slate-400 font-mono font-medium">총 {churchNews.length}건</span>
            </div>

            <div className="divide-y divide-slate-150 space-y-4">
              {churchNews.map((news) => (
                <button
                  key={news.id}
                  onClick={() => setSelectedNews(news)}
                  className="w-full text-left py-5 px-3 hover:bg-slate-50/70 rounded-2xl transition-all duration-150 block group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9.5px] font-bold px-2.5 py-0.5 rounded-full ${
                          news.category === '공지사항' 
                            ? 'bg-red-50 text-red-700 border border-red-200' 
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          {news.category}
                        </span>
                        <span className="text-[11.5px] text-slate-400 font-mono font-medium">{news.date}</span>
                      </div>
                      <h4 className="text-sm md:text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                        {news.title}
                      </h4>
                      <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-light">{news.content}</p>
                    </div>
                    <ChevronRight className="h-4.5 w-4.5 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9.3.2 갤러리 (교회활동) */}
      {currentPage === 'activity-gallery' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-10 animate-fadeIn">
          <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
            <div className="flex justify-between items-end border-b border-slate-150 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">빛나는교회 아름다운 사진첩</h3>
                <p className="text-xs text-slate-400 mt-1">예배와 교육, 소그룹 모임 등 성도들의 거룩한 만남의 교제 현장을 생생히 전해드립니다.</p>
              </div>
            </div>

            {loadingGallery ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 font-medium">사진첩 목록을 불러오는 중...</p>
              </div>
            ) : galleryCategories.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-2xl">
                등록된 사진첩이 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {galleryCategories.map((cat) => {
                  const latestAlbum = cat.albums?.[0];
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat);
                      }}
                      className="group bg-slate-50/50 hover:bg-white rounded-3xl overflow-hidden border border-slate-150 shadow-sm hover:shadow-xl transition-all duration-300 transform text-left"
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-200">
                        <img 
                          src={latestAlbum ? latestAlbum.coverUrl : 'https://images.unsplash.com/photo-1456406644174-8dba4c7f7d2c?auto=format&fit=crop&q=80&w=800'} 
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md backdrop-blur-sm shadow flex items-center gap-1">
                          <FolderOpen className="h-3.5 w-3.5 text-blue-400" />
                          <span>폴더 열기</span>
                        </span>
                      </div>
                      <div className="p-5.5 space-y-2">
                        <span className="text-[10px] text-blue-600 font-extrabold uppercase">카테고리 폴더</span>
                        <h4 className="text-sm md:text-base font-black text-slate-900 line-clamp-1 group-hover:text-blue-700 transition-colors leading-tight">
                          {cat.name}
                        </h4>
                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                          <span>등록 앨범: {cat.albums ? cat.albums.length : 0}개</span>
                          <span>{latestAlbum ? latestAlbum.date : ''}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 9.3.3 서식 자료실 */}
      {currentPage === 'form-archive' && (
        renderPermissionLock('정회원') || (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-10 animate-fadeIn">
          <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
            <div>
              <h3 className="text-xl font-black text-slate-900">교회 서식 자료 및 주보실</h3>
              <p className="text-xs text-slate-400 mt-1">빛나는교회 성도님들의 다양한 신앙 행정 절차 신청서 및 최근 주보 파일을 다운로드받으실 수 있습니다.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { title: '교적부 새신자 등록 원서', desc: '새가족 가입 후 교인 명부 등재용 신청서입니다.', file: '빛나는교회_교적원서.pdf' },
                { title: '수례/입교 희망 신청원', desc: '세례 및 입교 문답을 위한 공식 서식 원지입니다.', file: '세례희망신청원.pdf' },
                { title: '유아 세례 신청서', desc: '만 2세 미만 자녀의 유아세례 문답 신청원입니다.', file: '유아세례신청원.pdf' },
                { title: '차량 등록 및 운행 증명원', desc: '성전 전용 주차권 및 차량 운행 신청원 양식.', file: '차량등록원서.pdf' },
                { title: '기부금(헌금) 증명서 신청서', desc: '연말정산 헌금 영수증 발급용 행정 청원원.', file: '기부금증명신청서.pdf' },
                { title: '구역 연합 묵상지 순서교재', desc: '이번 달 가정/구역예배 순서지가 내장된 인쇄 파일.', file: '구역예배순서지_6월호.pdf' },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-150 hover:border-blue-200 transition-all flex flex-col justify-between space-y-5">
                  <div className="space-y-2.5">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <h4 className="text-xs md:text-sm font-black text-slate-900 leading-snug">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-light">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => alert(`서식 파일 다운로드 시작:\n[${item.file}] 파일을 다운로드 하였습니다.`)}
                    className="w-full bg-white hover:bg-slate-900 hover:text-white border border-slate-200 font-extrabold text-[10.5px] py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1 text-slate-800"
                  >
                    <Download className="h-3.5 w-3.5 text-blue-600" />
                    서식 원본 받기 (PDF)
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
        )
      )}

      {/* 9.4.1 교우 기업 소식 */}
      {currentPage === 'member-business' && (
        renderPermissionLock('로그인') || (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-10 animate-fadeIn">
          <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-6">
              <div className="max-w-3xl space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">서로 돕고 연합하는 교우 기업 소식</h3>
                <p className="text-slate-600 leading-relaxed font-light text-[15px]">
                  빛나는교회 성도님들이 운영하시는 업종과 일터를 소개합니다. 서로 이용하고 기도로 응원하여 주 안에서 아름다운 경제 공동체를 이루어가기를 소망합니다.
                </p>
              </div>
              <button
                onClick={() => alert('기업 등록 문의:\n교우 기업 등록 신청을 요청하셨습니다. 교회 사무국에서 등록 양식을 문자로 안내해 드리겠습니다.')}
                className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-5 py-3.5 rounded-xl shadow-md transition-all shrink-0"
              >
                교우 기업 신규 등록 신청
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { title: '빛나는 베이커리', tag: '식음료', location: '구로구 개봉동', desc: '매일 아침 유기농 밀가루로 건강하고 정직한 빵을 굽는 따스한 빵집입니다. 주일 성도 할인 10% 지원.' },
                { title: '에덴 인테리어 & 디자인', tag: '주거/설비', location: '구로구 구로동', desc: '실내 주택 인테리어 리모델링, 욕실 리모델링 전문 에이전시입니다. 성도 세대 꼼꼼하고 저렴히 책임 시공.' },
                { title: '소망 자동차 종합 정비', tag: '정비/수리', location: '구로구 오류동', desc: '자동차 정비, 엔진오일 교환, 정기 검사 대행 전문 카센터입니다. 정직한 진단과 수리 보장.' },
                { title: '시온 연합 크리닝 (세탁소)', tag: '생활서비스', location: '금천구 독산동', desc: '겨울 이불 세탁, 드라이클리닝 전문 수거 배달 세탁소입니다. 은혜의 집사 집안 운영.' },
                { title: '예안 온가족 한의원', tag: '의료/건강', location: '광명시 철산동', desc: '성도 관절 물리치료, 보약 한약 진단 전문 한의원입니다. 성도님 내원 시 특별 상담 지원.' },
              ].map((biz, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{biz.tag}</span>
                      <span className="text-[10px] text-slate-400 font-mono font-medium">{biz.location}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900">{biz.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">{biz.desc}</p>
                  </div>
                  <div className="text-[11px] font-bold text-amber-600 bg-white p-2.5 rounded-xl border border-slate-150 text-center">
                    사무처 공식 제휴 교우 업체
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )
      )}

      {/* 9.4.2 셔틀 및 차량운행 정보 */}
      {currentPage === 'car-transportation' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-10 animate-fadeIn">
          <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
            <div className="max-w-3xl space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Car className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">셔틀버스 노선 및 차량 운행 안내</h3>
              <p className="text-slate-600 leading-relaxed font-light text-[15px]">
                빛나는교회는 주일 대예배에 참석하시는 성도님들의 편안한 성전 이동을 위하여 셔틀버스를 매주 순환 운영하고 있습니다. 정차 코스 및 노선표를 미리 확인하십시오.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* 1호차 */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 space-y-5">
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-bold">1호차 (개봉역 방면 코스)</span>
                <h4 className="text-lg font-black text-slate-900">개봉역/고척동 주일 순환선</h4>
                
                <div className="relative border-l-2 border-blue-400 pl-4.5 space-y-5 py-2 font-mono text-xs">
                  <div className="relative">
                    <span className="absolute -left-[23.5px] top-1 h-3.5 w-3.5 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-300"></span>
                    <strong>개봉역 1번 출구 버스정류장 뒤편 (출발)</strong>
                    <span className="block text-[11px] text-slate-400 mt-0.5">운행 시각: 1부(08:30) / 2부(10:20)</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[23.5px] top-1 h-3.5 w-3.5 rounded-full bg-slate-400 border-2 border-white ring-2 ring-slate-300"></span>
                    <strong>고척사거리 농협 은행 앞 정차</strong>
                    <span className="block text-[11px] text-slate-400 mt-0.5">운행 시각: 1부(08:38) / 2부(10:28)</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[23.5px] top-1 h-3.5 w-3.5 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-300"></span>
                    <strong>빛나는교회 성전 로비 광장 (도착)</strong>
                    <span className="block text-[11px] text-slate-400 mt-0.5">도착 예정: 1부(08:50) / 2부(10:40)</span>
                  </div>
                </div>
              </div>

              {/* 2호차 */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 space-y-5">
                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-bold">2호차 (광명/철산 방면 코스)</span>
                <h4 className="text-lg font-black text-slate-900">철산역/광명사거리 주일 순환선</h4>
                
                <div className="relative border-l-2 border-indigo-400 pl-4.5 space-y-5 py-2 font-mono text-xs">
                  <div className="relative">
                    <span className="absolute -left-[23.5px] top-1 h-3.5 w-3.5 rounded-full bg-indigo-500 border-2 border-white ring-2 ring-indigo-300"></span>
                    <strong>철산역 2번 출구 다이소 앞 (출발)</strong>
                    <span className="block text-[11px] text-slate-400 mt-0.5">운행 시각: 1부(08:35) / 2부(10:25)</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[23.5px] top-1 h-3.5 w-3.5 rounded-full bg-slate-400 border-2 border-white ring-2 ring-slate-300"></span>
                    <strong>광명사거리역 3번 출구 기업은행 앞</strong>
                    <span className="block text-[11px] text-slate-400 mt-0.5">운행 시각: 1부(08:43) / 2부(10:33)</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[23.5px] top-1 h-3.5 w-3.5 rounded-full bg-indigo-500 border-2 border-white ring-2 ring-indigo-300"></span>
                    <strong>빛나는교회 성전 로비 광장 (도착)</strong>
                    <span className="block text-[11px] text-slate-400 mt-0.5">도착 예정: 1부(08:55) / 2부(10:45)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl text-xs text-amber-900 space-y-1.5 leading-relaxed font-light">
              <strong>차량 이용 및 성전 주차 수칙 필독 안내:</strong><br/>
              - 주일 오전 성전 내 주차 공간이 매우 협소하오니 가급적 대중교통 및 교회 셔틀버스를 적극 이용해 주시기를 정중히 청합니다.<br/>
              - 승용차 방문 성도님들은 주차 요원 집사님들의 안내 수령 방향에 즉시 순응하셔서 일렬 평행 주차해 주셔야 비상 소방 차량 진입이 지연되지 않습니다.
            </div>
          </div>
        </section>
      )}

      {/* 9.4.3 안전 및 편의 위원회 */}
      {currentPage === 'safety-guide' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-10 animate-fadeIn">
          <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
            <div className="max-w-3xl space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">쾌적하고 안전한 교회를 돕는 편의위원회</h3>
              <p className="text-slate-600 leading-relaxed font-light text-[15px]">
                안전 및 편의위원회는 화재 예방 방제 순찰, 건물 시설물 상시 점검, 전염 소독 보건, 주일 거동이 불편하신 성도님과 노약자 휠체어 전용 보조 에스코트를 전담 지원하여 가장 안락한 예배 환경을 제공하는 사랑의 부서입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
                <h4 className="text-sm font-extrabold text-slate-900">소방 방재 및 시설 안전</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  각 대예배당 및 교육 부서실에 고성능 K급 소화기 설치 현황을 매월 정밀 점검하고 비상 유도등 배터리 교체를 돌보며, 비상시 신속히 탈출 통로를 확보할 수 있도록 지휘 통제합니다.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
                <h4 className="text-sm font-extrabold text-slate-900">보조 편의 서비스</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  성전 주 출입구 경사판 배치, 휠체어 구비 보관, 거동 불편 성도용 전용 주차 슬롯 통제 및 유모차 대여를 통해 장애인 및 임산부 노약자들의 예배당 이용 진입벽을 완전히 낮춥니다.
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
                <h4 className="text-sm font-extrabold text-slate-900">보건 방역 및 긴급 구조</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  성도님들이 호흡하시는 공기질 필터 교체 관리 및 예배 중 불의의 졸도 또는 응급 사태가 연출될 경우 신속히 행정처 구비 자동제세동기(AED)를 지참 에스코트할 수 있는 요원망 구축.
                </p>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl text-xs text-rose-900 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="leading-relaxed font-light text-left">
                <strong>안전 및 긴급 에스코트 연락처:</strong><br/>
                예배 시 비상 안전사고 발생, 거동 휠체어 보조 지원이 긴급히 요청될 경우 본당 행정실 대표 번호로 즉각 제보하여 수령하십시오.
              </div>
              <button
                onClick={() => alert('긴급 연결망 안내:\n안전위원회 긴급 당직자(내선 101)와 다이렉트 통화를 연결하였습니다.')}
                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow transition-transform hover:-translate-y-0.5 active:scale-95 shrink-0"
              >
                긴급 핫라인 전화 연결
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 10. REALISTIC FOOTER */}
      <footer className="bg-slate-900 text-slate-350 pt-16 pb-12 border-t border-slate-800" id="footer-map">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-slate-800 pb-12">
            
            <div className="md:col-span-4 space-y-4">
              <a href="#" onClick={(e) => { e.preventDefault(); navigateToPage('home'); }} className="flex items-center gap-2 group">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-blue-700 shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-6-8h12" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-md font-bold text-white tracking-tight">빛나는 교회</span>
                  <span className="text-[8.5px] uppercase tracking-widest text-slate-500 font-mono font-bold leading-tight">The Brightening Church</span>
                </div>
              </a>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                성령의 충만과 순전한 섬김으로 하나님의 거룩하신 영광을 세상에 밝게 드러내는 빛나는 교회입니다. 소중한 당신과 주님의 성전을 함께 이룹니다.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a 
                  href="https://www.youtube.com/@TheBrighteningchurch"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"
                  title="유튜브 바로가기"
                >
                  <Youtube className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

            <div className="md:col-span-4 space-y-4 text-xs">
              <h4 className="text-white font-extrabold text-xs uppercase tracking-widest border-l-2 border-blue-600 pl-2">
                교회 연락 주소록
              </h4>
              <ul className="space-y-3 pt-1 text-slate-400">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>서울특별시 구로구 개봉동 주 소성전 (빛나는 가을길 12번길)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>사무실 전화번호: 02-1234-5678 (주중 09:00 - 18:00)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>대표 이메일: info@tbchch.com</span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-4">
              <h4 className="text-white font-extrabold text-xs uppercase tracking-widest border-l-2 border-blue-600 pl-2">
                교회 오는길 (약도 보기)
              </h4>
              
              {/* Interactive map card mockup that acts beautifully mock GPS location */}
              <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-32 md:h-36 relative shadow-inner group">
                <div className="absolute inset-0 bg-cover bg-center opacity-45" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135339-9140b00785e8?auto=format&fit=crop&q=80&w=600')" }}></div>
                <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center p-3 text-center transition-opacity group-hover:bg-slate-950/70 z-10">
                  <span className="text-[10px] text-blue-400 font-extrabold uppercase font-sans">Gps Navigation Mock</span>
                  <p className="text-xs text-white font-bold mt-1">빛나는교회 네비게이션 약도</p>
                  <button 
                    onClick={() => alert('네이버/카카오 지도 연동:\n"빛나는교회" 주소를 복사했습니다. 네비게이션 앱에 붙여넣으십시오.\n주소: 서울특별시 구로구 개봉동 123-45')}
                    className="mt-2.5 bg-blue-600 hover:bg-blue-750 text-white font-mono font-bold text-[10px] px-3 py-1 rounded transition-transform hover:scale-105 active:scale-95"
                  >
                    주소 복사하기
                  </button>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div className="text-center md:text-left space-y-1">
              <p>© 2026 빛나는 교회 (The Brightening Church). All rights reserved.</p>
              <p className="text-[10px] text-slate-600">본 온라인 리뉴얼 홈페이지 시안은 10년 차 수석 에이전시 기획 제안서가 내장되어 실시간 프리폴링 시안을 제공합니다.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={onOpenPlanning} className="hover:text-white py-1 transition-colors">기획 분석 가이드</button>
              <button onClick={() => setBulletinModalOpen(true)} className="hover:text-white py-1 transition-colors">금주 주보파일</button>
            </div>
          </div>

        </div>
      </footer>

      {/* 11. AUXILIARY POPUP MODAL 1: 금주의 주보 다운로드 팝업 */}
      {bulletinModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-scaleUp">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                <h3 className="font-extrabold text-md">빛나는교회 주보 다운로드</h3>
              </div>
              <button 
                onClick={() => setBulletinModalOpen(false)}
                className="text-slate-400 hover:text-white rounded-full p-1"
                title="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100 items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-950 leading-relaxed">
                  <span className="font-bold block text-sm mb-1">2026년 6월 둘째 주 주보 안내</span>
                  금주 은혜 가득한 소식 주보와 구역 성경공부 교습 가이드 원본을 PDF 파일로 다운로드합니다. 소그룹 모임 시 지참하여 오시기 바래요.
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    alert('주보 다운로드 알림:\n[빛나는교회_주보_20260607.pdf] 파일 다운로드를 개시했습니다!');
                    setBulletinModalOpen(false);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm py-3.5 rounded-xl shadow transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Download className="h-4.5 w-4.5" />
                  이번주 주보 원본 다운로드 (PDF)
                </button>
                <button
                  onClick={() => {
                    alert('구역 큐티지 배부 알림:\n[빛의숨결_성경공부교안_6월호.pdf] 파일 다운로드를 성공했습니다.');
                    setBulletinModalOpen(false);
                  }}
                  className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="h-4.5 w-4.5 text-blue-600" />
                  구역 묵상지 "빛의 숨결" 가이드 받기
                </button>
              </div>

              <p className="text-center text-[10.5px] text-slate-400 font-mono">
                구료세례등록 등 기타 행정원문은 주일 사무처 혹은 GNB 갤러리/서식실에서 가능합니다.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* 12. AUXILIARY POPUP MODAL 2: 새가족 온라인 신청 폼 */}
      {newFamilyFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-scaleUp">
            
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <h3 className="font-extrabold text-md">새가족 온라인 등록 원서</h3>
              </div>
              <button 
                onClick={() => setNewFamilyFormOpen(false)}
                className="text-white/80 hover:text-white rounded-full p-1"
                title="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as any;
              const name = target.familyName.value.trim();
              const phone = target.familyPhone.value.trim();
              const note = target.familyNote.value.trim();

              try {
                const families = JSON.parse(localStorage.getItem('tbch_new_families') || '[]');
                const newRecord = {
                  id: Date.now(),
                  name,
                  phone,
                  note,
                  registeredAt: new Date().toISOString()
                };
                families.push(newRecord);
                localStorage.setItem('tbch_new_families', JSON.stringify(families));
                
                alert('새가족 등록 완료:\n빛나는 교회 온라인 새가족 등록이 완료되었습니다!\n확인 후 인도자 부서에서 곧 친절하게 웰컴 안내 전화를 드리겠습니다.');
                setNewFamilyFormOpen(false);
              } catch (err) {
                console.error(err);
                alert('새가족 등록 중 오류가 발생했습니다.');
              }
            }} className="p-6 space-y-4">
              
              <div className="text-xs text-slate-500 leading-normal bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <strong className="text-slate-800 block text-sm mb-1">온라인으로 빛나는 가족이 되세요!</strong>
                온라인 등록 접수 시 주일 대예배 등록처에서 웰컴 기프트 세트와 담임목사님 명필 성서 패키지를 수령할 수 있도록 연동됩니다.
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 tracking-tight">지체(성도) 이름</label>
                  <input required name="familyName" placeholder="홍길동" className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 tracking-tight">연락처 전화번호</label>
                  <input required name="familyPhone" placeholder="010-1234-5678" className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 tracking-tight">비고 (거주 동명 혹은 인도 성도 존스)</label>
                  <input name="familyNote" placeholder="인도자 성함 혹은 요청사항 기재" className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-3 rounded-lg shadow-md hover:scale-101 active:scale-99 transition-transform"
                >
                  가족 등록 신청서 전송
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 13. AUXILIARY POPUP MODAL 3: 새소식 상세 보기 팝업 */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-scaleUp">
            
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
              <span className="bg-blue-600 text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase">
                {selectedNews.category}
              </span>
              <button 
                onClick={() => setSelectedNews(null)}
                className="text-slate-400 hover:text-white rounded-full p-1"
                title="단일창 닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <span className="text-xs text-slate-400 font-mono tracking-tight block">{selectedNews.date} | 작성처: {selectedNews.writer}</span>
              <h3 className="text-base md:text-lg font-black text-slate-900 mt-1.5 leading-tight">{selectedNews.title}</h3>
              <div className="w-8 h-1 bg-blue-600 my-4 rounded-full" />
              
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-light whitespace-pre-line">
                {selectedNews.content}
              </p>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedNews(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4"
                >
                  확인 완료
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 14. AUXILIARY POPUP MODAL 4: 갤러리 디테일 보기 (행사 앨범 폴더 뷰어) */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 animate-scaleUp flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full inline-block font-sans">
                  {selectedActivity.category}
                </span>
                <span className="text-slate-400 text-xs font-mono font-medium ml-2">{selectedActivity.date} 행사</span>
                <h3 className="text-md font-extrabold text-slate-900 mt-1 leading-snug">{selectedActivity.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedActivity(null)}
                className="bg-slate-100 text-slate-500 rounded-full p-2 hover:bg-slate-200 transition-colors"
                title="앨범 닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Photos Viewer Section */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 flex flex-col justify-between">
              {(() => {
                const photosList = selectedActivity.photos && selectedActivity.photos.length > 0 
                  ? selectedActivity.photos 
                  : [selectedActivity.imageUrl || selectedActivity.coverUrl];
                const activePhotoUrl = photosList[activePhotoIndex] || selectedActivity.imageUrl || selectedActivity.coverUrl;

                return (
                  <div className="space-y-4">
                    {/* Large image with navigation controls */}
                    <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden group border border-slate-100 flex items-center justify-center">
                      <img 
                        src={activePhotoUrl} 
                        alt={`${selectedActivity.title} - 사진 ${activePhotoIndex + 1}`} 
                        className="max-w-full max-h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Left Arrow */}
                      {photosList.length > 1 && (
                        <button
                          onClick={() => setActivePhotoIndex((prev) => (prev - 1 + photosList.length) % photosList.length)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors focus:outline-none"
                          title="이전 사진"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      )}

                      {/* Right Arrow */}
                      {photosList.length > 1 && (
                        <button
                          onClick={() => setActivePhotoIndex((prev) => (prev + 1) % photosList.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors focus:outline-none"
                          title="다음 사진"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}

                      {/* Photo Index Counter Badge */}
                      <span className="absolute bottom-4 right-4 bg-black/70 text-white text-[11px] font-mono px-3 py-1 rounded-full tracking-wider">
                        {activePhotoIndex + 1} / {photosList.length}
                      </span>
                    </div>

                    {/* Thumbnail Carousel / Grid */}
                    {photosList.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                        {photosList.map((url, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActivePhotoIndex(idx)}
                            className={`relative w-20 aspect-video rounded-lg overflow-hidden flex-shrink-0 transition-all border-2 ${
                              activePhotoIndex === idx 
                                ? 'border-blue-600 scale-95 shadow-md' 
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img 
                              src={url} 
                              alt="썸네일" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Album Description */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl flex-shrink-0">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <strong className="text-xs font-black text-slate-800 block">빛나는교회 행사 사진첩 안내</strong>
                  <p className="text-xs text-slate-500 leading-relaxed leading-normal">
                    본 행사의 모든 사진들은 구글 드라이브와 실시간 동기화되어 있으며, 이 앨범 창 내에서 좌우 화살표나 아래 썸네일을 클릭해 감상하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button 
                onClick={() => setSelectedActivity(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-all"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 16. NEW MODAL: 카테고리 내부 앨범 폴더 목록 보기 */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-slate-100 animate-scaleUp flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-blue-600" />
                <h3 className="text-md md:text-lg font-black text-slate-900">
                  {selectedCategory.name} 폴더 내부
                </h3>
                <span className="text-xs text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full font-mono font-medium">
                  총 {selectedCategory.albums ? selectedCategory.albums.length : 0}개
                </span>
              </div>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="bg-slate-200 text-slate-600 rounded-full p-2 hover:bg-slate-300 transition-colors"
                title="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: Albums grid inside Category */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <p className="text-xs text-slate-400 font-medium">
                원하시는 행사 폴더를 클릭하시면 폴더 내부의 사진들을 슬라이드로 감상하실 수 있습니다.
              </p>
              
              {!selectedCategory.albums || selectedCategory.albums.length === 0 ? (
                <div className="py-20 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-2xl">
                  이 카테고리 폴더 내에 등록된 행사 사진첩이 없습니다.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {selectedCategory.albums.map((album: any) => (
                    <button
                      key={album.id}
                      onClick={() => {
                        setSelectedActivity(album);
                        setActivePhotoIndex(0);
                      }}
                      className="group bg-white rounded-2xl overflow-hidden border border-slate-150 shadow-md hover:shadow-xl transition-all duration-300 transform text-left"
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-100">
                        <img 
                          src={album.coverUrl} 
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-3 right-3 bg-blue-600/90 text-white text-[10px] font-extrabold px-2 py-1 rounded-md backdrop-blur-sm shadow flex items-center gap-1">
                          <FolderOpen className="h-3.5 w-3.5" />
                          <span>{album.photos ? album.photos.length : 0}장</span>
                        </span>
                      </div>
                      <div className="p-4">
                        <span className="text-[10px] text-slate-400 font-mono font-semibold">{album.date}</span>
                        <h4 className="text-xs md:text-sm font-extrabold text-slate-900 mt-1 line-clamp-2 group-hover:text-blue-700 transition-colors leading-snug">
                          {album.title}
                        </h4>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-all"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 15. QUICK SCROLL BACK TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 bg-slate-900 hover:bg-blue-600 text-white hover:scale-110 p-3 rounded-full shadow-2xl transition-all duration-200 border border-slate-700 hover:border-blue-500"
          title="상단으로 이동"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Floating Meditation Button */}
      <button
        onClick={() => setMeditationOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-700 to-indigo-900 hover:from-blue-800 hover:to-indigo-950 text-white font-extrabold text-xs px-4.5 py-3 rounded-full shadow-2xl transition-all duration-200 border border-indigo-500 hover:scale-105 flex items-center gap-1.5 cursor-pointer"
        title="오늘의 묵상 보기"
      >
        <BookOpen className="h-4 w-4 text-amber-300 animate-pulse" />
        <span>오늘의 묵상 📖</span>
      </button>

      {/* 17. 오늘의 묵상 팝업창 */}
      {meditationOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-scaleUp flex flex-col relative">
            
            {/* Header with Warm Serene Gradient */}
            <div className="px-6 py-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white relative">
              <div className="absolute right-4 top-4">
                <button 
                  onClick={() => handleCloseMeditation(false)}
                  className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1.5 transition-all cursor-pointer"
                  title="닫기"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-amber-400 font-extrabold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                Today's Meditation
              </span>
              <h3 className="text-md font-black mt-2 flex items-center gap-1.5">
                <BookOpen className="h-4.5 w-4.5 text-amber-400" />
                오늘의 묵상
              </h3>
              <p className="text-[10px] text-indigo-200 mt-1 font-mono font-medium">
                {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 flex-1">
              
              {/* Scripture Passage Box */}
              <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-black font-sans uppercase">오늘의 말씀</span>
                  <span className="text-xs text-amber-800 font-bold font-serif">시편 23편 1-3절</span>
                </div>
                <p className="text-xs md:text-sm font-serif italic text-slate-800 leading-relaxed pl-2 border-l-2 border-amber-300">
                  “여호와는 나의 목자시니 내게 부족함이 없으리로다 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물가로 인도하시는도다 내 영혼을 소생시키시고 자기 이름을 위하여 의의 길로 인도하시는도다”
                </p>
              </div>

              {/* Meditation Text Summary */}
              <div className="space-y-2 text-left">
                <h4 className="text-xs font-black text-indigo-950 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                  목자 되신 주님과의 동행
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  하나님이 우리의 목자가 되어 주실 때, 우리는 어떠한 시련이나 결핍 속에서도 부족함이 없다고 고백할 수 있습니다. 오늘 하루도 나의 영혼을 소생시키시고 의의 길로 인도하시는 주님의 음성에 귀를 기울이며, 주님이 예비하신 푸른 풀밭과 쉴 만한 물가를 기쁨으로 누리기를 소망합니다.
                </p>
              </div>

              {/* External Link Action Button */}
              <div className="pt-2">
                <a
                  href={TODAY_MEDITATION_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-indigo-900 hover:bg-indigo-950 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-transform hover:-translate-y-0.5 active:scale-98 cursor-pointer"
                >
                  <span>묵상글 전문 읽기 및 연동</span>
                  <ExternalLink className="h-3.5 w-3.5 text-amber-300" />
                </a>
              </div>
            </div>

            {/* Footer with "Do not show again today" */}
            <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50 text-[10.5px] text-slate-500 font-medium">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-800 select-none">
                <input 
                  type="checkbox" 
                  id="hideMeditationCheckbox"
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                />
                <span>오늘 하루 이 창 열지 않기</span>
              </label>
              <button
                onClick={() => {
                  const checkbox = document.getElementById('hideMeditationCheckbox') as HTMLInputElement;
                  handleCloseMeditation(checkbox?.checked || false);
                }}
                className="text-slate-900 hover:text-blue-600 font-extrabold cursor-pointer"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 18. ADMINISTRATOR PANEL */}
      {currentPage === ('admin' as any) && (
        currentUser && currentUser.role === 'admin' ? (
          <section className="relative overflow-hidden bg-[#f8fafc] py-12 md:py-16 min-h-screen animate-fadeIn" id="admin-panel-page">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex justify-between items-end border-b border-slate-200 pb-3 mb-10">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 font-sans flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-blue-700" />
                  관리자 시스템 설정 모드
                </h2>
                <span className="text-[11px] md:text-xs text-slate-400 font-medium font-sans">SYSTEM &gt; ADMIN PANEL</span>
              </div>

              <div className="flex border-b border-slate-200 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                <button
                  onClick={() => setAdminTab('users')}
                  className={`flex-1 py-3 text-center text-xs font-black rounded-xl transition-all ${
                    adminTab === 'users'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  성도 등급 및 권한 설정
                </button>
                <button
                  onClick={() => setAdminTab('families')}
                  className={`flex-1 py-3 text-center text-xs font-black rounded-xl transition-all ${
                    adminTab === 'families'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  온라인 새가족 등록 명단
                </button>
              </div>

              {adminTab === 'users' && (
                <div className="bg-white rounded-3xl border border-slate-150 shadow-md overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                      <h3 className="font-extrabold text-slate-950 text-sm">성도 명단 및 등급 통제</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">회원가입한 성도들의 등급(정회원/준회원/새가족) 및 관리자 권한을 관리합니다.</p>
                    </div>
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold px-3 py-1 rounded-full border border-blue-100">
                      실시간 동기화 데이터
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="bg-slate-100/50 text-[11px] font-black uppercase text-slate-500 tracking-wider border-b border-slate-150">
                          <th className="px-6 py-4">아이디 (ID)</th>
                          <th className="px-6 py-4">이름</th>
                          <th className="px-6 py-4">성별</th>
                          <th className="px-6 py-4">소속 교단</th>
                          <th className="px-6 py-4">연락처</th>
                          <th className="px-6 py-4">가입일</th>
                          <th className="px-6 py-4">등급 설정</th>
                          <th className="px-6 py-4">권한</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(() => {
                          const users = JSON.parse(localStorage.getItem('tbch_users') || '[]');
                          return users.map((user: any, idxVal: number) => (
                            <tr key={idxVal} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-mono font-bold text-slate-600">{user.username}</td>
                              <td className="px-6 py-4 font-extrabold text-slate-950">{user.name}</td>
                              <td className="px-6 py-4 text-slate-500">{user.gender}</td>
                              <td className="px-6 py-4 text-slate-500">{user.denomination}</td>
                              <td className="px-6 py-4 text-slate-600 font-mono">{user.phone}</td>
                              <td className="px-6 py-4 text-slate-400 font-mono text-[10px]">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : '-'}
                              </td>
                              <td className="px-6 py-3">
                                <select
                                  value={user.grade}
                                  onChange={(e) => {
                                    const newGrade = e.target.value;
                                    const updatedUsers = [...users];
                                    updatedUsers[idxVal].grade = newGrade;
                                    localStorage.setItem('tbch_users', JSON.stringify(updatedUsers));
                                    
                                    if (currentUser && currentUser.username === user.username) {
                                      const updatedUserObj = { ...currentUser, grade: newGrade };
                                      localStorage.setItem('tbch_current_user', JSON.stringify(updatedUserObj));
                                      setCurrentUser(updatedUserObj);
                                    }
                                    
                                    alert(`${user.name} 성도님의 등급이 [${newGrade}](으)로 변경되었습니다.`);
                                  }}
                                  className="border border-slate-300 rounded px-2 py-1 bg-white text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                >
                                  <option value="정회원">정회원</option>
                                  <option value="준회원">준회원</option>
                                  <option value="새가족">새가족</option>
                                </select>
                              </td>
                              <td className="px-6 py-3">
                                <select
                                  value={user.role}
                                  onChange={(e) => {
                                    const newRole = e.target.value;
                                    const updatedUsers = [...users];
                                    updatedUsers[idxVal].role = newRole;
                                    localStorage.setItem('tbch_users', JSON.stringify(updatedUsers));

                                    if (currentUser && currentUser.username === user.username) {
                                      const updatedUserObj = { ...currentUser, role: newRole };
                                      localStorage.setItem('tbch_current_user', JSON.stringify(updatedUserObj));
                                      setCurrentUser(updatedUserObj);
                                    }

                                    alert(`${user.name} 성도님의 시스템 권한이 [${newRole}](으)로 변경되었습니다.`);
                                  }}
                                  className="border border-slate-300 rounded px-2 py-1 bg-white text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                >
                                  <option value="member">일반성도</option>
                                  <option value="admin">관리자</option>
                                </select>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {adminTab === 'families' && (
                <div className="bg-white rounded-3xl border border-slate-150 shadow-md overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                      <h3 className="font-extrabold text-slate-950 text-sm">온라인 새가족 접수 내역</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">성도들이 홈페이지에서 등록 신청한 실시간 새가족 가등록 명단입니다.</p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-100">
                      신청자 관리 폴더
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="bg-slate-100/50 text-[11px] font-black uppercase text-slate-500 tracking-wider border-b border-slate-150">
                          <th className="px-6 py-4">신청자 성함</th>
                          <th className="px-6 py-4">연락처 전화번호</th>
                          <th className="px-6 py-4">거주지 / 인도자 비고</th>
                          <th className="px-6 py-4">신청 일시</th>
                          <th className="px-6 py-4 text-center">동작</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(() => {
                          const families = JSON.parse(localStorage.getItem('tbch_new_families') || '[]');
                          if (families.length === 0) {
                            return (
                              <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                                  접수된 새가족 신청자가 없습니다.
                                </td>
                              </tr>
                            );
                          }
                          return families.map((fam: any, idxVal: number) => (
                            <tr key={fam.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-extrabold text-slate-950">{fam.name}</td>
                              <td className="px-6 py-4 font-mono text-slate-600">{fam.phone}</td>
                              <td className="px-6 py-4 text-slate-500">{fam.note || '-'}</td>
                              <td className="px-6 py-4 text-slate-400 font-mono text-[10px]">
                                {fam.registeredAt ? new Date(fam.registeredAt).toLocaleString('ko-KR') : '-'}
                              </td>
                              <td className="px-6 py-3 text-center">
                                <button
                                  onClick={() => {
                                    if (confirm(`${fam.name} 새가족 신청 내역을 완료 처리하고 삭제하시겠습니까?`)) {
                                      const updated = families.filter((f: any) => f.id !== fam.id);
                                      localStorage.setItem('tbch_new_families', JSON.stringify(updated));
                                      navigateToPage('admin' as any);
                                      alert('삭제 및 처리 완료되었습니다.');
                                    }
                                  }}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[10.5px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                                >
                                  처리/삭제
                                </button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </section>
        ) : (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <p className="text-slate-500 text-sm font-bold">비정상적인 접근입니다. 관리자로 로그인해주세요.</p>
          </div>
        )
      )}

      {/* 19. LOGIN MODAL */}
      {loginModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 animate-scaleUp">
            
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-amber-400" />
                <h3 className="font-extrabold text-md">성도 로그인</h3>
              </div>
              <button 
                onClick={() => setLoginModalOpen(false)}
                className="text-white/80 hover:text-white rounded-full p-1 cursor-pointer"
                title="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as any;
              const username = target.username.value.trim();
              const password = target.password.value;

              try {
                const users = JSON.parse(localStorage.getItem('tbch_users') || '[]');
                const user = users.find(
                  (u: any) =>
                    u.username === username || u.name === username
                );

                if (user && user.password === password) {
                  localStorage.setItem('tbch_current_user', JSON.stringify(user));
                  setCurrentUser(user);
                  setLoginModalOpen(false);
                  alert(`${user.name}님, 로그인되었습니다.`);
                  if (user.role === 'admin') {
                    navigateToPage('admin' as any);
                  }
                } else {
                  alert('아이디 또는 비밀번호가 올바르지 않습니다.');
                }
              } catch (err) {
                console.error(err);
                alert('로그인 처리 중 오류가 발생했습니다.');
              }
            }} className="p-6 space-y-4">
              
              <div className="space-y-3 bg-white">
                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 tracking-tight text-left">아이디 (ID 또는 성함)</label>
                  <input required name="username" placeholder="아이디 또는 이름 입력" className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" />
                </div>
                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 tracking-tight text-left">비밀번호</label>
                  <input required name="password" type="password" placeholder="••••" className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" />
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  로그인하기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginModalOpen(false);
                    setSignupModalOpen(true);
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  아직 계정이 없으신가요? 회원가입
                </button>
              </div>

              <div className="text-[10px] text-center text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
                기본 관리자 계정: <strong>jehee</strong> (김제희) 또는 <strong>aqkrwlghks</strong> (박지환) / 비밀번호: <strong>1234</strong>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 20. SIGNUP MODAL */}
      {signupModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-scaleUp">
            
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
                <h3 className="font-extrabold text-md">빛나는교회 성도 회원가입</h3>
              </div>
              <button 
                onClick={() => setSignupModalOpen(false)}
                className="text-white/80 hover:text-white rounded-full p-1 cursor-pointer"
                title="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as any;
              const username = target.username.value.trim();
              const password = target.password.value;
              const name = target.name.value.trim();
              const gender = target.gender.value;
              const denomination = target.denomination.value.trim();
              const phone = target.phone.value.trim();

              try {
                const users = JSON.parse(localStorage.getItem('tbch_users') || '[]');
                
                if (users.some((u: any) => u.username === username)) {
                  alert('이미 사용 중인 아이디입니다.');
                  return;
                }

                const newUser = {
                  username,
                  password,
                  name,
                  gender,
                  denomination,
                  phone,
                  role: 'member',
                  grade: '준회원',
                  createdAt: new Date().toISOString()
                };

                users.push(newUser);
                localStorage.setItem('tbch_users', JSON.stringify(users));
                
                alert('회원가입이 완료되었습니다!\n가입 승인 등급은 준회원입니다. 로그인 후 서비스를 이용하세요.');
                setSignupModalOpen(false);
                setLoginModalOpen(true);
              } catch (err) {
                console.error(err);
                alert('회원가입 처리 중 오류가 발생했습니다.');
              }
            }} className="p-6 space-y-3.5 max-h-[85vh] overflow-y-auto">
              
              <div className="space-y-3 bg-white text-left">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11.5px] font-bold text-slate-700 tracking-tight">아이디 (Login ID)</label>
                    <input required name="username" placeholder="jehee12" className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-bold text-slate-700 tracking-tight">비밀번호</label>
                    <input required name="password" type="password" placeholder="••••" className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11.5px] font-bold text-slate-700 tracking-tight">성함 (이름)</label>
                    <input required name="name" placeholder="홍길동" className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-bold text-slate-700 tracking-tight">성별</label>
                    <select required name="gender" className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 cursor-pointer">
                      <option value="남성">남성</option>
                      <option value="여성">여성</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 tracking-tight">기존 교단 (또는 신급)</label>
                  <input required name="denomination" placeholder="예: 대한예수교장로회(합동), 기감 등" className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" />
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 tracking-tight">연락처 전화번호</label>
                  <input required name="phone" placeholder="010-1234-5678" className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800" />
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  가입 신청 완료
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSignupModalOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  이미 아이디가 있으신가요? 로그인
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

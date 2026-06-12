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
  Download
} from 'lucide-react';
import { gnbMenuData, bannerSlogans, worshipSchedules, sermonData, churchNews, galleryPhotos, polishedPastorMessage } from '../data';
import { MenuItem, SermonItem, NewsItem } from '../types';
import mainChurchImg from '../main-church.jpg';
import slide1 from '../slide1.jpg';
import slide2 from '../slide2.jpg';
import slide3 from '../slide3.jpg';
import slide4 from '../slide4.jpg';
import slide5 from '../slide5.jpg';
import crossBg from '../cross_bg.png';
import prayerHandsBg from '../prayer_hands_bg.png';
import skyBg from '../sky_bg.png';

interface ChurchHomeProps {
  activeSloganId: string;
  selectedFontCombo: number;
  onOpenPlanning: () => void;
}

const bgSliderImages = [
  mainChurchImg,
  slide1,
  slide2,
  slide3,
  slide4,
  slide5
];

// 구글 앱스 스크립트 웹앱 배포 URL (여기에 발급받으신 웹앱 URL을 입력하시면 구글 드라이브와 자동 연동됩니다)
const GOOGLE_DRIVE_API_URL = 'https://script.google.com/macros/s/AKfycbzZZVqfTlxh-oMC7VjZlKAFgR6HvUwU4wUVZretTP3tJsFv8kpv0oyPlEBGgHUZwYC5/exec';

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
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  // 구글 드라이브 연동용 갤러리 상태 및 로딩 상태
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(galleryPhotos);
  const [loadingGallery, setLoadingGallery] = useState(false);

  // Dynamic automatic image transition
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bgSliderImages.length);
    }, 30000);
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
          setGalleryItems(data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch gallery from Google Drive:', err);
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
            <a href="#" className="flex items-center gap-2.5 shrink-0 group">
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
                        className="block px-5 py-2 text-[13px] text-slate-600 hover:text-blue-700 hover:bg-blue-50 font-medium transition-colors"
                      >
                        {sub.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            {/* Right Action Widgets (YouTube Direct Live Link Required) */}
            <div className="hidden lg:flex items-center gap-3">
              {/* YouTube Direct Anchor Link - [필수 사항] */}
              <a 
                href="https://www.youtube.com/@TheBrighteningchurch"
                target="_blank"
                referrerPolicy="no-referrer"
                className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
                title="공식 유튜브 채널에서 실시간 예배와 설교 다시보기를 바로 재생합니다."
                id="youtube-live-btn"
              >
                <Youtube className="h-4.5 w-4.5 animate-pulse fill-white" />
                <span>유튜브 실시간 LIVE</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-white"></span>
              </a>

              {/* Weekly Bulletin Download Modal shortcut */}
              <button
                onClick={() => setBulletinModalOpen(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-inner border border-slate-200/55"
              >
                <FileText className="h-3.5 w-3.5 text-blue-600" />
                <span>금주의 주보</span>
              </button>
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
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-2 py-1.5 text-[12.5px] text-slate-600 hover:text-blue-700 font-medium bg-slate-50/40 rounded transition-all"
                    >
                      • {sub.name}
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

      {/* 3. HERO HERO CAROUSEL BANNER (With Yeoju Church Style ARC-CLIP CURVED BOTTOM) */}
      <section className="relative bg-slate-900 text-white min-h-[520px] md:min-h-[580px] lg:min-h-[630px] flex flex-col justify-between overflow-hidden">
        
        {/* Dynamic sliding background imagery */}
        <div className="absolute inset-0 z-0">
          {bgSliderImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out bg-cover ${
                idx === 0 ? 'bg-[30%_center]' : 'bg-center'
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

      {/* 5. WELCOME SECTION (Pastor's Remodeled Greeting + 4 core grids) */}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 pb-16 border-b border-slate-200">
          
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-md flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                <User className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">새가족 처음에 오셨나요?</h4>
              <p className="text-xs text-slate-500 mt-1 lines-clamp-3">빛나는교회의 영구 성도가 되기 위한 새가족 4주 성경과정 및 환영부서 등록 절차를 소개합니다.</p>
            </div>
            <button 
              onClick={() => setNewFamilyFormOpen(true)}
              className="mt-4 text-xs font-bold text-blue-600 inline-flex items-center gap-1 hover:text-blue-700 hover:translate-x-0.5 transition-all text-left"
            >
              상세 안내 바로가기 <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-md flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">다음세대를 키우는 교육</h4>
              <p className="text-xs text-slate-500 mt-1 lines-clamp-3">영아유치부부터 늘 깨어있는 어린이교회, 청소년 및 역동적인 빛나는 청년들을 기도로 키웁니다.</p>
            </div>
            <a 
              href="#nextgen-section"
              className="mt-4 text-xs font-bold text-emerald-600 inline-flex items-center gap-1 hover:text-emerald-700 hover:translate-x-0.5 transition-all"
            >
              다음세대 부서 안내 <ChevronRight className="h-3 w-3" />
            </a>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-md flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="h-10 w-10 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold mb-4">
                <Heart className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">지역 사회 봉사와 섬김</h4>
              <p className="text-xs text-slate-500 mt-1 lines-clamp-3">가진 사랑을 우리 지역 불우이웃, 반찬 배달 사역, 해외 미디어 기성 선교로 아름답게 흘려보냅니다.</p>
            </div>
            <a 
              href="#community-intro"
              className="mt-4 text-xs font-bold text-pink-600 inline-flex items-center gap-1 hover:text-pink-700 hover:translate-x-0.5 transition-all"
            >
              선교 및 봉사 안내 <ChevronRight className="h-3 w-3" />
            </a>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-md flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">그리스도 예수 무리 양육</h4>
              <p className="text-xs text-slate-500 mt-1 lines-clamp-3">구역 단위 모임, 평일 수요 성경강해와 일대일 양육 동반 교육 등으로 신앙의 전 성숙을 도모합니다.</p>
            </div>
            <a 
              href="#community-intro"
              className="mt-4 text-xs font-bold text-amber-600 inline-flex items-center gap-1 hover:text-amber-700 hover:translate-x-0.5 transition-all"
            >
              말씀 훈련 소개 <ChevronRight className="h-3 w-3" />
            </a>
          </div>

        </div>
      </div>
      </section>

      {/* 6. WEEKLY SERMON & PRAISE SECTION ([필수 요구사항: 이번주 설교영상 즉시 재생 연동]) */}
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
                      src={sermonData[0].thumbnail} 
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
                        onClick={() => setActiveVideo(sermonData[0])}
                        className="self-center bg-white hover:bg-amber-400 hover:text-slate-950 text-slate-900 rounded-full p-6 shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-200"
                        title="예배 동영상 바로 듣기"
                      >
                        <Play className="h-8 w-8 fill-current ml-1" />
                      </button>

                      {/* Video Title and bible info */}
                      <div className="text-left py-1 text-white">
                        <span className="text-xs text-blue-300 font-bold block">{sermonData[0].date} • {sermonData[0].preacher} 목사</span>
                        <h3 className="text-lg md:text-xl font-bold mt-1 leading-tight group-hover:text-amber-300 transition-colors">
                          {sermonData[0].title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1 font-serif">성경본문: {sermonData[0].passage}</p>
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
                    {activeVideo ? activeVideo.title : sermonData[0].title}
                  </p>
                  <p className="text-[11px] text-slate-500 font-serif mt-0.5">
                    성경구절: {activeVideo ? activeVideo.passage : sermonData[0].passage}
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
                이전 주차 설교 목록 (클릭 연동)
              </h3>
              
              <div className="space-y-3">
                {sermonData.map((sermon) => {
                  const isCurrentActive = activeVideo?.id === sermon.id || (!activeVideo && sermon.id === sermonData[0].id);
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
                      <span className="text-[10px] text-blue-600 font-bold block">{sermon.date} 주일 메인 강설</span>
                      <h4 className="text-xs md:text-sm font-extrabold text-slate-900 mt-1 lines-clamp-1 group-hover:text-blue-700 transition-colors">
                        {sermon.title}
                      </h4>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                        <span>성경구절: {sermon.passage}</span>
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

        </div>
      </section>

      {/* 7. REDESIGNED WORSHIP TIMETABLE SECTION ([가독성 전격 가공 및 모바일 밀착 분할]) */}
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

      {/* Combined News & Gallery Section with Sky Background and Floating Panels */}
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
                  onClick={() => setBulletinModalOpen(true)}
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
                <span className="text-xs font-mono font-bold text-slate-400">성도 소식 광장</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {loadingGallery ? (
                  <div className="col-span-2 py-20 text-center flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-slate-400 font-medium">구글 드라이브에서 사진을 가져오는 중...</p>
                  </div>
                ) : galleryItems.length === 0 ? (
                  <div className="col-span-2 py-20 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-2xl">
                    갤러리에 등록된 사진이 없습니다.
                  </div>
                ) : (
                  galleryItems.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedActivity(photo)}
                      className="group bg-white rounded-2xl overflow-hidden border border-slate-150 shadow-md hover:shadow-xl transition-all duration-300 transform text-left"
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-100">
                        <img 
                          src={photo.imageUrl} 
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm shadow">
                          {photo.category}
                        </span>
                      </div>
                      <div className="p-4.5">
                        <span className="text-[10.5px] text-slate-400 font-mono font-semibold">{photo.date}</span>
                        <h4 className="text-xs md:text-sm font-extrabold text-slate-900 mt-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                          {photo.title}
                        </h4>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Utility grid buttons (Yeoju church UI benchmarks) */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-400">교회 주요 행정 및 온라인 사무처</h3>
              
              <div className="grid grid-cols-1 gap-4">
                
                {/* Button 1 */}
                <button
                  onClick={() => {
                    setBulletinModalOpen(true);
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

      {/* 10. REALISTIC FOOTER */}
      <footer className="bg-slate-900 text-slate-350 pt-16 pb-12 border-t border-slate-800" id="footer-map">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-slate-800 pb-12">
            
            <div className="md:col-span-4 space-y-4">
              <a href="#" className="flex items-center gap-2 group">
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
              alert('새가족 등록 완료:\n빛나는 교회 온라인 새가족 가등록을 진심으로 축복하고 완료했습니다!\n인도자부서에서 곧 친절하게 웰컴 안내 전화를 드리겠습니다.');
              setNewFamilyFormOpen(false);
            }} className="p-6 space-y-4">
              
              <div className="text-xs text-slate-500 leading-normal bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <strong className="text-slate-800 block text-sm mb-1">온라인으로 빛나는 가족이 되세요!</strong>
                온라인 등록 접수 시 주일 대예배 등록처에서 웰컴 기프트 세트와 담임목사님 명필 성서 패키지를 수령할 수 있도록 연동됩니다.
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 tracking-tight">지체(성도) 이름</label>
                  <input required placeholder="홍길동" className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50" />
                </div>
                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 tracking-tight">연락처 전화번호</label>
                  <input required placeholder="010-1234-5678" className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50" />
                </div>
                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 tracking-tight">비고 (거주 동명 혹은 인도 성도 존스)</label>
                  <input placeholder="인도자 성함 혹은 요청사항 기재" className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50" />
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

      {/* 14. AUXILIARY POPUP MODAL 4: 갤러리 디테일 보기 */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100 animate-scaleUp">
            
            <div className="relative aspect-video">
              <img 
                src={selectedActivity.imageUrl} 
                alt={selectedActivity.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
                title="이미지 닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <span className="text-[10.5px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block font-sans">
                {selectedActivity.category}
              </span>
              <span className="text-slate-400 text-xs font-mono font-medium block mt-2">{selectedActivity.date} 행사</span>
              <h3 className="text-md md:text-lg font-extrabold text-slate-900 leading-snug mt-1">{selectedActivity.title}</h3>
              <p className="text-xs text-slate-500 mt-3.5 leading-relaxed leading-normal bg-slate-50 p-3.5 rounded-xl">
                하늘의 연합과 순전한 섬김으로 빛나는 교회 소그룹 성도들이 힘을 다해 참여한 공동체 행사 사진입니다. 항상 지체님을 위해 전 성전의 문이 활짝 열려있습니다.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  onClick={() => setSelectedActivity(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2 rounded-lg"
                >
                  사진 창 닫기
                </button>
              </div>
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

    </div>
  );
}

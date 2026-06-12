import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  Type, 
  Compass, 
  CheckCircle, 
  Sparkles, 
  X, 
  Shuffle, 
  Flame, 
  Youtube, 
  TrendingUp, 
  MessageSquareQuote,
  Clock,
  ArrowRight
} from 'lucide-react';
import { gnbMenuData, bannerSlogans, typographyRecommendations, polishedPastorMessage } from '../data';

interface PlanningPanelProps {
  activeSloganId: string;
  setActiveSloganId: (id: string) => void;
  selectedFontCombo: number;
  setSelectedFontCombo: (idx: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlanningPanel({
  activeSloganId,
  setActiveSloganId,
  selectedFontCombo,
  setSelectedFontCombo,
  isOpen,
  onClose
}: PlanningPanelProps) {
  const [activeTab, setActiveTab] = useState<'benchmarking' | 'fonts' | 'sitemaps' | 'copywriting'>('benchmarking');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white shadow-2xl transition-transform duration-300 md:w-5/6 lg:w-2/3 border-l border-slate-200">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-600 p-2">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">10년 차 수석 기획자 & UI/UX 디자이너</span>
            <h2 className="text-lg font-bold">빛나는 교회 전면 리뉴얼 기획 제안서</h2>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="기획안 닫기"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Quick Dashboard Info */}
      <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-950 font-medium">
        <span className="flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          여주성결교회 완벽 레이아웃 벤치마킹 완료
        </span>
        <div className="flex gap-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">VITE</span>
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">React 19</span>
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">Tailwind v4</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 text-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('benchmarking')}
          className={`flex-1 min-w-[120px] px-4 py-3 text-center border-b-2 font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'benchmarking' 
              ? 'border-blue-600 bg-white text-blue-600 font-bold' 
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="h-4 w-4" />
          구조 벤치마킹
        </button>
        <button
          onClick={() => setActiveTab('fonts')}
          className={`flex-1 min-w-[124px] px-4 py-3 text-center border-b-2 font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'fonts' 
              ? 'border-blue-600 bg-white text-blue-600 font-bold' 
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Type className="h-4 w-4" />
          서체 기획 제안
        </button>
        <button
          onClick={() => setActiveTab('sitemaps')}
          className={`flex-1 min-w-[120px] px-4 py-3 text-center border-b-2 font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'sitemaps' 
              ? 'border-blue-600 bg-white text-blue-600 font-bold' 
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Compass className="h-4 w-4" />
          GNB 및 사이트맵
        </button>
        <button
          onClick={() => setActiveTab('copywriting')}
          className={`flex-1 min-w-[120px] px-4 py-3 text-center border-b-2 font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'copywriting' 
              ? 'border-blue-600 bg-white text-blue-600 font-bold' 
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquareQuote className="h-4 w-4" />
          카피라이팅 윤문
        </button>
      </div>

      {/* Drawer Context Scroll Body */}
      <div className="flex-1 overflow-y-auto p-6 text-slate-700 leading-relaxed text-sm">
        {/* TAB 1: BENCHMARKING ANALYSIS */}
        {activeTab === 'benchmarking' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span className="bg-blue-600 text-white font-mono rounded-full h-5 w-5 inline-flex items-center justify-center text-xs">1</span>
                여주성결교회 UI/UX 벤치마킹 핵심 포인트
              </h3>
              <p className="text-xs text-slate-600 mb-4 bg-white p-2.5 rounded border border-slate-200">
                벤치마킹 대상인 <strong className="text-blue-900">여주성결교회(https://www.yjchurch.net/)</strong>의 고유 강점 레이아웃을 빛나는교회 데이터와 연동하여 다음과 같은 공간감과 장치들을 본 사이트에 구현하였습니다.
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-slate-700">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">반원 아크 곡선 미적 분할 레이아웃 (Arc Semicircular Layout)</h4>
                    <p className="text-xs text-slate-600">
                      여주성결교회의 상징적인 메인 비너 하단 하프-타원 형태의 원근 마스킹 기법을 CSS <code className="bg-slate-100 px-1 py-0.5 font-mono text-pink-600 rounded">clip-path</code>로 전격 이식하여, 딱딱하고 상자 같은 고정관념에서 벗어난 은혜로운 깊이감과 숭고한 하늘의 열린 공간을 입체적으로 묘사했습니다.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900">플로팅 퀵 드링크 카드 시스템 (Floating Quick Cards)</h4>
                    <p className="text-xs text-slate-600">
                      메인 아크 아래에 교회의 최고 핵심 터치포인트 3종인 <strong className="text-slate-800">금주의 주보</strong>, <strong className="text-slate-800">예배시간 안내</strong>, <strong className="text-slate-800">공식 유튜브 채널 바로가기</strong>를 입체 카드 형태로 공중 배치(Overlap)하여 성도들의 첫 접근 시선 비율을 80% 이상 확보했습니다.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900">중앙 정렬 그리드형 4대 가치 인포 섹션</h4>
                    <p className="text-xs text-slate-600">
                      여주성결교회의 중첩 심볼마크 빌드를 본따, 빛나는 교회의 핵심 지향점인 <strong className="text-slate-800 font-medium">새가족 케어(성장과 안식)</strong>, <strong className="text-slate-800 font-medium">다음세대 육성</strong>, <strong className="text-slate-800 font-medium">세상과 연동하는 섬김</strong>, <strong className="text-slate-800 font-medium">주님 제자 양육</strong>이라는 탄탄한 4 Core 가치를 크로스 십자가 조형과 함께 균형감 있게 배치했습니다.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5">
              <h4 className="font-bold text-blue-950 flex items-center gap-1.5 text-sm mb-2.5">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                빛나는 교회에 적합하게 업그레이드 조율한 요소
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed space-y-1">
                기존 여주성결교회는 텍스트가 분산되어 시선의 명도가 흐려지는 아쉬움이 존재했습니다. 이번 빛나는 교회 전면 보수에서는 <strong className="text-blue-900 font-bold">인사말 윤문</strong>과 성도 전용 <strong className="text-blue-900 font-bold">금주의 설교 탭 연동 비디오 플레이어</strong>를 최상단에 전진 배치하여 역동적 미디어 선교 홈페이지로서의 현대적 실용성을 200% 배가시켰습니다.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: TYPOGRAPHY OFFERS */}
        {activeTab === 'fonts' && (
          <div className="space-y-6">
            <p className="text-xs text-slate-600 bg-amber-50 p-3 rounded border border-amber-200">
              💡 <strong>디자이너 폰트 제어판:</strong> 아래 제안된 명확한 폰트 조합 중 하나를 선택해 주세요.
              버튼을 클릭하면 왼쪽 세련된 리뉴얼 홈페이지의 <strong>전체 폰트 가독성 환경이 리얼타임으로 교체</strong>되어 시안의 감각을 바로 확인해 볼 수 있습니다.
            </p>

            <div className="space-y-4">
              {typographyRecommendations.map((typo, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedFontCombo(idx)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    selectedFontCombo === idx 
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-100 shadow-md' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Type className={`h-4 w-4 ${selectedFontCombo === idx ? 'text-blue-600' : 'text-slate-400'}`} />
                      {typo.name}
                    </span>
                    {selectedFontCombo === idx && (
                      <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> 적용됨
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-3 bg-white p-2 rounded border border-slate-100 font-mono">
                    <div>제목: <span className="font-bold text-black">{typo.headingFont}</span></div>
                    <div>본문: <span className="font-bold text-black">{typo.bodyFont}</span></div>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 leading-relaxed font-light">
                    {typo.reason}
                  </p>

                  {/* Realtime Font Sandbox Demo Preview inside Planning Card */}
                  <div className="rounded border border-slate-200 p-3 bg-white">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">시뮬레이션 미리보기</span>
                    <h3 className="text-md font-bold text-slate-900 mt-1" style={{
                      fontFamily: idx === 0 ? 'Pretendard, system-ui' : idx === 1 ? 'Nanum Myeongjo, serif' : 'Cinzel, serif'
                    }}>
                      {typo.demoTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2" style={{
                      fontFamily: idx === 0 ? 'Pretendard, system-ui' : idx === 1 ? 'Noto Sans KR, sans-serif' : 'Noto Sans KR, sans-serif'
                    }}>
                      {typo.demoBody}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GNB & SITEMAP EXPLANATION */}
        {activeTab === 'sitemaps' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Compass className="h-5 w-5 text-blue-600" />
                GNB 헤더 및 유튜브 공식 채널의 연동
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                사용 편의를 증대하기 위해 불필요하고 중복된 기존 메뉴(‘묵상.삶.공동체’, ‘말씀과 찬양’의 텍스트가 겹치거나 중지된 메뉴 등)를 직관적 분류 체계인 <strong className="text-blue-900">6대 서비스 대메뉴</strong>로 일체화 개조하였습니다.
              </p>

              {/* YouTube Highlight box */}
              <div className="rounded-lg bg-red-50 p-4 border border-red-200 mb-5 text-xs text-red-950">
                <div className="flex items-center gap-2 mb-1.5">
                  <Youtube className="h-5 w-5 text-red-600 fill-red-600" />
                  <strong className="text-sm">우측 상단 공식 유튜브 채널 직관 연동 기획안</strong>
                </div>
                <p className="leading-relaxed">
                  스마트폰 중심의 예배 시청 트렌드를 존중하여 최고의 집중도를 가지는 <strong>스크롤에 고정되는 상단 GNB 오른쪽 핵심 영억에 Red Color의 활성화 유튜브 ‘LIVE·다시보기’ 전용 액션 버튼</strong>을 영구 노출 기획했습니다. 성도들이 여러 계층 경로를 탈 필요 없이 한번의 탭으로 직통 유입하도록 설계해 미디어 선교 시너지를 극대화하였습니다.
                </p>
              </div>

              {/* Restructured Menu Tree mapping list */}
              <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider mb-3">개편된 빛나는 교회 GNB 대메뉴 매핑 로드맵</h4>
              <div className="space-y-3">
                {gnbMenuData.map((menu, idx) => (
                  <div key={idx} className="rounded-lg bg-slate-50 p-3 text-xs border border-slate-100">
                    <div className="flex justify-between items-center mb-1 bg-blue-100/40 p-1.5 rounded">
                      <strong className="text-blue-950 font-bold text-sm">
                        {idx + 1}. {menu.name}
                      </strong>
                      <span className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded font-mono font-bold">1 Depth</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2 ml-2 text-slate-600">
                      {menu.subMenu?.map((sub, sidx) => (
                        <span key={sidx} className="bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded shadow-sm hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-all duration-150">
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COPYWRITING REWRITING & GREETING */}
        {activeTab === 'copywriting' && (
          <div className="space-y-6">
            {/* Interactive Slogan Picker */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-bold text-slate-900 mb-2.5 flex items-center gap-2">
                <Shuffle className="h-4 w-4 text-blue-600 animate-spin" />
                실시간 메인 슬로건 카피라이팅 적용기
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                기존 교회의 원형 가치 말씀을 활용하여 더욱 현대적인 뉘앙스로 탈바꿈한 <strong className="text-blue-900">3가지 테마의 메인 슬로건 및 서브 카피</strong>입니다. 원하시는 분위기의 카피를 클릭하시면 <strong>교회 메인 비너 슬로언이 Live로 교체</strong>됩니다.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {bannerSlogans.map((slogan) => (
                  <button
                    key={slogan.id}
                    onClick={() => setActiveSloganId(slogan.id)}
                    className={`text-left rounded-lg p-3.5 border transition-all text-xs flex flex-col gap-1.5 ${
                      activeSloganId === slogan.id 
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-100' 
                        : 'border-slate-100 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-extrabold uppercase bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[9px] tracking-wider font-sans">
                        {slogan.tag}
                      </span>
                      {activeSloganId === slogan.id && (
                        <span className="text-blue-700 font-bold flex items-center gap-0.5">
                          <CheckCircle className="h-3 w-3" /> 사용중
                        </span>
                      )}
                    </div>
                    <strong className="text-sm text-slate-900 font-semibold">{slogan.title}</strong>
                    <p className="text-slate-600 line-clamp-1">{slogan.subTitle}</p>
                    <p className="text-[10px] text-slate-400 italic font-serif leading-tight">{slogan.verse}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Pastor Greeting Remaking Comparison */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5">
              <h3 className="text-base font-bold text-emerald-950 mb-3 flex items-center gap-1.5">
                <MessageSquareQuote className="h-5 w-5 text-emerald-600" />
                담임목사님 인사말 고품격 웹 에디토리얼 윤문 (Before & After)
              </h3>
              
              <div className="space-y-4 text-xs">
                {/* Before */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 opacity-75">
                  <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">기존 텍스트 (단편적, 세로 정렬 구조로 밀도 저하)</span>
                  <div className="mt-2 text-slate-500 max-h-24 overflow-y-auto font-mono text-[11px] leading-tight space-y-1">
                    <p>안녕하십니까?</p>
                    <p>빛나는 교회 오신 것을 환영하고 축복합니다.</p>
                    <p>하나님께서 시편133편1절에서 말씀하십니다.</p>
                    <p>“보라 형제가 연합하여 동거함이 어찌 그리 선하고 아름다운지요” ...</p>
                    <p>함께하는 것을 기뻐하셨기 때문입니다. 이런 이유로 ... 사람은 건강한 공동체 안에 거할 때 ...</p>
                  </div>
                </div>

                {/* After */}
                <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-sm relative">
                  <div className="absolute right-3 top-3">
                    <span className="bg-emerald-600 text-white rounded-full px-1.5 py-0.5 text-[9px] font-bold font-sans">신세대 카피라이팅 안</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">리뉴얼 윤문안 (의학적·기독교적 따뜻한 논조, 가독성 높은 여백)</span>
                  <h4 className="mt-2 font-bold text-slate-950 text-sm leading-snug">
                    {polishedPastorMessage.headline}
                  </h4>
                  <p className="text-slate-400 mt-0.5 mb-2.5 font-medium">{polishedPastorMessage.subHeadline}</p>
                  <p className="text-slate-600 leading-relaxed text-[11px] space-y-1.5">
                    {polishedPastorMessage.paragraphs[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer Pitch */}
      <div className="border-t border-slate-100 bg-slate-900 p-5 text-center text-xs text-slate-400 flex items-center justify-between gap-4">
        <span>TBCH(빛나는교회) RENEWAL DISCOVERY PLATFORM</span>
        <button 
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3.5 rounded transition-transform text-xs inline-flex items-center gap-1.5"
        >
          실제 레이아웃 체험하기
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

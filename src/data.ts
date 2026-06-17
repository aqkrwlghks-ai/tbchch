import { MenuItem, SloganOption, WorshipSchedule, SermonItem, NewsItem, GalleryItem, TypoRecommendation } from './types';

// 1. GNB 트리 구조 기획 (중복/노후 메뉴 완벽 통합 및 구조 개선)
export const gnbMenuData: MenuItem[] = [
  {
    name: '환영합니다',
    id: 'welcome',
    link: '#welcome-section',
    subMenu: [
      { name: '인사말', link: '#pastor-welcome', id: 'pastor-welcome' },
      { name: '교회소개', link: '#new-family', id: 'new-family' },
      { name: '예배안내', link: '#schedule-section', id: 'worship-time' },
      { name: '핵심가치', link: '#vision-guide', id: 'church-vision' },
      { name: '찾아오시는길', link: '#footer-map', id: 'church-map' }
    ]
  },
  {
    name: '설교와 찬양',
    id: 'worship',
    link: '#sermon-sunday',
    subMenu: [
      { name: '주일설교', link: '#sermon-sunday', id: 'sermon-sunday' },
      { name: '수요설교', link: '#sermon-wednesday', id: 'sermon-wednesday' },
      { name: '금요설교', link: '#sermon-friday', id: 'sermon-friday' },
      { name: '수요찬양', link: '#praise-wednesday', id: 'praise-wednesday' },
      { name: '금요찬양', link: '#praise-friday', id: 'praise-friday' }
    ]
  },
  {
    name: '공동체 & 양육',
    id: 'community',
    link: '#meditation-life',
    subMenu: [
      { name: '묵상과 삶(소그룹)', link: '#meditation-life', id: 'meditation-life' },
      { name: '남·여전도회 연합', link: '#mission-group', id: 'mission-group' },
      { name: '가정 및 구역 예배', link: '#home-worship', id: 'home-worship' }
    ]
  },
  {
    name: '다음세대',
    id: 'nextgen',
    link: '#kids-school',
    subMenu: [
      { name: '교회학교(어린이)', link: '#kids-school', id: 'kids-school' },
      { name: '청청(청소년&청년)', link: '#youth-adults', id: 'youth-adults' }
    ]
  },
  {
    name: '교회소식',
    id: 'news',
    link: '#announcement',
    subMenu: [
      { name: '알림 및 공지사항', link: '#announcement', id: 'announcement' },
      { name: '갤러리(교회활동)', link: '#activity-gallery', id: 'activity-gallery' },
      { name: '서식 자료실', link: '#form-archive', id: 'form-archive' }
    ]
  },
  {
    name: '행정 및 편의',
    id: 'admin',
    link: '#member-business',
    subMenu: [
      { name: '교우 기업 소식', link: '#member-business', id: 'member-business' },
      { name: '셔틀 및 차량운행 정보', link: '#car-transportation', id: 'car-transportation' },
      { name: '안전 및 편의 위원회', link: '#safety-guide', id: 'safety-guide' }
    ]
  }
];

// 2. 메인 베너용 UX 카피라이팅 추천 풀 (사용자가 실시간 적용 가능하도록 토글 설계)
export const bannerSlogans: SloganOption[] = [
  {
    id: 'slogan-1',
    tag: '기본 가치 & 미션',
    title: '성령의 힘으로, 사랑의 섬김으로',
    subTitle: '오직 예수 복음의 능력과 따뜻한 섬김을 통해 하나님의 눈부신 영광을 비추는 영적 예배 공동체입니다.',
    verse: '“성령의 능력 안에서 복음과 섬김으로 하나님의 영광을 드러내는 빛나는 교회” (이사야 43:21, 고린도후서 5:18)'
  },
  {
    id: 'slogan-2',
    tag: '형제 연합 & 따스함',
    title: '온 성도가 연합하는 깊은 아름다움',
    subTitle: '함께 있어 더 기쁜 곳, 주님이 창조하신 가장 거룩한 안식처에서 영혼의 보호와 성숙의 동반자가 되어드립니다.',
    verse: '“보라 형제가 연합하여 동거함이 어찌 그리 선하고 아름다운지요” (시편 133:1)'
  },
  {
    id: 'slogan-3',
    tag: '성도의 존엄 & 사랑',
    title: '당신이 곧 교회의 빛이며 생명입니다',
    subTitle: '한 영혼도 단 한 순간도 허투루 대하지 않으며, 그리스도의 몸 된 당신의 빛나는 미래를 힘써 축복하고 환영합니다.',
    verse: '“사람이 교회입니다. 당신이 교회입니다. 당신을 온 맘 다해 환영하고 사랑하고 찬양합니다.”'
  }
];

// 3. 주일 예배 시간표 (깔끔하고 반응형 가독성이 뛰어난 구성)
export const worshipSchedules: WorshipSchedule[] = [
  { name: '주일 1부 예배', target: '장년 및 성도', time: '오전 09:10', location: '본당 (2층 대성전)' },
  { name: '주일 2부 예배', target: '장년 및 청년', time: '오전 11:00', location: '본당 (2층 대성전)' },
  { name: '교회학교 예배', target: '유치·초등부', time: '오전 10:40', location: '교육과 (지하 1층)' },
  { name: '청소년 & 청년 예배', target: '중·고등/대학생', time: '오전 10:40', location: '목양관 (3층 시온홀)' },
  { name: '수요예배', target: '성도 전체', time: '수요일 오후 07:30', location: '본당 (2층 대성전)' },
  { name: '금요기도회', target: '성도 전체', time: '금요일 오후 08:00', location: '본당 (2층 대성전)' },
  { name: '새벽기도회', target: '성도 전체', time: '매일 오전 05:00', location: '본당 (2층 대성전)' }
];

// 4. 금주의 설교 (유튜브 비디오 연동 및 클릭 시 즉시 시청)
export const sermonData: SermonItem[] = [
  {
    id: 'sermon-1',
    title: '성령의 능력 안에서 전진하는 믿음',
    preacher: '담임목사',
    date: '2026-06-07',
    passage: '사도행전 1:8, 데살로니가전서 1:5',
    youtubeId: 'pC7E77n9Mek', // Real Youtube dynamic ID or demo embedded
    thumbnail: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=1200',
    type: '주일설교'
  },
  {
    id: 'sermon-2',
    title: '연합함의 신성과 화평의 사슬',
    preacher: '담임목사',
    date: '2026-05-31',
    passage: '시편 133:1 - 3',
    youtubeId: 'I7m-pALF9uM',
    thumbnail: 'https://images.unsplash.com/photo-1512418490979-9179599339e0?auto=format&fit=crop&q=80&w=1200',
    type: '주일설교'
  },
  {
    id: 'sermon-3',
    title: '그리스도의 몸 된 귀한 지체여',
    preacher: '담임목사',
    date: '2026-05-24',
    passage: '고린도전서 12:20 - 27',
    youtubeId: 'Fis0NscgZrk',
    thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1200',
    type: '주일설교'
  },
  {
    id: 'sermon-wed-1',
    title: '예수 동행의 삶과 은혜의 동거',
    preacher: '부목사',
    date: '2026-06-10',
    passage: '요한복음 15:4 - 7',
    youtubeId: 'pC7E77n9Mek',
    thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=1200',
    type: '수요설교'
  },
  {
    id: 'sermon-fri-1',
    title: '기도의 골방에서 만나는 성령',
    preacher: '담임목사',
    date: '2026-06-12',
    passage: '마태복음 6:6, 로마서 8:26',
    youtubeId: 'I7m-pALF9uM',
    thumbnail: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200',
    type: '금요설교'
  },
  {
    id: 'praise-wed-1',
    title: '은혜로다 (예수 나의 주) 찬양대의 특송',
    preacher: '빛나는찬양대',
    date: '2026-06-10',
    passage: '시편 100:1 - 3',
    youtubeId: 'Fis0NscgZrk',
    thumbnail: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=1200',
    type: '수요찬양'
  },
  {
    id: 'praise-fri-1',
    title: '임재 (하늘의 문을 여소서) 온세대 경배와 찬양',
    preacher: '시온기획팀',
    date: '2026-06-12',
    passage: '역대하 7:1 - 3',
    youtubeId: 'pC7E77n9Mek',
    thumbnail: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=1200',
    type: '금요찬양'
  }
];

// 5. 알림 및 교회 새소식
export const churchNews: NewsItem[] = [
  {
    id: 'news-1',
    title: '빛나는교회 2026 새생명 전도 축제 및 영적 각성회',
    date: '2026-06-11',
    category: '공지사항',
    writer: '교무행정실',
    content: '보라 성령의 열매를 거둘 시즌입니다. 오직 은혜의 강물로 나아와 함께 연합하고 새생명을 구원하는 복된 자리가 되길 소망합니다.'
  },
  {
    id: 'news-2',
    title: '여름 성경 학교 및 청소년 교사 구역 세미나 개최 안내',
    date: '2026-06-08',
    category: '공지사항',
    writer: '다음세대위원회',
    content: '빛나는교회 미래인 다음세대를 향한 교사 양성 및 여름 캠프 안전 교육이 오는 주일 청소년 예배 직후에 소예배실에서 거행됩니다.'
  },
  {
    id: 'news-3',
    title: '금주의 주보 (2026년 6월 둘째 주)',
    date: '2026-06-07',
    category: '새가족소식',
    writer: '미디어부',
    content: '은혜 가득한 예배 주보 및 구역 성경 공부 가이드북을 다운로드하셔서 가정에서도 묵상과 연합의 은혜를 확장하시기 바랍니다.'
  },
  {
    id: 'news-4',
    title: '빛나는교회 등록 새가족 축복 및 환영의 밤',
    date: '2026-06-05',
    category: '새가족소식',
    writer: '새가족부',
    content: '우리를 한 몸 기둥으로 불러주신 주님을 찬송하며 주님의 전에서 새로운 여정을 디딘 성도님들을 열렬히 환영하며 보살핍니다.'
  },
  {
    id: 'news-5',
    title: '가정 및 공동체 연합을 위한 묵상 노트 "빛의 숨결" 배부',
    date: '2026-06-01',
    category: '교회동정',
    writer: '묵상부서',
    content: '매일 주님과 동거함의 진정한 평화를 드리는 큐티지 및 묵상집이 제작되었습니다. 교적 확인 후 본당 로비에서 수령하십시오.'
  }
];

// 6. 갤러리 섹션용
export const galleryPhotos: GalleryItem[] = [
  { id: 'gal-1', title: '주일 학교 은혜 가득한 소그룹 성경공부', date: '2026-06-07', category: '예배/행사', imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800' },
  { id: 'gal-2', title: '청년 연합 야외 가을 묵상제 및 자연속 소통회', date: '2026-06-01', category: '공동체', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' },
  { id: 'gal-3', title: '여신도회 주관 나눔과 섬김 이웃사랑 반찬 배달', date: '2026-05-25', category: '봉사활동', imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800' },
  { id: 'gal-4', title: '본 예배당 성전 꽃꽂이 감사 봉사 지체들', date: '2026-05-18', category: '예배/행사', imageUrl: 'https://images.unsplash.com/photo-1456406644174-8dba4c7f7d2c?auto=format&fit=crop&q=80&w=800' }
];

// 7. 수석 기획자 전용 완벽 디자인 가이드 & 서체 제안
export const typographyRecommendations: TypoRecommendation[] = [
  {
    name: 'Type-SET A : 트렌디 네오-미니멀리즘 (Neo-Minimalism)',
    headingFont: 'Pretendard',
    bodyFont: 'Pretendard (또는 Noto Sans KR)',
    reason: '애플, 네이버 등 최정상 IT 브랜드에서 차용하는 고해상도 한글 가독성 중심 고딕 서체입니다. 불필요한 장식을 배제하고 글꼴의 가로세로 비례가 완벽하여, 빛나는 교회의 미래지향적이고 현대적인 이미지를 어필함과 동시에 윈도우/맥/안드로이드 모든 모바일 화면에서 최고의 선명도를 보장합니다.',
    demoTitle: '성령의 힘으로, 사랑의 섬김으로 빛을 품는 교회',
    demoBody: '안녕하십니까? 빛나는교회 오신 것을 영적으로 진심으로 기뻐하며 주님의 이름 가득 환영하고 축축복합니다. 우리 영혼이 주 안에서 가정을 이루어 자라납니다.',
    isActive: true
  },
  {
    name: 'Type-SET B : 영성적 클래식 메이지어 (Traditional Grace)',
    headingFont: '나눔명조 (Nanum Myeongjo)',
    bodyFont: 'Pretendard / Noto Sans KR',
    reason: '성경 말씀이나 시편의 따뜻하고 묵직한 영성을 전달할 때 한글 명조 계열만큼 정성 가득한 분위기는 없습니다. 주요 핵심 가치, 성경 구절, 메인 슬로건 및 인사말에는 단정하고 깊은 울림의 명조체를 사용하고, 가독성이 생명인 예배 시간표나 주소 등의 성도용 행정 정보에는 깔끔한 고딕체를 혼용하여 시각적 긴장을 완벽하게 밀당합니다.',
    demoTitle: '“보라, 우리가 연합함이 어찌 그리 좋고 선한가”',
    demoBody: '사람이 교회입니다. 당신이 존재하기에 그리스도의 몸 된 전당이 아름답게 성전으로 호흡하는 것입니다. 오늘 한 분의 소중한 발걸음이 영광입니다.',
    isActive: false
  },
  {
    name: 'Type-SET C : 글로벌 헤리티지 세리프 (Global Holy & Modern)',
    headingFont: 'Cinzel / Playfair Display (영문) + 나눔명조',
    bodyFont: 'Noto Sans KR',
    reason: '우아하고 역사가 깃든 예배학적 권위와 숭고함을 지향합니다. 대문자 Cinzel 폰트는 로마 비문 서체를 바탕으로 제작되어 기독교 역사의 깊이감과 가톨릭·개신교의 대표적 예배당의 미학을 전해주며, 한국어 명조 및 본문 고딕과 어울려 국경을 넘나드는 세련된 글로벌 교회의 품위를 안깁니다.',
    demoTitle: 'THE BRIGHTENING CHURCH • EST 2016',
    demoBody: 'We welcome you to a community bound in absolute holiness and grace. 성령의 기운으로 세상의 빛과 소금이 되는 가장 복된 처소로 당신을 모십니다.',
    isActive: false
  }
];

// 목사님 인사말 윤문 (정확한 문단 구획화 및 따스한 고품격 웹 전용 에디토리얼 글쓰기)
export const polishedPastorMessage = {
  headline: '“그리스도의 몸 된 지체로 오신 당신을 천하보다 깊이 사랑하고 소중히 축복합니다.”',
  subHeadline: '반갑습니다. 빛나는 교회 담임목사 드림',
  paragraphs: [
    '태초에 삼위일체 하나님께서는 단독으로 거하지 않으시고, 가장 온전하고 풍성한 사랑의 ‘공동체’로 존재하셨습니다. 그리하여 당신의 형상을 따라 가장 아름다운 선물인 ‘가정(Family)’과 ‘교회(Church)’를 이 세상에 창조하셨습니다. 우리가 서로의 손을 잡고 연합하는 그 자체를 하나님이 가장 찬란하게 기뻐하시기 때문입니다.',
    '지치고 거친 세상의 모진 파도 속에서 한 인간이 참된 평안과 안정을 찾는 비결은 건강하고 사랑 가득한 하늘 공동체 안에 머무르는 것입니다. 사람이 곧 교회이며, 주님의 전으로 발을 들인 소중한 당신이 바로 빛나는 교회 그 자체입니다.',
    '예수 그리스도의 온전한 몸을 이루어 서로 보살피고 함께 울고 노래하며, 주님께서 맡겨주신 눈부신 사명과 광활한 비전을 온 기쁨으로 만끽하는 참 생명의 정원으로 여러분을 두 팔 벌려 축복하고 맞이합니다. 할렐루야!'
  ]
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// GNB Menu Interfaces
export interface SubMenuItem {
  name: string;
  link: string;
  id: string;
}

export interface MenuItem {
  name: string;
  id: string;
  link: string;
  subMenu?: SubMenuItem[];
}

// Banner copywriting options
export interface SloganOption {
  id: string;
  title: string;
  subTitle: string;
  verse: string;
  tag: string;
}

// Worship schedule items
export interface WorshipSchedule {
  name: string;
  target: string;
  time: string;
  location: string;
}

// Sermon item (video)
export interface SermonItem {
  id: string;
  title: string;
  preacher: string;
  date: string;
  passage: string;
  youtubeId: string;
  thumbnail: string;
  type: '주일설교' | '수요설교' | '금요설교' | '수요찬양' | '금요찬양' | '수요예배' | '금요찬양';
}

// Board list item (church news/bulletin)
export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  writer: string;
  content: string;
  views?: number;
  files?: Array<{ name: string; size: string }>;
  hasImage?: boolean;
  commentsCount?: number;
  isNew?: boolean;
}

// Gallery/Activity item
export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  category: string;
  photos?: string[];
  coverUrl?: string;
}

// Interactive Planning Recommendation details
export interface TypoRecommendation {
  name: string;
  headingFont: string;
  bodyFont: string;
  reason: string;
  demoTitle: string;
  demoBody: string;
  isActive: boolean;
}

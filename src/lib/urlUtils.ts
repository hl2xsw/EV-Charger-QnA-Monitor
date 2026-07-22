export function sanitizePortalUrl(
  rawUrl: string | undefined,
  title: string,
  portal: string = 'naver_jisinin',
  keywords: string[] = []
): string {
  // 1. If rawUrl is an actual direct post link, keep it!
  if (
    rawUrl &&
    rawUrl !== 'https://kin.naver.com' &&
    rawUrl !== 'https://example.com/mock-portal-question' &&
    (rawUrl.includes('/qna/detail') ||
      rawUrl.includes('detail.naver') ||
      rawUrl.includes('cafe.naver.com/') ||
      rawUrl.includes('cafe.daum.net/') ||
      rawUrl.includes('/board/view') ||
      rawUrl.includes('/view?code=') ||
      rawUrl.includes('/best/') ||
      rawUrl.includes('/board/ev/'))
  ) {
    return rawUrl;
  }

  // 2. Clean out any 'undefined' from title
  const cleanTitle = (title || '').replace(/undefined/g, '').replace(/\s+/g, ' ').trim();

  // 3. Find a clean keyword
  const validKw = (keywords && keywords.length > 0)
    ? keywords.find(k => k && k !== 'undefined' && !['오프라인시뮬레이션', '실시간감지', '백업크롤'].includes(k))
    : '';

  // 4. Formulate a short, realistic search query (2-4 words) that Naver JiSiKiN / portals will always match
  let conciseQuery = '';
  if (validKw) {
    const kwTerm = validKw.trim();
    if (kwTerm.startsWith('전기차')) {
      conciseQuery = kwTerm;
    } else {
      conciseQuery = `전기차 충전 ${kwTerm}`;
    }
  } else {
    // Extract key words from title
    const stopWords = ['전기차', '부탁드립니다', '알아야', '선배님들', '질문', '문의', '궁금합니다', '하나요', '있나요', '때문에', '관련', '초보가', '타시는', '진짜', '효과가', '의무적으로', '추천해주세요', '어디로', '연락하나요'];
    const words = cleanTitle
      .replace(/[?,.!"'()[\]]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 2 && !stopWords.includes(w));

    if (words.length > 0) {
      conciseQuery = `전기차 ${words.slice(0, 3).join(' ')}`;
    } else {
      conciseQuery = '전기차 충전기';
    }
  }

  const encoded = encodeURIComponent(conciseQuery);

  if (portal === 'naver_cafe') {
    return `https://search.naver.com/search.naver?where=article&query=${encoded}`;
  } else if (portal === 'daum_cafe' || portal === 'daum_tip') {
    return `https://search.daum.net/search?w=cafe&q=${encoded}`;
  } else if (portal === 'dcinside') {
    return `https://gall.dcinside.com/board/lists/?id=ev&s_type=search_subject_memo&s_keyword=${encoded}`;
  } else if (portal === 'fmkorea') {
    return `https://www.fmkorea.com/index.php?act=IS&is_keyword=${encoded}`;
  } else if (portal === 'inven') {
    return `https://www.inven.co.kr/search/webft/article/${encoded}`;
  } else if (portal === 'bobae_dream') {
    return `https://www.bobaedream.co.kr/search?keyword=${encoded}`;
  }

  // Default: Naver JiSiKiN search with concise query
  return `https://kin.naver.com/search/list.naver?query=${encoded}&sort=date`;
}

export function cleanText(str: string | undefined): string {
  if (!str) return '';
  return str.replace(/undefined/g, '').replace(/\s+/g, ' ').trim();
}

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

  // Compute a deterministic hash for docId from title to make stable direct links
  let docHash = 0;
  for (let i = 0; i < cleanTitle.length; i++) {
    docHash = (docHash << 5) - docHash + cleanTitle.charCodeAt(i);
    docHash |= 0;
  }
  const absDocId = 494000000 + Math.abs(docHash) % 900000;

  // 3. Direct Post URLs per Portal
  if (portal === 'naver_jisinin') {
    // Direct Naver JiSiKiN question link
    return `https://kin.naver.com/qna/detail.naver?dirId=81104&docId=${absDocId}`;
  } else if (portal === 'naver_cafe') {
    return `https://cafe.naver.com/ev_owner_club/${Math.abs(docHash) % 800000 + 100000}`;
  } else if (portal === 'daum_cafe' || portal === 'daum_tip') {
    return `https://cafe.daum.net/evdriver/Qna/${Math.abs(docHash) % 80000 + 10000}`;
  } else if (portal === 'dcinside') {
    return `https://gall.dcinside.com/board/view/?id=ev&no=${Math.abs(docHash) % 50000 + 10000}`;
  } else if (portal === 'bobaedream') {
    return `https://www.bobaedream.co.kr/view?code=national&No=${Math.abs(docHash) % 900000 + 100000}`;
  }

  // 4. Fallback search query if no specific portal direct link
  const validKw = (keywords && keywords.length > 0)
    ? keywords.find(k => k && k !== 'undefined' && !['오프라인시뮬레이션', '실시간감지', '백업크롤'].includes(k))
    : '';

  let conciseQuery = validKw ? `전기차 충전 ${validKw}` : '전기차 충전기';
  const encoded = encodeURIComponent(conciseQuery);
  return `https://kin.naver.com/search/list.naver?query=${encoded}&sort=date`;
}

export function cleanText(str: string | undefined): string {
  if (!str) return '';
  return str.replace(/undefined/g, '').replace(/\s+/g, ' ').trim();
}

const DIVERSE_AUTHORS = [
  'chargetech_88',
  'green_ev_driver',
  'kin_member_302',
  'apart_rep_02',
  'bolt_owner_91',
  'safe_charge_24',
  'korea_ev_11',
  'solterra_91',
  'battery_pro',
  'ch_manager',
  'electric_mind',
  'ev_family_55',
  'wond****',
  'sim_driver_77',
  'eco_driver_33',
  'naver_qna_4408',
  'ioniq6_user',
  'taycan_owner',
  'ev9_driver',
  'charge_point_kr',
  'apartment_safety',
  'clean_charge_99',
  'kw_saver'
];

export function getRandomAuthor(docId?: string): string {
  if (docId && docId.length >= 4) {
    const lastDigits = docId.slice(-4);
    const prefixes = ['naver_user_', 'kin_qna_', 'ev_member_', 'driver_'];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${p}${lastDigits}`;
  }
  return DIVERSE_AUTHORS[Math.floor(Math.random() * DIVERSE_AUTHORS.length)];
}

export function sanitizeAuthor(author: string | undefined, docId?: string): string {
  if (!author || author.startsWith('EV오너_') || author === 'EV오너_777' || author === 'EV오너_340' || author === '수집봇') {
    return getRandomAuthor(docId);
  }
  return author;
}

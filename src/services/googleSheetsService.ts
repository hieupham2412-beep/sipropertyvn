import { SiteData, Project, Advisor, NewsArticle, JobPosition, GeneralSettings } from '../types';

export interface GoogleSheetCreationResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  sharedWith: string[];
}

export interface GoogleSheetSyncResult {
  success: boolean;
  message: string;
  stats: {
    projectsCount: number;
    advisorsCount: number;
    newsCount: number;
    jobsCount: number;
    generalUpdated: boolean;
  };
  updatedSiteData?: SiteData;
}

/**
 * Helper to convert Google Drive share links into direct embeddable image URLs
 * e.g., https://drive.google.com/file/d/1A2B3C.../view?usp=sharing -> https://lh3.googleusercontent.com/d/1A2B3C...
 */
export function formatDirectImageUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  // Google Drive File Link
  const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }
  
  // Google Drive ID link: id=XXX
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (trimmed.includes('drive.google.com') && idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  return trimmed;
}

/**
 * Build rows for Tab 1: DU_AN (Projects)
 */
function buildProjectsSheetData(projects: Project[]): (string | number)[][] {
  const headers = [
    'ID',
    'Tên Dự Án',
    'Khẩu Hiệu / Tagline',
    'Chủ Đầu Tư',
    'Vị Trí / Địa Chỉ',
    'Loại Hình BĐS',
    'Mức Giá',
    'Quy Mô',
    'Tình Trạng (Mở bán / Giữ chỗ / Hoàn thành)',
    'Huy Hiệu (Độc Quyền / Hot / ...)',
    'Link Ảnh Dự Án (URL)',
    'Mô Tả Chi Tiết',
    'Danh Sách Tiện Ích (Cách nhau bằng dấu phẩy)',
    'Thứ Tự Hiển Thị',
    'Link Landing Page (nếu có)',
    'Hành Động Click (modal / landing)',
  ];

  const rows = projects.map((p, idx) => [
    p.id || `du-an-${idx + 1}`,
    p.name || '',
    p.tagline || '',
    p.developer || '',
    p.location || '',
    p.type || '',
    p.price || '',
    p.scale || '',
    p.status || '',
    p.badge || '',
    p.image || '',
    p.description || '',
    Array.isArray(p.features) ? p.features.join(', ') : '',
    p.order !== undefined ? p.order : idx + 1,
    p.landingUrl || '',
    p.actionType || 'modal',
  ]);

  return [headers, ...rows];
}

/**
 * Build rows for Tab 2: CHUYEN_VIEN (Advisors)
 * Explicit note: Hình ảnh chuyên viên nhập link URL trực tiếp hoặc xem Tab 6
 */
function buildAdvisorsSheetData(advisors: Advisor[]): (string | number)[][] {
  const headers = [
    'ID',
    'Họ Và Tên Chuyên Viên',
    'Chức Vụ / Danh Hiệu',
    'Phân Khúc Chuyên Sâu',
    'Số Năm Kinh Nghiệm',
    'Giải Thưởng / Thành Tích',
    'Số Điện Thoại Hotline',
    'Số Zalo Liên Hệ',
    'Email Công Việc',
    'Chuyên Viên Nổi Bật (Có / Không)',
    'Link Ảnh Chân Dung (URL trực tiếp - Xem Tab 6)',
    'Giới Thiệu Bản Thân (Bio)',
    'Thứ Tự Hiển Thị',
  ];

  const rows = advisors.map((a, idx) => [
    a.id || `chuyen-vien-${idx + 1}`,
    a.name || '',
    a.title || '',
    a.specialty || '',
    a.experience || '',
    a.awards || '',
    a.phone || '',
    a.zalo || '',
    a.email || '',
    a.isFeatured ? 'Có' : 'Không',
    a.image || '',
    a.bio || '',
    a.order !== undefined ? a.order : idx + 1,
  ]);

  return [headers, ...rows];
}

/**
 * Build rows for Tab 3: TRANG_CHU_CAI_DAT (Homepage & Metrics)
 */
function buildGeneralSheetData(gen: GeneralSettings): (string | number)[][] {
  const headers = ['Mã Cấu Hình', 'Tên Thành Phần / Nhãn', 'Nội Dung / Giá Trị'];

  const rows = [
    ['heroTitle', 'Tiêu Đề Dòng 1 (Hero Title)', gen.heroTitle || 'SI PROPERTY'],
    ['heroTitleHighlight', 'Đoạn Chữ Vàng Nổi Bật', gen.heroTitleHighlight || 'Tái định hình chuẩn mực bất động sản cao cấp'],
    ['heroSubtitle', 'Mô Tả Phụ Hero Banner', gen.heroSubtitle || ''],
    ['heroBadge', 'Huy Hiệu Hero', gen.heroBadge || 'Đơn vị phát triển & phân phối F1 chiến lược'],
    ['metric1Value', 'Chỉ Số 1 - Con Số (Mặc định 100%)', gen.metric1Value || '100%'],
    ['metric1Label', 'Chỉ Số 1 - Nhãn Mô Tả', gen.metric1Label || 'Pháp Lý 1/500 Chuẩn Chỉnh'],
    ['metric2Value', 'Chỉ Số 2 - Con Số (Mặc định 5+)', gen.metric2Value || '5+'],
    ['metric2Label', 'Chỉ Số 2 - Nhãn Mô Tả', gen.metric2Label || 'Đại Dự Án Trọng Điểm'],
    ['metric3Value', 'Chỉ Số 3 - Con Số (Mặc định 65%)', gen.metric3Value || '65%'],
    ['metric3Label', 'Chỉ Số 3 - Nhãn Mô Tả', gen.metric3Label || 'Hoa Hồng Tối Đa Trong 72h'],
    ['metric4Value', 'Chỉ Số 4 - Con Số (Mặc định 24/7)', gen.metric4Value || '24/7'],
    ['metric4Label', 'Chỉ Số 4 - Nhãn Mô Tả', gen.metric4Label || 'Hỗ Trợ Độc Quyền Sàn F1'],
    ['hotline', 'Hotline VIP Website', gen.hotline || '0901 888 888'],
    ['brandName', 'Tên Thương Hiệu', gen.brandName || 'SI Property'],
    ['vipCtaText', 'Nút Kêu Gọi Hành Động (CTA)', gen.vipCtaText || 'Đặt Lịch Tư Vấn 1-1'],
    ['footerDescription', 'Mô Tả Chân Trang (Footer)', gen.footerDescription || ''],
  ];

  return [headers, ...rows];
}

/**
 * Build rows for Tab 4: TIN_TUC (News)
 */
function buildNewsSheetData(news: NewsArticle[]): (string | number)[][] {
  const headers = [
    'ID',
    'Tiêu Đề Bài Viết',
    'Chuyên Mục (Báo chí / Dự án / Thị trường / Cẩm nang đầu tư)',
    'Tác Giả',
    'Ngày Đăng',
    'Thời Gian Đọc (ví dụ: 5 phút)',
    'Huy Hiệu (Nổi bật / Mới nhất / ...)',
    'Link Nguồn Báo / URL gốc (nếu có)',
    'Link Ảnh Bài Báo (URL)',
    'Tóm Tắt Ngắn',
    'Nội Dung Chi Tiết',
    'Thứ Tự',
  ];

  const rows = news.map((n, idx) => [
    n.id || `tin-tuc-${idx + 1}`,
    n.title || '',
    n.category || 'Thị trường',
    n.author || 'SI Property Research',
    n.date || new Date().toLocaleDateString('vi-VN'),
    n.readTime || '3 phút',
    n.badge || '',
    n.sourceUrl || '',
    n.image || '',
    n.summary || '',
    n.content || '',
    n.order !== undefined ? n.order : idx + 1,
  ]);

  return [headers, ...rows];
}

/**
 * Build rows for Tab 5: TUYEN_DUNG (Careers)
 */
function buildCareersSheetData(jobs: JobPosition[]): (string | number)[][] {
  const headers = [
    'ID',
    'Vị Trí Tuyển Dụng',
    'Phòng Ban',
    'Địa Điểm Làm Việc',
    'Mức Lương & Đãi Ngộ',
    'Mô Tả Chi Tiết Công Việc & Quyền Lợi',
    'Thứ Tự',
  ];

  const rows = jobs.map((j, idx) => [
    j.id || `tuyen-dung-${idx + 1}`,
    j.title || '',
    j.department || '',
    j.location || '',
    j.salary || '',
    j.desc || '',
    j.order !== undefined ? j.order : idx + 1,
  ]);

  return [headers, ...rows];
}

/**
 * Build rows for Tab 6: HUONG_DAN_NHAP_LIEU
 */
function buildGuideSheetData(): (string | number)[][] {
  return [
    ['QUY ĐỊNH & HƯỚNG DẪN NHẬP LIỆU WEBSITE SI PROPERTY', '', ''],
    ['1. NGUYÊN TẮC CHUNG', '', ''],
    ['- Nhân viên nhập liệu trực tiếp vào các ô tương ứng của các Tab (DU_AN, CHUYEN_VIEN, TRANG_CHU_CAI_DAT, TIN_TUC, TUYEN_DUNG).', '', ''],
    ['- Không thay đổi tên các Tab (Sheet) để hệ thống tự động đồng bộ chuẩn xác.', '', ''],
    ['- Mỗi dòng tương ứng với 1 Dự án, 1 Chuyên viên hoặc 1 Tin tức.', '', ''],
    ['', '', ''],
    ['2. ĐẶC BIỆT: QUY ĐỊNH NHẬP HÌNH ẢNH CHUYÊN VIÊN (TƯ VẤN VIÊN)', '', ''],
    ['- Cột "Link Ảnh Chân Dung": KHÔNG dán file ảnh trực tiếp vào ô Excel mà dán Link URL ảnh.', '', ''],
    ['- Cách 1 (Google Drive): Đưa ảnh chuyên viên vào thư mục Google Drive > Bấm "Chia sẻ" > Đổi sang "Bất kỳ ai có đường liên kết đều có thể xem" > Sao chép link dán vào cột này. Hệ thống website sẽ tự động chuyển đổi sang ảnh hiển thị.', '', ''],
    ['- Cách 2 (Link ảnh web/Cloud): Dán đường link ảnh có định dạng .jpg, .png, .webp (từ trang web khác, Imgur, Cloudinary...).', '', ''],
    ['- Cách 3 (Ảnh chụp gửi riêng): Nhân viên gom ảnh gửi cho Quản trị viên, đặt tên file theo Tên hoặc Mã ID của chuyên viên. Quản trị viên sẽ gắn ảnh trực tiếp trong CMS.', '', ''],
    ['- Tiêu chuẩn ảnh: Ảnh chân dung tỉ lệ 3:4 hoặc 1:1, phông nền sang trọng (vest, áo sơ mi chuyên nghiệp), không bị vỡ hạt.', '', ''],
    ['', '', ''],
    ['3. HƯỚNG DẪN NHẬP CHỈ SỐ TRANG CHỦ (TAB 3)', '', ''],
    ['- Con số 100%, 5+, 65%, 24/7 có thể thay đổi bất kỳ ký tự nào (ví dụ: 99.8%, 10+, 70%, 24/7).', '', ''],
    ['- Khẩu hiệu "Tái định hình chuẩn mực bất động sản cao cấp" có thể thay đổi trong ô "heroTitleHighlight".', '', ''],
  ];
}

/**
 * Create Google Spreadsheet with all sheets formatted and populated
 */
export async function createGoogleSheetForSite(
  siteData: SiteData,
  accessToken: string,
  shareEmail: string = 'hieupham.2412@gmail.com'
): Promise<GoogleSheetCreationResult> {
  const sheetTitles = [
    '1_DU_AN',
    '2_CHUYEN_VIEN',
    '3_TRANG_CHU_CAI_DAT',
    '4_TIN_TUC',
    '5_TUYEN_DUNG',
    '6_HUONG_DAN_NHAP_LIEU',
  ];

  // 1. Create Spreadsheet with sheets
  const requestBody = {
    properties: {
      title: `SI Property - Dữ Liệu Website & Nhập Liệu Nội Bộ (${new Date().toLocaleDateString('vi-VN')})`,
    },
    sheets: sheetTitles.map((title) => ({
      properties: {
        title,
        gridProperties: {
          rowCount: 200,
          columnCount: 20,
        },
      },
    })),
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    console.error('Failed to create spreadsheet:', errText);
    throw new Error(`Không thể khởi tạo Google Sheet: ${errText}`);
  }

  const createdData = await createRes.json();
  const spreadsheetId = createdData.spreadsheetId;
  const spreadsheetUrl = createdData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. Populate data into each sheet using batchUpdate values
  const projectsData = buildProjectsSheetData(siteData.projects || []);
  const advisorsData = buildAdvisorsSheetData(siteData.advisors || []);
  const generalData = buildGeneralSheetData(siteData.general);
  const newsData = buildNewsSheetData(siteData.news || []);
  const careersData = buildCareersSheetData(siteData.careers?.jobs || []);
  const guideData = buildGuideSheetData();

  const valueRanges = [
    { range: '1_DU_AN!A1', values: projectsData },
    { range: '2_CHUYEN_VIEN!A1', values: advisorsData },
    { range: '3_TRANG_CHU_CAI_DAT!A1', values: generalData },
    { range: '4_TIN_TUC!A1', values: newsData },
    { range: '5_TUYEN_DUNG!A1', values: careersData },
    { range: '6_HUONG_DAN_NHAP_LIEU!A1', values: guideData },
  ];

  const updateValuesRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: valueRanges,
      }),
    }
  );

  if (!updateValuesRes.ok) {
    console.warn('Warning: Some values failed to write into Google Sheet', await updateValuesRes.text());
  }

  // 3. Share permissions with User's Email (Writer role)
  const sharedWith: string[] = [];
  if (shareEmail && shareEmail.includes('@')) {
    try {
      const shareRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${spreadsheetId}/permissions?sendNotificationEmail=true`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role: 'writer',
            type: 'user',
            emailAddress: shareEmail.trim(),
          }),
        }
      );
      if (shareRes.ok) {
        sharedWith.push(shareEmail.trim());
      } else {
        console.warn('Share email result:', await shareRes.text());
      }
    } catch (e) {
      console.warn('Could not share with user email:', e);
    }
  }

  // Also enable link sharing with writer permissions so other staff can edit immediately
  try {
    await fetch(
      `https://www.googleapis.com/drive/v3/files/${spreadsheetId}/permissions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'writer',
          type: 'anyone',
        }),
      }
    );
    sharedWith.push('Bất kỳ ai có liên kết (Quyền Chỉnh sửa/Editor)');
  } catch (e) {
    console.warn('Could not set anyone permission:', e);
  }

  // Cache in localStorage for easy access
  try {
    localStorage.setItem('si_property_google_sheet_id', spreadsheetId);
    localStorage.setItem('si_property_google_sheet_url', spreadsheetUrl);
  } catch (_) {}

  return {
    spreadsheetId,
    spreadsheetUrl,
    sharedWith,
  };
}

/**
 * Synchronize website data FROM Google Sheet into the application
 */
export async function syncDataFromGoogleSheet(
  spreadsheetId: string,
  accessToken: string,
  currentSiteData: SiteData
): Promise<GoogleSheetSyncResult> {
  const ranges = [
    '1_DU_AN!A2:P200',
    '2_CHUYEN_VIEN!A2:M200',
    '3_TRANG_CHU_CAI_DAT!A2:C50',
    '4_TIN_TUC!A2:L200',
    '5_TUYEN_DUNG!A2:G100',
  ];

  const queryParams = ranges.map((r) => `ranges=${encodeURIComponent(r)}`).join('&');
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi khi đọc Google Sheet (${res.status}): ${errorText}`);
  }

  const json = await res.json();
  const valueRanges = json.valueRanges || [];

  // Parse 1: Projects
  const projectRows: (string | number)[][] = valueRanges[0]?.values || [];
  const parsedProjects: Project[] = [];
  projectRows.forEach((row, idx) => {
    const name = String(row[1] || '').trim();
    if (!name) return; // Skip empty rows
    parsedProjects.push({
      id: String(row[0] || `project-${Date.now()}-${idx}`).trim(),
      name,
      tagline: String(row[2] || '').trim(),
      developer: String(row[3] || 'SI Property').trim(),
      location: String(row[4] || 'TP. Vũng Tàu').trim(),
      type: String(row[5] || 'Căn hộ cao cấp').trim(),
      price: String(row[6] || 'Liên hệ').trim(),
      scale: String(row[7] || '').trim(),
      status: String(row[8] || 'Đang mở bán').trim(),
      badge: String(row[9] || '').trim(),
      image: formatDirectImageUrl(String(row[10] || '').trim()) || (currentSiteData.projects[idx]?.image || ''),
      description: String(row[11] || '').trim(),
      features: String(row[12] || '')
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      order: Number(row[13]) || idx + 1,
      landingUrl: String(row[14] || '').trim(),
      actionType: (String(row[15] || '').toLowerCase() === 'landing' ? 'landing' : 'modal') as 'modal' | 'landing',
    });
  });

  // Parse 2: Advisors
  const advisorRows: (string | number)[][] = valueRanges[1]?.values || [];
  const parsedAdvisors: Advisor[] = [];
  advisorRows.forEach((row, idx) => {
    const name = String(row[1] || '').trim();
    if (!name) return;
    const isFeaturedStr = String(row[9] || '').toLowerCase();
    const isFeatured = isFeaturedStr === 'có' || isFeaturedStr === 'yes' || isFeaturedStr === 'true' || isFeaturedStr === '1';
    
    // Check photo link with direct format conversion
    const rawImage = String(row[10] || '').trim();
    const formattedImage = formatDirectImageUrl(rawImage);

    parsedAdvisors.push({
      id: String(row[0] || `advisor-${Date.now()}-${idx}`).trim(),
      name,
      title: String(row[2] || 'Chuyên viên tư vấn cao cấp').trim(),
      specialty: String(row[3] || 'Bất động sản biển').trim(),
      experience: String(row[4] || '5+ năm kinh nghiệm').trim(),
      awards: String(row[5] || '').trim(),
      phone: String(row[6] || currentSiteData.general.hotline || '').trim(),
      zalo: String(row[7] || '').trim(),
      email: String(row[8] || '').trim(),
      isFeatured,
      image: formattedImage || (currentSiteData.advisors[idx]?.image || ''),
      bio: String(row[11] || '').trim(),
      order: Number(row[12]) || idx + 1,
    });
  });

  // Parse 3: General & Metrics
  const generalRows: (string | number)[][] = valueRanges[2]?.values || [];
  const updatedGeneral: GeneralSettings = { ...currentSiteData.general };
  let generalUpdated = false;

  generalRows.forEach((row) => {
    const key = String(row[0] || '').trim();
    const val = String(row[2] || '').trim();
    if (key && val && key in updatedGeneral) {
      // @ts-ignore
      updatedGeneral[key] = val;
      generalUpdated = true;
    }
  });

  // Parse 4: News
  const newsRows: (string | number)[][] = valueRanges[3]?.values || [];
  const parsedNews: NewsArticle[] = [];
  newsRows.forEach((row, idx) => {
    const title = String(row[1] || '').trim();
    if (!title) return;
    parsedNews.push({
      id: String(row[0] || `news-${Date.now()}-${idx}`).trim(),
      title,
      category: String(row[2] || 'Thị trường').trim(),
      author: String(row[3] || 'SI Property').trim(),
      date: String(row[4] || new Date().toLocaleDateString('vi-VN')).trim(),
      readTime: String(row[5] || '3 phút').trim(),
      badge: String(row[6] || '').trim(),
      sourceUrl: String(row[7] || '').trim(),
      image: formatDirectImageUrl(String(row[8] || '').trim()) || (currentSiteData.news[idx]?.image || ''),
      summary: String(row[9] || '').trim(),
      content: String(row[10] || '').trim(),
      order: Number(row[11]) || idx + 1,
    });
  });

  // Parse 5: Jobs
  const jobRows: (string | number)[][] = valueRanges[4]?.values || [];
  const parsedJobs: JobPosition[] = [];
  jobRows.forEach((row, idx) => {
    const title = String(row[1] || '').trim();
    if (!title) return;
    parsedJobs.push({
      id: String(row[0] || `job-${Date.now()}-${idx}`).trim(),
      title,
      department: String(row[2] || '').trim(),
      location: String(row[3] || 'TP.HCM / Vũng Tàu').trim(),
      salary: String(row[4] || '').trim(),
      desc: String(row[5] || '').trim(),
      order: Number(row[6]) || idx + 1,
    });
  });

  // Build complete updated SiteData
  const updatedSiteData: SiteData = {
    ...currentSiteData,
    projects: parsedProjects.length > 0 ? parsedProjects : currentSiteData.projects,
    advisors: parsedAdvisors.length > 0 ? parsedAdvisors : currentSiteData.advisors,
    general: updatedGeneral,
    news: parsedNews.length > 0 ? parsedNews : currentSiteData.news,
    careers: {
      ...currentSiteData.careers,
      jobs: parsedJobs.length > 0 ? parsedJobs : currentSiteData.careers.jobs,
    },
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    message: `Đồng bộ thành công từ Google Sheet! Cập nhật ${parsedProjects.length} dự án, ${parsedAdvisors.length} chuyên viên, ${parsedNews.length} bài viết và các chỉ số trang chủ.`,
    stats: {
      projectsCount: parsedProjects.length,
      advisorsCount: parsedAdvisors.length,
      newsCount: parsedNews.length,
      jobsCount: parsedJobs.length,
      generalUpdated,
    },
    updatedSiteData,
  };
}

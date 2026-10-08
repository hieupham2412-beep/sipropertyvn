import { 
  Project, 
  Advisor, 
  NewsArticle, 
  JobPosition,
  AboutContent,
  CareersContent,
  ContactContent,
  GeneralSettings,
  PageHeadersSettings,
  CustomerInquiry,
  SiteData
} from '../types';

export function generateHodecoAdvisorCanvas(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Emerald Green Luxury Background
  const bgGrad = ctx.createRadialGradient(300, 300, 50, 300, 300, 350);
  bgGrad.addColorStop(0, '#0a3d30');
  bgGrad.addColorStop(1, '#02120e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 600, 600);

  // Gold Glow Rings
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#c59b27';
  ctx.beginPath();
  ctx.arc(300, 270, 180, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 4;
  ctx.strokeStyle = '#fce49c';
  ctx.beginPath();
  ctx.arc(300, 270, 192, 0, Math.PI * 2);
  ctx.stroke();

  // Consultant Silhouette Base
  ctx.fillStyle = '#062920';
  ctx.beginPath();
  ctx.arc(300, 270, 172, 0, Math.PI * 2);
  ctx.fill();

  // Head & Suit
  ctx.fillStyle = '#fce49c';
  ctx.beginPath();
  ctx.arc(300, 220, 65, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(300, 370, 110, 120, 0, 0, Math.PI * 2);
  ctx.fill();

  // Glasses & Smile
  ctx.strokeStyle = '#02120e';
  ctx.lineWidth = 6;
  ctx.strokeRect(255, 205, 38, 26);
  ctx.strokeRect(307, 205, 38, 26);
  ctx.beginPath();
  ctx.moveTo(293, 218);
  ctx.lineTo(307, 218);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(300, 248, 20, 0, Math.PI);
  ctx.stroke();

  // Gold Badge Banner on Canvas
  const badgeGrad = ctx.createLinearGradient(100, 480, 500, 560);
  badgeGrad.addColorStop(0, '#c59b27');
  badgeGrad.addColorStop(0.5, '#e5c158');
  badgeGrad.addColorStop(1, '#b3881e');
  ctx.fillStyle = badgeGrad;
  ctx.fillRect(80, 480, 440, 75);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.strokeRect(80, 480, 440, 75);

  ctx.fillStyle = '#051a14';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('THÀNH VIÊN CHIẾN LƯỢC CĐT HODECO', 300, 515);

  ctx.font = 'italic 16px serif';
  ctx.fillText('Đồng hành kiến tạo thịnh vượng', 300, 540);

  return canvas.toDataURL('image/jpeg', 0.9);
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'the-light-city',
    name: 'The Light City',
    tagline: 'Khu Đô Thị Kiểu Mẫu Ven Biển Vũng Tàu',
    developer: 'HODECO (Đối tác Chiến lược)',
    location: 'Phường 12, TP. Vũng Tàu, Bà Rịa - Vũng Tàu',
    type: 'Biệt thự, Nhà phố liên kế, Shophouse',
    price: 'Từ 4.5 - 18 Tỷ/căn',
    scale: '27.2 ha | 490 căn giai đoạn 1',
    status: 'Đang mở bán quỹ căn độc quyền',
    badge: 'Dự án Tiêu điểm HODECO',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    description: 'The Light City là kiệt tác bất động sản nghỉ dưỡng đô thị được quy hoạch bài bản bậc nhất Vũng Tàu với đầy đủ tiện ích: công viên Iris Central Park, clubhouse, trường học và đại lộ thương mại rực rỡ.',
    features: ['Hồ bơi vô cực', 'Hạ tầng đồng bộ ngầm hóa', 'Sổ đỏ từng nền', 'Công viên 5 ha']
  },
  {
    id: 'blanca',
    name: 'Blanca',
    tagline: 'Kiến Trúc Địa Trung Hải Sang Trọng & Phóng Khoáng',
    developer: 'SI Property Phát triển & Phân Phối',
    location: 'Cung đường biển tỷ đô, Bà Rịa - Vũng Tàu',
    type: 'Dinh thự Biển & Boutique Villa',
    price: 'Từ 8.2 Tỷ/căn',
    scale: '15 ha ven biển nguyên sơ',
    status: 'Nhận booking ưu tiên đợt 1',
    badge: 'Bộ Sưu Tập Giới Hạn',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    description: 'Blanca mang hơi thở kiến trúc Địa Trung Hải với những vòm cong mềm mại, sắc trắng ngà tinh khôi và tầm nhìn panorama đón trọn bình minh trên biển nguyên sơ.',
    features: ['Bến du thuyền tư nhân', 'Hồ bơi muối khoáng', 'Private Lounge', 'Dịch vụ quản gia 24/7']
  },
  {
    id: 'legacy-66',
    name: 'Legacy 66',
    tagline: 'Chuẩn Mực Sống Hiện Đại - Tâm Điểm Kết Nối Phồn Vinh',
    developer: 'Tập đoàn uy tín & Hợp tác SI Property',
    location: 'Mặt tiền trung tâm công nghiệp công nghệ cao',
    type: 'Căn hộ chuyên gia & Shophouse',
    price: 'Từ 1.3 - 2.8 Tỷ/căn',
    scale: '2 tòa tháp 29 tầng',
    status: 'Sẵn sàng bàn giao, pháp lý hoàn chỉnh',
    badge: 'Thanh Khoản Tối Ưu',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    description: 'Legacy 66 mở ra giải pháp an cư và đầu tư khai thác dòng tiền cho thuê vượt trội đối với cộng đồng chuyên gia, quản lý cấp cao với mức giá hợp lý và pháp lý chuẩn mực.',
    features: ['Hệ thống Smart Home', 'TTTM 3 tầng', 'Sky Garden trên đỉnh tháp', 'Bảo lãnh tài chính 70%']
  },
  {
    id: 'the-collection-688',
    name: 'The Collection 688',
    tagline: 'Bộ Sưu Tập Tư Dinh Dành Riêng Cho Giới Tinh Hoa',
    developer: 'SI Property & Đối tác Quốc tế',
    location: 'Trục giao thương chiến lược Đông Nam Bộ',
    type: 'Dinh thự sinh thái vườn',
    price: 'Từ 22 Tỷ/dinh thự',
    scale: 'Chỉ giới hạn 68 sản phẩm',
    status: 'Mở bán nội bộ theo lời mời (Invitation Only)',
    badge: 'Ultra Luxury Exclusive',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    description: 'Mỗi dinh thự tại The Collection 688 là một kiệt tác kiến trúc cá nhân hóa, hòa quyện thiên nhiên xanh mát cùng hệ an ninh đa lớp tuyệt mật cho chủ nhân thượng lưu.',
    features: ['Hầm rượu tư nhân', 'An ninh đa lớp sinh trắc học', 'Sân golf mini', 'Hồ cá Koi cảnh quan']
  },
  {
    id: 'green-skyline',
    name: 'Green Skyline',
    tagline: 'Tháp Căn Hộ Xanh Chuẩn ESG Đón Gió Biển',
    developer: 'Liên danh chiến lược SI Property',
    location: 'Trung tâm tài chính - du lịch đô thị biển',
    type: 'Căn hộ Dual-Key & Penthouse',
    price: 'Từ 2.9 - 9.5 Tỷ/căn',
    scale: '33 tầng nổi - 3 tầng hầm',
    status: 'Giai đoạn Booking giữ chỗ đợt đầu',
    badge: 'Biểu Tượng Xanh 2026',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    description: 'Green Skyline tiên phong ứng dụng vật liệu bền vững, năng lượng tái tạo và thiết kế giếng trời đối lưu gió tự nhiên, nâng niu sức khỏe toàn diện cho gia đình.',
    features: ['Vườn treo chân mây', 'Gym & Spa 5 sao', 'KidZone thông minh', 'Lọc khí tươi trung tâm']
  }
];

export const INITIAL_ADVISORS: Advisor[] = [
  {
    id: 'adv-tran-minh-duc',
    name: 'Trần Minh Đức',
    title: 'Giám Đốc Cấp Cao & Thành Viên Chiến Lược CĐT HODECO',
    specialty: 'The Light City, Blanca & Tư vấn danh mục đầu tư cao cấp',
    experience: '12 năm',
    awards: 'Top 1 Đại Sứ Bán Hàng HODECO, Chuyên Gia Tư Vấn Triệu Đô',
    phone: '0938 889 688',
    zalo: '0938889688',
    email: 'duc.tm@siproperty.vn',
    isFeatured: true,
    order: 1,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: `Với hơn một thập kỷ đồng hành cùng các chủ đầu tư danh tiếng như HODECO, anh Trần Minh Đức là người dẫn dắt tư duy thẩm định dự án khắt khe từ góc nhìn phát triển bền vững của SI Property.

Anh từng trực tiếp cố vấn cấu trúc tài chính cho hàng trăm khách hàng thượng lưu tại các dự án trọng điểm như The Light City, Blanca và The Collection 688. 

Triết lý làm việc: "Một bất động sản xứng tầm không chỉ là nơi an cư hay cất giữ dòng tiền, mà phải là di sản trường tồn được bảo chứng bằng quy hoạch đồng bộ và uy tín vững vàng của chủ đầu tư."`
  },
  {
    id: 'adv-nguyen-hoang-nam',
    name: 'Nguyễn Hoàng Nam',
    title: 'Trưởng Phòng Kinh Doanh Dự Án Biển',
    specialty: 'Dinh thự Blanca & The Light City',
    experience: '8 năm',
    awards: 'Chiến Binh Xuất Sắc HODECO 2024 - 2025',
    phone: '0909 234 567',
    zalo: '0909234567',
    email: 'nam.nh@siproperty.vn',
    isFeatured: false,
    order: 2,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
    bio: `Chuyên gia hoạch định dòng tiền sinh lời bền vững cho khách hàng sở hữu biệt thự biển Vũng Tàu và căn hộ chuyên gia cao cấp.

Tốt nghiệp chuyên ngành Tài chính Doanh nghiệp, anh Nam tiếp cận từng giao dịch dưới lăng kính nhà đầu tư: tính toán kỹ lưỡng tỉ suất sinh lời cho thuê, thời điểm thoái vốn tối ưu và tiềm năng tăng giá theo tiến độ hạ tầng cao tốc Biên Hòa - Vũng Tàu.

Phương châm phục vụ: "Minh bạch trong từng thông tin quy hoạch, tận tâm trong từng cam kết pháp lý, và luôn đặt lợi ích dài hạn của khách hàng lên hàng đầu."`
  },
  {
    id: 'adv-le-thao-my',
    name: 'Lê Thảo My',
    title: 'Chuyên Viên Tư Vấn BĐS Cao Cấp (Private Wealth)',
    specialty: 'The Collection 688 & Green Skyline',
    experience: '6 năm',
    awards: 'Top Doanh Số BĐS Triệu Đô Quý 1-2/2025',
    phone: '0912 345 678',
    zalo: '0912345678',
    email: 'my.lt@siproperty.vn',
    isFeatured: false,
    order: 3,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    bio: `Tận tâm, thấu hiểu và kín đáo. Chị Lê Thảo My chuyên cung cấp báo cáo phân tích thị trường chuẩn xác từng vi phân khu (micro-location) cho các gia đình và nhà đầu tư cá nhân cao cấp.

Chị có kinh nghiệm dày dặn trong việc hỗ trợ thiết lập hồ sơ phong thủy, thủ tục pháp lý sở hữu và kết nối các gói tài chính ưu đãi đặc quyền từ các ngân hàng đối tác chiến lược.

"Mỗi dinh thự hay căn hộ penthouse không đơn thuần là tài sản, mà là không gian sống tôn vinh giá trị của chủ nhân."`
  },
  {
    id: 'adv-pham-quoc-tuan',
    name: 'Phạm Quốc Tuấn',
    title: 'Trưởng Nhóm Phân Tích & Thẩm Định Pháp Lý',
    specialty: 'Pháp lý dự án, Legacy 66 & The Light City',
    experience: '9 năm',
    awards: 'Cố vấn pháp lý xuất sắc hiệp hội môi giới',
    phone: '0988 776 554',
    zalo: '0988776554',
    email: 'tuan.pq@siproperty.vn',
    isFeatured: false,
    order: 4,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    bio: `Bảo vệ quyền lợi tối đa của khách hàng với quy trình kiểm soát hồ sơ pháp lý 3 tầng nghiêm ngặt trước khi phân phối ra thị trường.

Với hơn 9 năm chuyên sâu về luật đất đai và quy hoạch xây dựng tại Bà Rịa - Vũng Tàu, anh Tuấn trực tiếp rà soát tính chuẩn mực của phê duyệt quy hoạch 1/500, giấy phép đủ điều kiện bán nhà hình thành trong tương lai và hợp đồng mua bán của CĐT HODECO.

Cam kết cốt lõi: "Khách hàng của SI Property luôn an tâm tuyệt đối về pháp lý chuẩn chỉ 100% trước khi xuống tiền."`
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-cafeland-149918',
    title: 'SI Property: Tái định hình chuẩn mực môi giới từ tư duy nhà phát triển dự án',
    category: 'Báo chí',
    author: 'CafeLand.vn',
    date: '2025-05-18',
    readTime: '5 phút đọc',
    badge: 'Tiêu điểm Báo Chí',
    sourceUrl: 'https://cafeland.vn/tin-tuc/si-property-tai-dinh-hinh-chuan-muc-moi-gioi-tu-tu-duy-nha-phat-trien-du-an-149918.html',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    summary: 'Giữa bối cảnh thị trường bất động sản bước vào chu kỳ thanh lọc mạnh mẽ, SI Property định hình lối đi riêng với triết lý: chuyên viên phải am hiểu quy hoạch, giải phóng mặt bằng và giá trị sử dụng thực chất.',
    content: `Trong bối cảnh thị trường bất động sản bước vào chu kỳ thanh lọc mạnh mẽ, nhà đầu tư và người mua an cư ngày càng khắt khe hơn đối với năng lực của đơn vị môi giới. Nhận thức sâu sắc thách thức này, SI Property (siproperty.vn) đã xác lập hướng đi đột phá: tái định hình chuẩn mực môi giới từ tư duy của nhà phát triển dự án.

Thay vì tiếp cận theo phương thức tư vấn thuần túy, đội ngũ SI Property đồng hành với khách hàng như một chuyên gia tài chính và cố vấn xây dựng. Mỗi sản phẩm được đưa vào giỏ hàng phân phối đều phải vượt qua bộ lọc thẩm định 3 lớp: cơ sở pháp lý hoàn chỉnh (quy hoạch 1/500, giấy phép xây dựng), tiềm năng kết nối hạ tầng thực tế trong bán kính 5-10km, và khả năng tạo lập dòng tiền sinh lời bền vững.

Đặc biệt, sự hợp tác chiến lược giữa SI Property và Chủ đầu tư HODECO (Công ty Cổ phần Phát triển Nhà Bà Rịa - Vũng Tàu) với đại dự án The Light City cùng các phân khu nghỉ dưỡng cao cấp như Blanca, Legacy 66 đã củng cố vị thế tiên phong của SI Property trên bản đồ bất động sản ven biển phía Nam.`
  },
  {
    id: 'news-the-light-city-vungtau',
    title: 'The Light City Vũng Tàu: Động lực bứt phá khi cao tốc Biên Hòa - Vũng Tàu sắp về đích',
    category: 'Dự án',
    author: 'Ban Nghiên Cứu SI Property',
    date: '2025-07-12',
    readTime: '6 phút đọc',
    badge: 'Phân Tích Dự Án',
    sourceUrl: '',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    summary: 'The Light City được quy hoạch 27.2 ha tại Phường 12, TP. Vũng Tàu do CĐT HODECO phát triển. Tiến độ hạ tầng cao tốc đang biến nơi đây thành thỏi nam châm dòng vốn đô thị biển.',
    content: `Đại dự án The Light City do HODECO triển khai tại Phường 12, TP. Vũng Tàu đang trở thành tâm điểm chú ý của giới đầu tư địa ốc. Được quy hoạch trên quy mô 27.2 ha, dự án hội tụ đầy đủ các sản phẩm: nhà liên kế, biệt thự đơn lập, biệt thự song lập và shophouse thương mại sầm uất.

Cùng với trục động lực cao tốc Biên Hòa - Vũng Tàu và sân bay quốc tế Long Thành đang đẩy nhanh tiến độ, cự ly di chuyển từ TP.HCM về The Light City chỉ còn khoảng 60 phút. Điều này biến dự án thành "Second Home" chuẩn mực, vừa đáp ứng nhu cầu an cư cao cấp ven biển, vừa sở hữu tiềm năng tăng giá vượt trội theo từng cột mốc hạ tầng giao thông kết nối.`
  },
  {
    id: 'news-blanca-luxury',
    title: 'Kiến trúc Địa Trung Hải tại Blanca: Khi chuẩn mực nghỉ dưỡng tư gia lên ngôi',
    category: 'Dự án',
    author: 'Ban Sáng Tạo & Thiết Kế',
    date: '2025-08-04',
    readTime: '4 phút đọc',
    badge: 'Kiến Trúc & Đẳng Cấp',
    sourceUrl: '',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    summary: 'Sự kết hợp tinh tế giữa gam màu trắng ngà, vòm cong mềm mại và biển xanh ngút ngàn tại Blanca tạo nên phong cách sống xa hoa, biệt lập cho chủ nhân thượng lưu.',
    content: `Khác biệt hoàn toàn với lối thiết kế đô thị truyền thống, dự án dinh thự biển Blanca mang hơi thở phóng khoáng của vùng bờ biển Amalfi và Riviera Địa Trung Hải. Với số lượng giới hạn và mật độ xây dựng thấp, mỗi tư dinh tại Blanca được bao bọc bởi vườn nhiệt đới, hồ bơi điện phân muối khoáng và tầm nhìn trực diện đại dương.

SI Property phân phối Blanca với quy chuẩn bàn giao cao cấp, cam kết đồng hành cùng các đơn vị quản lý dịch vụ quản gia 24/7, mang đến trải nghiệm sống như tại những resort hàng đầu thế giới.`
  },
  {
    id: 'news-phap-ly-vang',
    title: 'Cẩm nang thẩm định pháp lý dự án BĐS cao cấp: 5 yếu tố "vàng" nhà đầu tư cần biết',
    category: 'Cẩm nang đầu tư',
    author: 'Phạm Quốc Tuấn (Trưởng Phòng Pháp Lý)',
    date: '2025-09-02',
    readTime: '8 phút đọc',
    badge: 'Cẩm Nang Thực Chiến',
    sourceUrl: '',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    summary: 'Hiểu rõ quy hoạch 1/500, giấy chứng nhận quyền sử dụng đất, giấy phép xây dựng và nghiệm thu hạ tầng là chìa khóa để bảo vệ 100% tài sản của bạn.',
    content: `Trong bất động sản, pháp lý không đơn thuần là thủ tục hành chính mà là lá chắn bảo vệ an toàn cho toàn bộ tài sản của khách hàng. Tại SI Property, chúng tôi áp dụng quy trình kiểm định 5 bước nghiêm ngặt:
1. Kiểm tra quyết định phê duyệt quy hoạch chi tiết tỷ lệ 1/500.
2. Kiểm tra nghĩa vụ tài chính và tiền sử dụng đất đã nộp đủ vào ngân sách nhà nước.
3. Xác minh giấy phép xây dựng và thiết kế kỹ thuật được cơ quan có thẩm quyền phê duyệt.
4. Kiểm tra văn bản đủ điều kiện bán nhà ở hình thành trong tương lai của Sở Xây dựng.
5. Kiểm tra thỏa thuận bảo lãnh bàn giao nhà ở của ngân hàng thương mại uy tín.

Khi một dự án đáp ứng đầy đủ 5 tiêu chí này, nhà đầu tư hoàn toàn có thể yên tâm về tiến độ cấp sổ hồng và khả năng thanh khoản lâu dài.`
  }
];

export const INITIAL_ABOUT: AboutContent = {
  badge: 'Về Chúng Tôi • SI Property',
  title: 'TÁI ĐỊNH HÌNH CHUẨN MỰC MÔI GIỚI BẤT ĐỘNG SẢN CAO CẤP',
  subtitle: 'Trở thành điểm tựa đầu tư thịnh vượng cho khách hàng thông qua năng lực thẩm định toàn diện từ quy hoạch, pháp lý tới biên độ tăng giá thực tế.',
  quoteTitle: '“SI Property: Đồng hành kiến tạo giá trị chuẩn mực cùng đối tác chiến lược HODECO”',
  quoteText1: 'Trong bối cảnh thị trường bất động sản bước vào chu kỳ thanh lọc mạnh mẽ, người mua không còn dễ dãi với những lời hứa hẹn suông. Nhận thức rõ điều này, SI Property (siproperty.vn) được sáng lập với triết lý: Mỗi chuyên viên tư vấn phải am hiểu tường tận gốc rễ của khu đất, nguồn gốc dòng tiền, tiến độ giải phóng mặt bằng và giá trị sử dụng thực tế của cư dân.',
  quoteText2: 'Sự gắn kết mật thiết và trở thành Thành viên chiến lược của CĐT HODECO đã mở ra đặc quyền giỏ hàng độc quyền tại những dự án trọng điểm như The Light City Vũng Tàu, Blanca, Legacy 66, The Collection 688, Green Skyline... giúp SI Property luôn chủ động cung cấp thông tin chuẩn xác và chính sách ưu đãi vượt trội cho khách hàng.',
  sourceLabel: 'Trích nguồn: Báo điện tử Bất động sản CafeLand (Bài viết số #149918)',
  sourceUrl: 'https://cafeland.vn/tin-tuc/si-property-tai-dinh-hinh-chuan-muc-moi-gioi-tu-tu-duy-nha-phat-trien-du-an-149918.html',
  values: [
    {
      id: 'val-1',
      title: 'CHUYÊN TÂM',
      desc: 'Đặt lợi ích lâu dài và sự an toàn vốn của quý khách hàng lên trên hết. Phục vụ với sự thấu đáo và chữ Tâm trong từng giải pháp đề xuất.'
    },
    {
      id: 'val-2',
      title: 'CHUYÊN NGHIỆP',
      desc: 'Quy trình tư vấn chuẩn chỉnh 5 sao, bảo mật thông tin tài sản cá nhân tuyệt đối và đồng hành pháp lý xuyên suốt vòng đời tài sản.'
    },
    {
      id: 'val-3',
      title: 'CHUYÊN SÂU',
      desc: 'Phân tích dữ liệu quy hoạch thực địa, am hiểu tường tận chính sách vĩ mô và nắm bắt sớm những lực đẩy hạ tầng ven biển.'
    }
  ]
};

export const INITIAL_JOBS: JobPosition[] = [
  {
    id: 'job-1',
    title: 'Chuyên Viên Tư Vấn BĐS Cao Cấp (Senior Broker)',
    department: 'Khối Kinh Doanh & Phân Phối',
    location: 'TP.HCM & Bà Rịa - Vũng Tàu',
    salary: 'Lương cứng 15M - 35M + Hoa hồng tới 65% (Thu nhập 100M - 500M+)',
    desc: 'Tư vấn các dòng sản phẩm trọng điểm: Biệt thự, Dinh thự biển Blanca, Shophouse The Light City. Khách hàng nét được công ty phân bổ trực tiếp.',
  },
  {
    id: 'job-2',
    title: 'Trưởng Phòng Kinh Doanh Dự Án HODECO',
    department: 'Ban Quản Trị Kinh Doanh',
    location: 'TP. Vũng Tàu',
    salary: 'Lương cứng 25M - 50M + Thưởng doanh số toàn phòng + ESOP',
    desc: 'Dẫn dắt đội ngũ 10-15 nhân sự phân phối độc quyền các dự án chiến lược. Yêu cầu 3+ năm kinh nghiệm quản lý đội nhóm BĐS cao cấp.',
  },
  {
    id: 'job-3',
    title: 'Chuyên Viên Digital Marketing & Growth Lead',
    department: 'Khối Marketing & Thương Hiệu',
    location: 'TP.HCM',
    salary: 'Lương 18M - 30M + KPI hiệu quả Lead',
    desc: 'Lên chiến dịch chạy Performance Marketing đa kênh (Google, Meta, Zalo, Báo chí) cho các dự án bất động sản hàng hiệu ven biển.',
  },
];

export const INITIAL_CAREERS: CareersContent = {
  badge: 'Gia Nhập Đội Ngũ Tinh Hoa',
  title: 'CƠ HỘI BỨT PHÁ THU NHẬP CÙNG SI PROPERTY',
  subtitle: 'Chính sách hoa hồng cao nhất thị trường, chi trả minh bạch và quyền tiếp cận quỹ sản phẩm độc quyền từ CĐT HODECO.',
  benefits: [
    {
      id: 'ben-1',
      title: 'Hoa Hồng Tới 65% - Chi Trả Trong 72h',
      desc: 'Quy trình thanh toán hoa hồng tốc độ, bảo đảm quyền lợi tài chính tuyệt đối cho từng giao dịch của chiến binh SI Property.'
    },
    {
      id: 'ben-2',
      title: 'Giỏ Hàng Độc Quyền CĐT HODECO',
      desc: 'Luôn nắm giữ những quỹ căn đẹp nhất tại The Light City Vũng Tàu, Blanca, Legacy 66 với mức giá gốc ưu đãi nhất.'
    },
    {
      id: 'ben-3',
      title: 'Đào Tạo Chuyên Sâu Đẳng Cấp',
      desc: 'Được huấn luyện trực tiếp bởi ban lãnh đạo thâm niên, trang bị kiến thức thẩm định pháp lý và phục vụ khách hàng thượng lưu.'
    }
  ],
  jobs: INITIAL_JOBS
};

export const INITIAL_CONTACT: ContactContent = {
  badge: 'Kết Nối Với SI Property',
  title: 'LIÊN HỆ & ĐẶT LỊCH TƯ VẤN VIP',
  subtitle: 'Đội ngũ chuyên viên cao cấp của SI Property luôn sẵn sàng lắng nghe nhu cầu và xây dựng giải pháp phân bổ tài sản tối ưu nhất.',
  hotline: '0938.889.688',
  hotlineAlt: '1900 6886',
  email: 'hieupham.2412@gmail.com',
  hcmOfficeTitle: 'Trụ sở Chiến Lược TP. Hồ Chí Minh',
  hcmOfficeAddress: 'Tòa nhà VP Hạng A, Trung tâm TP. Hồ Chí Minh',
  vtOfficeTitle: 'Văn Phòng Giao Dịch Vũng Tàu (HODECO Center)',
  vtOfficeAddress: 'Trung tâm TP. Vũng Tàu, Tỉnh Bà Rịa - Vũng Tàu',
  faqs: [
    {
      id: 'faq-1',
      question: 'SI Property đóng vai trò gì với HODECO?',
      answer: 'Là thành viên phân phối chiến lược cấp cao, nắm giữ giỏ hàng độc quyền, chính sách giá gốc và bảo lãnh pháp lý trực tiếp cho khách hàng.'
    },
    {
      id: 'faq-2',
      question: 'Làm sao để đặt lịch tour tham quan The Light City?',
      answer: 'Chỉ cần để lại số điện thoại hoặc gọi hotline 0938.889.688. SI Property bố trí xe đưa đón VIP và chuyên viên phụ trách riêng.'
    }
  ]
};

export const INITIAL_GENERAL: GeneralSettings = {
  siteTitle: 'SI Property - Sàn Giao Dịch Bất Động Sản Cao Cấp',
  brandName: 'SI PROPERTY',
  logoUrl: '/logo-si-property.svg',
  hotline: '0938.889.688',
  vipCtaText: 'Giỏ Hàng VIP',
  heroBadge: 'Thành Viên Chiến Lược Của CĐT HODECO',
  heroTitle: 'TÁI ĐỊNH HÌNH CHUẨN MỰC',
  heroTitleHighlight: 'BẤT ĐỘNG SẢN CAO CẤP',
  heroSubtitle: 'SI Property kết hợp khắt khe giữa phân tích quy hoạch, năng lực thẩm định pháp lý và giỏ hàng bất động sản ven biển cao cấp, mang lại thịnh vượng bền vững cho nhà đầu tư tinh hoa.',
  heroBgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
  metric1Value: '100%',
  metric1Label: 'Pháp Lý 1/500 Chuẩn Chỉnh',
  metric2Value: '5+',
  metric2Label: 'Đại Dự Án Trọng Điểm',
  metric3Value: '65%',
  metric3Label: 'Hoa Hồng Tối Đa Trong 72h',
  metric4Value: '24/7',
  metric4Label: 'Private Wealth Concierge',
  homeProjectsBadge: 'Giỏ Hàng Độc Quyền Phân Phối',
  homeProjectsTitle: 'CÁC DỰ ÁN TIÊU BIỂU CỦA CĐT HODECO & ĐỐI TÁC',
  homeNewsBadge: 'Báo Chí & Nhận Định Chuyên Gia',
  homeNewsTitle: 'TIN TỨC & GÓC NHÌN ĐẦU TƯ',
  footerDescription: 'Sàn Giao dịch Bất động sản Cao cấp - Thành viên chiến lược của CĐT HODECO. Tái định hình chuẩn mực môi giới với tư duy của nhà phát triển dự án.',
  footerQuote: '“Chuyên tâm - Chuyên nghiệp - Chuyên sâu”',
  footerHodecoTitle: 'Hợp Tác HODECO',
  footerHodecoDesc: 'Đồng hành chiến lược kiến tạo thịnh vượng cùng Công ty Cổ phần Phát triển Nhà Bà Rịa - Vũng Tàu.',
  footerCopyright: '© 2026 SI Property (siproperty.vn). Thành viên chiến lược CĐT HODECO.'
};

export const INITIAL_PAGE_HEADERS: PageHeadersSettings = {
  advisorsBadge: 'Đội Ngũ Tinh Hoa • SI Property',
  advisorsTitle: 'CHUYÊN VIÊN TƯ VẤN BẤT ĐỘNG SẢN CAO CẤP',
  advisorsSubtitle: 'Mỗi chuyên viên tại SI Property là một cố vấn đầu tư am tường thị trường, được đào tạo chuẩn mực về thẩm định pháp lý và tận tâm bảo toàn giá trị cho khách hàng.',
  projectsBadge: 'Giỏ Hàng Chiến Lược • SI Property',
  projectsTitle: 'DANH MỤC DỰ ÁN PHÂN PHỐI ĐỘC QUYỀN',
  projectsSubtitle: 'Tuyển tập những siêu dự án ven biển và khu đô thị kiểu mẫu có pháp lý hoàn chỉnh 1/500, sở hữu tiềm năng sinh lời và thanh khoản vượt trội.',
  newsBadge: 'Thông Tin Thị Trường & Báo Chí',
  newsTitle: 'TIN TỨC, PHÂN TÍCH & BÁO CHÍ CHUYÊN ĐỀ',
  newsSubtitle: 'Cập nhật kịp thời nhịp đập thị trường bất động sản, tiến độ hạ tầng giao thông và các nhận định khách quan từ báo chí chính thống.'
};

export const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'inq-1',
    fullName: 'Trần Minh Hoàng',
    phone: '0918.234.567',
    email: 'hoang.tran@investment.vn',
    projectInterest: 'The Light City (HODECO)',
    message: 'Quan tâm phân khu nhà phố thương mại (shophouse), cần tư vấn chính sách thanh toán và chiết khấu tháng này.',
    status: 'new',
    notes: 'Khách VIP có dòng vốn sẵn, ưu tiên liên hệ trong buổi sáng.',
    createdAt: '2026-09-17T08:30:00.000Z'
  },
  {
    id: 'inq-2',
    fullName: 'Nguyễn Thị Mai Lan',
    phone: '0903.888.999',
    email: 'mailan.bds@gmail.com',
    projectInterest: 'Khu Đô Thị Sinh Thái Blanca (Vũng Tàu)',
    message: 'Tôi muốn tìm hiểu biệt thự nghỉ dưỡng ven biển, cần tư vấn pháp lý 1/500 và tiến độ bàn giao.',
    status: 'contacted',
    notes: 'Đã gọi điện trao đổi sơ bộ, gửi brochure qua Zalo. Hẹn xem dự án cuối tuần.',
    createdAt: '2026-09-16T14:15:00.000Z'
  }
];

export const INITIAL_SITE_DATA: SiteData = {
  general: INITIAL_GENERAL,
  pageHeaders: INITIAL_PAGE_HEADERS,
  about: INITIAL_ABOUT,
  projects: INITIAL_PROJECTS,
  advisors: INITIAL_ADVISORS,
  news: INITIAL_NEWS,
  careers: INITIAL_CAREERS,
  contact: INITIAL_CONTACT,
  inquiries: INITIAL_INQUIRIES,
  updatedAt: '2026-09-17T00:00:00.000Z'
};



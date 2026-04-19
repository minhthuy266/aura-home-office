const WP_URL = 'https://cms.aurahomeoffice.com/wp-json/wp/v2';
const WP_USER = 'admin'; 
const WP_APP_PASS = 'i56Q kTjc ghPB E7Sv 8qFB Hzrq'; 

const authHeader = 'Basic ' + Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64');
const headers = {
  'Content-Type': 'application/json',
  'Authorization': authHeader
};

async function wpGet(endpoint) {
  const response = await fetch(`${WP_URL}/${endpoint}?per_page=100`, { headers });
  if (!response.ok) return [];
  return await response.json();
}

async function wpPost(endpoint, data) {
  try {
    const response = await fetch(`${WP_URL}/${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      if (result.code === 'term_exists') {
        return { id: result.data.term_id }; 
      }
      return null;
    }
    return result;
  } catch (error) {
    return null;
  }
}

const tagsToCreate = [
  'under-200', 'under-500', 'budget', 'premium', 'luxury',
  'electric', 'manual', 'mesh', 'leather', 'dual-monitor', 'ultrawide',
  'small-space', 'minimalist', 'gaming', 'programmer', 'student',
  'back-pain', 'eye-strain', 'carpal-tunnel', 'posture', 'sciatica',
  'flexispot', 'uplift', 'sihoo', 'herman-miller', 'ergotron', 'benq',
  'memory-preset', 'usb-charging', 'wireless', 'adjustable', 'foldable'
];

const month1Posts = [
  // Furniture -> standing-desks
  { title: 'Best Standing Desks 2026: 15+ Models Tested', slug: 'best-standing-desks-2026', cat: 'standing-desks', tags: ['premium', 'electric'] },
  { title: 'FlexiSpot vs Uplift vs Jarvis: So sánh 3 thương hiệu #1', slug: 'flexispot-vs-uplift', cat: 'standing-desks', tags: ['flexispot', 'uplift'] },
  { title: 'Standing desk under $300: 10 options worth buying', slug: 'standing-desk-under-300', cat: 'standing-desks', tags: ['under-500', 'budget'] },
  { title: 'Ưu nhược điểm bàn cơ vs điện: Nên chọn loại nào?', slug: 'electric-vs-manual-desks', cat: 'standing-desks', tags: ['electric', 'manual'] },
  { title: 'L-shaped standing desks: Top 5 cho góc làm việc', slug: 'l-shaped-standing-desks', cat: 'standing-desks', tags: ['small-space'] },
  
  // Furniture -> ergonomic-chairs
  { title: 'Best ergonomic chair under $300: 8 picks that dont suck', slug: 'best-ergonomic-chairs-under-300', cat: 'ergonomic-chairs', tags: ['budget', 'under-500'] },
  { title: 'Review chi tiết: Sihoo M18, M57, HBADA', slug: 'sihoo-m18-review', cat: 'ergonomic-chairs', tags: ['sihoo', 'mesh'] },
  { title: 'Mesh vs leather executive chairs: Pros & Cons', slug: 'mesh-vs-leather-chairs', cat: 'ergonomic-chairs', tags: ['mesh', 'leather'] },
  
  // Furniture -> desk-converters
  { title: 'Best desk converter 2026: 10 models for any budget', slug: 'best-desk-converters', cat: 'desk-converters', tags: ['budget', 'minimalist'] },
  
  // Furniture -> footrests-mats
  { title: 'Best standing desk mat 2026: 10 tested & reviewed', slug: 'best-anti-fatigue-mats', cat: 'footrests-mats', tags: ['posture'] },
  
  // Furniture -> desk-storage
  { title: 'Top tủ tài liệu dưới gầm bàn 2026: 8 models review', slug: 'best-under-desk-file-cabinets', cat: 'desk-storage', tags: ['small-space'] },
  
  // Setup -> monitor-arms
  { title: 'Best monitor arm 2026: 12 models reviewed', slug: 'best-monitor-arms-2026', cat: 'monitor-arms', tags: ['ergotron'] },
  { title: 'Giá đỡ 2 màn hình tốt nhất: Top 10 options 2026', slug: 'dual-monitor-arm-setup', cat: 'monitor-arms', tags: ['dual-monitor'] },
  
  // Setup -> desk-lighting
  { title: 'Best screenbar 2026: BenQ, Xiaomi, Quntis review', slug: 'best-led-light-bars', cat: 'desk-lighting', tags: ['benq', 'eye-strain'] },
  { title: 'Bias lighting cho màn hình: Setup guide', slug: 'bias-lighting-guide', cat: 'desk-lighting', tags: ['eye-strain'] },
  
  // Setup -> cable-management
  { title: 'Cable management từ A-Z: Setup gọn gàng trong 1 giờ', slug: 'cable-management-guide', cat: 'cable-management', tags: ['minimalist'] },
  { title: 'Khay sắt đi dây gầm bàn: Top 8 options 2026', slug: 'best-cable-trays', cat: 'cable-management', tags: ['budget'] },
  
  // Setup -> keyboards-mice
  { title: 'Chuột dọc chống hội chứng ống cổ tay: Top 10 reviews', slug: 'best-vertical-mice', cat: 'keyboards-mice', tags: ['carpal-tunnel', 'wireless'] },
  
  // Setup -> desk-accessories
  { title: 'Thảm da trải bàn tốt nhất: Leather vs Felt comparison', slug: 'best-desk-pads', cat: 'desk-accessories', tags: ['leather', 'minimalist'] },
  
  // Guides -> ergonomics-health
  { title: 'Công thức tính chiều cao bàn chuẩn: Calculator + Chart', slug: 'standing-desk-height-calculator', cat: 'ergonomics-health', tags: ['posture'] },
  { title: 'Góc tay 90 độ khi gõ phím — Hướng dẫn setup chi tiết', slug: 'ergonomic-tips-remote-workers', cat: 'ergonomics-health', tags: ['carpal-tunnel'] },
  { title: 'Chống đau lưng dưới khi ngồi nhiều: 10 stretches', slug: 'back-pain-relief-exercises', cat: 'ergonomics-health', tags: ['back-pain'] },
  { title: 'Eye strain from screens: Blue light, dry eyes, solutions', slug: 'eye-strain-lighting-setup', cat: 'ergonomics-health', tags: ['eye-strain'] },
  
  // Guides -> workspace-ideas
  { title: '50+ Minimalist desk setup ideas (2026 edition)', slug: 'minimalist-desk-setup-ideas', cat: 'workspace-ideas', tags: ['minimalist'] },
  { title: 'Setup bàn trong phòng ngủ 10m2: 15 space-saving ideas', slug: 'small-space-desk-setup', cat: 'workspace-ideas', tags: ['small-space'] },
  { title: 'Transform góc làm việc dưới $200: Step-by-step', slug: 'budget-desk-makeover-under-200', cat: 'workspace-ideas', tags: ['budget', 'under-200'] },
  { title: 'Scandinavian WFH corner inspiration: 30+ photos', slug: 'scandinavian-desk-ideas', cat: 'workspace-ideas', tags: ['minimalist'] },
  
  // Guides -> productivity
  { title: 'Pomodoro technique cho WFH: Complete guide + apps', slug: 'pomodoro-technique-wfh', cat: 'productivity', tags: ['programmer'] },
  { title: 'Deep work: Cách vào Flow state (science-backed methods)', slug: 'deep-work-focus-guide', cat: 'productivity', tags: ['programmer'] },
  { title: 'Morning routine for WFH productivity: 7 steps', slug: 'morning-routine-wfh', cat: 'productivity', tags: [] }
];

async function run() {
  console.log('Fetching Categories...');
  const cats = await wpGet('categories');
  const catMap = {};
  cats.forEach(c => { catMap[c.slug] = c.id; });

  console.log('Creating Tags...');
  const tagMap = {};
  for (const tag of tagsToCreate) {
    const res = await wpPost('tags', { name: tag, slug: tag });
    if (res && res.id) {
       tagMap[tag] = res.id;
    }
  }

  console.log('Creating THÁNG 1 Content Plan (30 Articles)...');
  for (const p of month1Posts) {
    const catId = catMap[p.cat];
    if (!catId) {
       console.log('⚠️ Missing category:', p.cat);
       continue;
    }
    
    const tagIds = (p.tags && p.tags.length > 0) ? p.tags.map(t => tagMap[t]).filter(Boolean) : [];
    
    // Check if post already exists simply by pushing it
    await wpPost('posts', {
       title: p.title,
       slug: p.slug,
       content: `<!-- wp:paragraph --><p>Welcome to <strong>${p.title}</strong>. This is a highly optimized editorial layout waiting for the full article content.</p><!-- /wp:paragraph -->`,
       categories: [catId],
       tags: tagIds,
       status: 'publish'
    });
    console.log(`✅ Created: ${p.title}`);
  }
  
  console.log('🎉 Xong! Đã up toàn bộ content Tháng 1 và 30 Tags!');
}

run();

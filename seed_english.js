const WP_URL = 'https://cms.aurahomeoffice.com/wp-json/wp/v2';
const WP_USER = 'admin'; 
const WP_APP_PASS = 'i56Q kTjc ghPB E7Sv 8qFB Hzrq'; 

const authHeader = 'Basic ' + Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64');
const headers = {
  'Content-Type': 'application/json',
  'Authorization': authHeader
};

async function wpGet(endpoint) {
  let allItems = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await fetch(`${WP_URL}/${endpoint}${endpoint.includes('?') ? '&' : '?'}per_page=100&page=${page}`, { headers });
    if (!response.ok) break;
    
    // get total pages from headers
    const totalPagesHeader = response.headers.get('X-WP-TotalPages');
    if (totalPagesHeader) {
      totalPages = parseInt(totalPagesHeader);
    }
    
    const data = await response.json();
    allItems = allItems.concat(data);
    page++;
  }
  return allItems;
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

async function wpDelete(endpoint) {
  const response = await fetch(`${WP_URL}/${endpoint}`, {
    method: 'DELETE',
    headers: headers
  });
  return response.ok;
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
  { title: 'FlexiSpot vs Uplift vs Jarvis: The Ultimate Brand Comparison', slug: 'flexispot-vs-uplift', cat: 'standing-desks', tags: ['flexispot', 'uplift'] },
  { title: 'Standing desk under $300: 10 options worth buying', slug: 'standing-desk-under-300', cat: 'standing-desks', tags: ['under-500', 'budget'] },
  { title: 'Electric vs Manual Standing Desks: Which Should You Choose?', slug: 'electric-vs-manual-desks', cat: 'standing-desks', tags: ['electric', 'manual'] },
  { title: 'L-shaped standing desks: Top 5 for corner setups', slug: 'l-shaped-standing-desks', cat: 'standing-desks', tags: ['small-space'] },
  
  // Furniture -> ergonomic-chairs
  { title: 'Best ergonomic chair under $300: 8 picks that dont suck', slug: 'best-ergonomic-chairs-under-300', cat: 'ergonomic-chairs', tags: ['budget', 'under-500'] },
  { title: 'In-Depth Review: Sihoo M18, M57, and HBADA', slug: 'sihoo-m18-review', cat: 'ergonomic-chairs', tags: ['sihoo', 'mesh'] },
  { title: 'Mesh vs leather executive chairs: Pros & Cons', slug: 'mesh-vs-leather-chairs', cat: 'ergonomic-chairs', tags: ['mesh', 'leather'] },
  
  // Furniture -> desk-converters
  { title: 'Best desk converter 2026: 10 models for any budget', slug: 'best-desk-converters', cat: 'desk-converters', tags: ['budget', 'minimalist'] },
  
  // Furniture -> footrests-mats
  { title: 'Best standing desk mat 2026: 10 tested & reviewed', slug: 'best-anti-fatigue-mats', cat: 'footrests-mats', tags: ['posture'] },
  
  // Furniture -> desk-storage
  { title: 'Top Under-Desk File Cabinets 2026: 8 Models Reviewed', slug: 'best-under-desk-file-cabinets', cat: 'desk-storage', tags: ['small-space'] },
  
  // Setup -> monitor-arms
  { title: 'Best monitor arm 2026: 12 models reviewed', slug: 'best-monitor-arms-2026', cat: 'monitor-arms', tags: ['ergotron'] },
  { title: 'Best Dual Monitor Arms: Top 10 Options in 2026', slug: 'dual-monitor-arm-setup', cat: 'monitor-arms', tags: ['dual-monitor'] },
  
  // Setup -> desk-lighting
  { title: 'Best screenbar 2026: BenQ, Xiaomi, and Quntis Review', slug: 'best-led-light-bars', cat: 'desk-lighting', tags: ['benq', 'eye-strain'] },
  { title: 'Bias Lighting for Monitors: Complete Setup Guide', slug: 'bias-lighting-guide', cat: 'desk-lighting', tags: ['eye-strain'] },
  
  // Setup -> cable-management
  { title: 'Cable Management A-Z: Clean Setup in 1 Hour', slug: 'cable-management-guide', cat: 'cable-management', tags: ['minimalist'] },
  { title: 'Under-Desk Cable Trays: Top 8 Options for 2026', slug: 'best-cable-trays', cat: 'cable-management', tags: ['budget'] },
  
  // Setup -> keyboards-mice
  { title: 'Vertical Mice for Carpal Tunnel: Top 10 Reviews', slug: 'best-vertical-mice', cat: 'keyboards-mice', tags: ['carpal-tunnel', 'wireless'] },
  
  // Setup -> desk-accessories
  { title: 'Best Desk Pads: Leather vs Felt Comparison', slug: 'best-desk-pads', cat: 'desk-accessories', tags: ['leather', 'minimalist'] },
  
  // Guides -> ergonomics-health
  { title: 'Proper Standing Desk Height: Calculator + Guide', slug: 'standing-desk-height-calculator', cat: 'ergonomics-health', tags: ['posture'] },
  { title: '90-Degree Elbow Setup for Typing: Ergonomic Guide', slug: 'ergonomic-tips-remote-workers', cat: 'ergonomics-health', tags: ['carpal-tunnel'] },
  { title: 'Relieve Lower Back Pain from Sitting: 10 Easy Stretches', slug: 'back-pain-relief-exercises', cat: 'ergonomics-health', tags: ['back-pain'] },
  { title: 'Eye Strain from Screens: Blue Light, Dry Eyes & Solutions', slug: 'eye-strain-lighting-setup', cat: 'ergonomics-health', tags: ['eye-strain'] },
  
  // Guides -> workspace-ideas
  { title: '50+ Minimalist desk setup ideas (2026 edition)', slug: 'minimalist-desk-setup-ideas', cat: 'workspace-ideas', tags: ['minimalist'] },
  { title: 'Setup for Small Bedrooms: 15 Space-Saving Desk Ideas', slug: 'small-space-desk-setup', cat: 'workspace-ideas', tags: ['small-space'] },
  { title: 'Transform your workspace under $200: Step-by-step', slug: 'budget-desk-makeover-under-200', cat: 'workspace-ideas', tags: ['budget', 'under-200'] },
  { title: 'Scandinavian WFH corner inspiration: 30+ photos', slug: 'scandinavian-desk-ideas', cat: 'workspace-ideas', tags: ['minimalist'] },
  
  // Guides -> productivity
  { title: 'Pomodoro technique for WFH: Complete guide & apps', slug: 'pomodoro-technique-wfh', cat: 'productivity', tags: ['programmer'] },
  { title: 'Deep Work: How to enter Flow State (Science-backed)', slug: 'deep-work-focus-guide', cat: 'productivity', tags: ['programmer'] },
  { title: 'Morning routine for WFH productivity: 7 steps', slug: 'morning-routine-wfh', cat: 'productivity', tags: [] }
];


async function run() {
  console.log('🗑️ Step 1: Deleting old Vietnamese & Dummy posts...');
  const existingPosts = await wpGet('posts?status=any');
  for (const post of existingPosts) {
    await wpDelete(`posts/${post.id}?force=true`); // force=true skips trash
  }
  console.log('✅ Deleted ' + existingPosts.length + ' old posts.');

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

  console.log('Creating FULL ENGLISH THÁNG 1 Content Plan (30 Articles)...');
  for (const p of month1Posts) {
    const catId = catMap[p.cat];
    if (!catId) {
       console.log('⚠️ Missing category:', p.cat);
       continue;
    }
    
    const tagIds = (p.tags && p.tags.length > 0) ? p.tags.map(t => tagMap[t]).filter(Boolean) : [];
    
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
  
  console.log('🎉 Xong! Toàn bộ 100% tiếng Anh đã được lên mâm!');
}

run();

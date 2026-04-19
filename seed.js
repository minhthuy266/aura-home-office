// seed.js
const WP_URL = 'https://cms.aurahomeoffice.com/wp-json/wp/v2';
const WP_USER = 'admin'; 
const WP_APP_PASS = 'i56Q kTjc ghPB E7Sv 8qFB Hzrq'; 

const authHeader = 'Basic ' + Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64');
const headers = {
  'Content-Type': 'application/json',
  'Authorization': authHeader
};

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
        // CATCH TERM EXISTS ERROR: If category exist, it returns the existing ID here
        return { id: result.data.term_id }; 
      }
      console.error(`❌ Lỗi khi tạo ${data.name || endpoint}:`, result.message);
      return null;
    }
    return result;
  } catch (error) {
    console.error(`❌ Fetch error (${endpoint}):`, error);
    return null;
  }
}

const structure = [
  {
    name: 'Furniture',
    slug: 'furniture',
    children: [
      { name: 'Standing Desks', slug: 'standing-desks' },
      { name: 'Ergonomic Chairs', slug: 'ergonomic-chairs' },
      { name: 'Desk Converters', slug: 'desk-converters' },
      { name: 'Desk Storage', slug: 'desk-storage' },
      { name: 'Footrests & Mats', slug: 'footrests-mats' }
    ]
  },
  {
    name: 'Setup',
    slug: 'setup',
    children: [
      { name: 'Monitor Arms', slug: 'monitor-arms' },
      { name: 'Desk Lighting', slug: 'desk-lighting' },
      { name: 'Cable Management', slug: 'cable-management' },
      { name: 'Keyboards & Mice', slug: 'keyboards-mice' },
      { name: 'Desk Accessories', slug: 'desk-accessories' }
    ]
  },
  {
    name: 'Guides',
    slug: 'guides',
    children: [
      { name: 'Ergonomics & Health', slug: 'ergonomics-health' },
      { name: 'Workspace Ideas', slug: 'workspace-ideas' },
      { name: 'Productivity', slug: 'productivity' }
    ]
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle', // Bạn nhớ configure KHÔNG show cái này lên Main Menu
    children: [
      { name: 'Active Working', slug: 'active-working' },
      { name: 'Coffee Corner', slug: 'coffee-corner' },
      { name: 'Ambient Comfort', slug: 'ambient-comfort' }
    ]
  }
];

const sampleTitles = [
    "Ultimate Guide 2024",
    "Best Picks for Your Home Office",
    "How to Choose the Right Setup",
    "Top Rated Selection"
];

async function seedData() {
  console.log('🚀 Bắt đầu build Sitemap cho Aura Home Office...');

  for (const parent of structure) {
    // CREATE PARENT
    const parentRes = await wpPost('categories', { name: parent.name, slug: parent.slug });
    
    if (parentRes && parentRes.id) {
        console.log(`📦 Đã xử lý Parent: ${parent.name}`);
        
        // CREATE CHILDREN
        for (const child of parent.children) {
            const childRes = await wpPost('categories', { 
                name: child.name, 
                slug: child.slug, 
                parent: parentRes.id 
            });
            if (childRes && childRes.id) {
                console.log(`   ↳ Đã xử lý Child: ${child.name}`);
                
                // CREATE A DUMMY POST FOR EACH CHILD CATEGORY
                const randomTopic = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
                const postTitle = `${child.name} - ${randomTopic}`;
                await wpPost('posts', {
                    title: postTitle,
                    content: `<!-- wp:paragraph --><p>This is a sample layout for <strong>${child.name}</strong>. Keeping a great workflow and staying focused.</p><!-- /wp:paragraph -->`,
                    categories: [childRes.id],
                    status: 'publish'
                });
            }
        }
    }
  }

  console.log('🎉 Xong! Toàn bộ Sitemap đã được khởi tạo trên WordPress.');
}

seedData();

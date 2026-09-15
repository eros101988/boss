import fs from 'fs';

// Read delta.json
const delta = JSON.parse(fs.readFileSync('c:/Users/eros/Desktop/佑安企業_新增產品_B02/佑安企業_新增產品_B02/delta.json', 'utf-8'));

const rawData = JSON.parse(fs.readFileSync('./public/assets/圖片索引.json', 'utf-8'));
const categoryData = JSON.parse(fs.readFileSync('./public/assets/類目封面對照.json', 'utf-8'));

const categories = [];

// build categories
categoryData.forEach(cat => {
  if (cat.category === '90_企業與授權資料') return; // skip
  categories.push({
    id: cat.category,
    name: cat.category.split('_')[1] || cat.category,
    cover: `/assets/${cat.cover}`,
    subcategories: cat.subcategories.map(sub => ({
      id: sub.name,
      name: sub.name.split('_')[1] || sub.name,
      cover: `/assets/${sub.cover}`
    }))
  });
});

// Update categories with delta subcategories if they don't exist
delta.products.forEach(p => {
  const cat = categories.find(c => c.id === p.category);
  if (cat) {
    if (!cat.subcategories.find(sub => sub.id === p.subcategory)) {
      cat.subcategories.push({
        id: p.subcategory,
        name: p.subcategory.split('_')[1] || p.subcategory,
        cover: `/assets/${p.cover}`
      });
    }
  }
});

// Rename categories according to spec
categories.forEach(cat => {
  if (cat.id === '03_夾鏈袋') {
    cat.name = '夾鏈袋／密實袋／冷凍袋';
  }
});

// Function to clean product names
function cleanProductName(category, subcategory, productGroup) {
  let displayName = productGroup;
  
  if (category === '01_清潔袋') {
    if (subcategory === '01_一般捲取式') {
      const parts = productGroup.split('_');
      displayName = `台塑清潔袋｜${parts[0]}型 ${parts[1] || ''}`.trim();
    } else if (subcategory === '02_拉繩式') {
      const parts = productGroup.split('_');
      displayName = `台塑拉繩清潔袋｜${parts[0]}型 ${parts[1] || ''}`.trim();
    } else if (subcategory === '03_抽取式與業務用') {
      const parts = productGroup.split('_');
      displayName = `台塑清潔袋(抽取/業務用)｜${parts[0]} ${parts[1] || ''}`.trim();
    } else if (subcategory === '04_醫療感染性廢棄物袋') {
      displayName = `醫療感染性廢棄物袋`;
    }
  } else if (category === '02_食品保鮮耐熱袋') {
    const parts = productGroup.split('_');
    displayName = `台塑保鮮耐熱袋｜${parts[0]} ${parts[1] || ''}`.trim();
  } else if (category === '03_夾鏈袋') {
    if (subcategory === '01_台塑LDPE夾鏈袋') {
      const parts = productGroup.split('_');
      let num = parts[0].replace('號', '').replace('特小', '');
      displayName = `台塑夾鏈袋｜${num}號`;
    }
  } else if (category === '04_病媒防治') {
    const parts = productGroup.split('_');
    displayName = parts[0];
  }
  
  return displayName;
}

// Extract specs from raw text for old products
function parseOldSpecs(productGroup) {
  const parts = productGroup.split('_');
  if (parts.length > 1) {
    return {
      size_or_type: parts[0],
      capacity_or_dim: parts[1] || '',
      quantity: parts[2] || ''
    };
  }
  return null;
}


// build products
const groupMap = new Map();

rawData.forEach(item => {
  if (item.category === '90_企業與授權資料' || item.subcategory === '00_系列總覽' || item.subcategory === '00_蟑螂知識素材') return;
  if (item.status === '待確認') return; // skip unconfirmed

  const groupId = `${item.category}-${item.subcategory}-${item.product_group}`;
  if (!groupMap.has(groupId)) {
    groupMap.set(groupId, {
      id: groupId,
      categoryId: item.category,
      subcategoryId: item.subcategory,
      name: cleanProductName(item.category, item.subcategory, item.product_group),
      originalName: item.product_group,
      images: [],
      specs: [],
      shared_images: [],
      parsedSpec: parseOldSpecs(item.product_group)
    });
  }

  const group = groupMap.get(groupId);
  group.images.push({
    role: item.role,
    path: `/assets/${item.path}`,
    note: item.note,
    order: 0
  });
  
  // Sort images: front packaging first, specs last
  group.images.sort((a, b) => {
    const aRole = a.role || '';
    const bRole = b.role || '';
    
    if (aRole.includes('正面') || aRole.includes('主圖')) return -1;
    if (bRole.includes('正面') || bRole.includes('主圖')) return 1;
    
    if (aRole.includes('規格圖')) return 1;
    if (bRole.includes('規格圖')) return -1;
    
    return 0;
  });
});

delta.products.forEach(p => {
  if (!groupMap.has(p.id)) {
    groupMap.set(p.id, {
      id: p.id,
      categoryId: p.category,
      subcategoryId: p.subcategory,
      name: p.name,
      originalName: p.name,
      images: [],
      specs: p.variants.map(v => ({
        id: v.id,
        size: v.size,
        label: v.label,
        dimensions: v.dimensions_cm,
        sheets_per_box: v.sheets_per_box,
        barcode: v.barcode,
        images: v.images.map(img => ({
          role: img.role,
          path: `/assets/${img.path}`,
          order: img.order
        }))
      })),
      shared_images: p.shared_images.map(img => ({
        role: img.role,
        path: `/assets/${img.path}`,
        order: img.order
      })),
      parsedSpec: null
    });
  }
});

const productsList = Array.from(groupMap.values());

const storeCode = `
export const categories = ${JSON.stringify(categories, null, 2)};
export const products = ${JSON.stringify(productsList, null, 2)};
`;

fs.writeFileSync('./src/data/store.ts', storeCode);
console.log('store.ts updated with refactored names and delta');

import fs from 'fs';

// Read delta.json
const delta = JSON.parse(fs.readFileSync('c:/Users/eros/Desktop/佑安企業_新增產品_B02/佑安企業_新增產品_B02/delta.json', 'utf-8'));

// Read current store.ts
// Wait, to parse store.ts, maybe we can just require the js?
// Since it's TS, it's easier to just read the JSON from generateStore again, then modify it, and write it out.
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
      name: item.product_group,
      images: [],
      specs: [],
      shared_images: []
    });
  }

  const group = groupMap.get(groupId);
  group.images.push({
    role: item.role,
    path: `/assets/${item.path}`,
    note: item.note,
    order: 0
  });
});

delta.products.forEach(p => {
  if (!groupMap.has(p.id)) {
    groupMap.set(p.id, {
      id: p.id,
      categoryId: p.category,
      subcategoryId: p.subcategory,
      name: p.name,
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
      }))
    });
  }
});

const productsList = Array.from(groupMap.values());

const storeCode = `
export const categories = ${JSON.stringify(categories, null, 2)};
export const products = ${JSON.stringify(productsList, null, 2)};
`;

fs.writeFileSync('./src/data/store.ts', storeCode);
console.log('store.ts updated with delta');

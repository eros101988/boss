import fs from 'fs';
import path from 'path';

const rawData = JSON.parse(fs.readFileSync('./public/assets/圖片索引.json', 'utf-8'));
const categoryData = JSON.parse(fs.readFileSync('./public/assets/類目封面對照.json', 'utf-8'));

const products = [];
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
      specs: []
    });
  }

  const group = groupMap.get(groupId);
  group.images.push({
    role: item.role,
    path: `/assets/${item.path}`,
    note: item.note
  });
});

const productsList = Array.from(groupMap.values());

const storeCode = `
export const categories = ${JSON.stringify(categories, null, 2)};
export const products = ${JSON.stringify(productsList, null, 2)};
`;

fs.writeFileSync('./src/data/store.ts', storeCode);
console.log('store.ts generated');

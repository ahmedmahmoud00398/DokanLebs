export const initialProducts = [
  { id: 'PRD-1024', name: 'Classic Denim Jacket', category: 'Outerwear', price: 950, stock: 24, status: 'Active', image: '/Rectangle 7.png' },
  { id: 'PRD-1023', name: 'Oversized Cotton Tee', category: 'Tops', price: 450, stock: 8, status: 'Low stock', image: '/e9b39c94-37ce-4bee-a1db-30924d5bfed3.jpeg' },
  { id: 'PRD-1022', name: 'Linen Summer Shirt', category: 'Tops', price: 720, stock: 0, status: 'Out of stock', image: '/Rectangle 9.png' },
  { id: 'PRD-1021', name: 'Knitted Cardigan', category: 'Knitwear', price: 790, stock: 14, status: 'Active', image: '/home-card-images/category-top.png' },
  { id: 'PRD-1020', name: 'Relaxed Fit Trousers', category: 'Bottoms', price: 680, stock: 31, status: 'Active', image: '/home-card-images/category-bottoms.png' },
  { id: 'PRD-1019', name: 'Leather Crossbody Bag', category: 'Accessories', price: 1200, stock: 5, status: 'Low stock', image: '/home-card-images/category-accessories.png' },
];

export const customers = [
  { id: 'CUS-2048', name: 'Mariam Adel', email: 'mariam.adel@email.com', orders: 14, spent: 6420, lastActive: 'Today', status: 'Returning' },
  { id: 'CUS-2047', name: 'Karim Saeed', email: 'karim.s@email.com', orders: 8, spent: 4390, lastActive: 'Yesterday', status: 'Returning' },
  { id: 'CUS-2046', name: 'Yara Hassan', email: 'yara.h@email.com', orders: 3, spent: 2180, lastActive: 'Oct 18, 2026', status: 'New' },
  { id: 'CUS-2045', name: 'Nour Fathy', email: 'nour.fathy@email.com', orders: 6, spent: 3270, lastActive: 'Oct 17, 2026', status: 'Returning' },
  { id: 'CUS-2044', name: 'Omar Khaled', email: 'omar.k@email.com', orders: 1, spent: 950, lastActive: 'Oct 16, 2026', status: 'New' },
];

export const orders = [
  { id: 'ORD-3389', customer: 'Mariam Adel', date: 'Oct 21, 2026', items: 3, total: 3185, status: 'Processing', carrier: 'Bosta', tracking: 'BOS-938401', address: '12 El Horreya Road, Alexandria' },
  { id: 'ORD-3388', customer: 'Karim Saeed', date: 'Oct 21, 2026', items: 2, total: 1640, status: 'Shipped', carrier: 'Aramex', tracking: 'ARX-204811', address: '18 Road 9, Maadi, Cairo' },
  { id: 'ORD-3387', customer: 'Yara Hassan', date: 'Oct 20, 2026', items: 1, total: 950, status: 'Delivered', carrier: 'Bosta', tracking: 'BOS-938277', address: '5 Tahrir Square, Giza' },
  { id: 'ORD-3386', customer: 'Nour Fathy', date: 'Oct 19, 2026', items: 4, total: 2760, status: 'Pending', carrier: 'Mylerz', tracking: 'MYL-771025', address: '22 El Nasr Street, Cairo' },
];

export const transactions = [
  { id: 'TXN-10425', date: 'Oct 21, 2026', customer: 'Mariam Adel', method: 'Card', amount: 3185, status: 'Paid' },
  { id: 'TXN-10424', date: 'Oct 21, 2026', customer: 'Karim Saeed', method: 'Cash on delivery', amount: 1640, status: 'Pending' },
  { id: 'TXN-10423', date: 'Oct 20, 2026', customer: 'Yara Hassan', method: 'Card', amount: 950, status: 'Paid' },
  { id: 'TXN-10422', date: 'Oct 19, 2026', customer: 'Nour Fathy', method: 'Wallet', amount: 2760, status: 'Refunded' },
];

export const formatMoney = (value) => `EGP ${Number(value || 0).toLocaleString('en-US')}`;

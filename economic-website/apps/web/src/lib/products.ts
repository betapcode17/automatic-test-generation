export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug?: string;
  price: number;
  salePrice?: number;
  rating: number;
  stock: number;
  image: string;
  badge?: string;
  description: string;
};

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Tai nghe chống ồn AirBeat Pro',
    slug: 'tai-nghe-airbeat-pro',
    category: 'Điện tử',
    price: 2490000,
    salePrice: 1890000,
    rating: 4.8,
    stock: 128,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    badge: 'Flash Sale',
    description: 'Âm thanh giàu chi tiết, chống ồn chủ động và pin dùng cả ngày cho công việc lẫn giải trí.'
  },
  {
    id: 'p2',
    name: 'Bàn phím cơ NovaKeys M75',
    slug: 'ban-phim-co-novakeys-m75',
    category: 'Phụ kiện',
    price: 1790000,
    salePrice: 1490000,
    rating: 4.7,
    stock: 76,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
    badge: 'Best Seller',
    description: 'Layout 75%, switch êm, keycap PBT và đèn nền tinh tế cho góc làm việc hiện đại.'
  },
  {
    id: 'p3',
    name: 'Đồng hồ thông minh Pulse S',
    slug: 'dong-ho-pulse-s',
    category: 'Wearable',
    price: 3290000,
    salePrice: 2790000,
    rating: 4.9,
    stock: 54,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    badge: 'New',
    description: 'Theo dõi sức khỏe, luyện tập, thông báo và thanh toán nhanh trong một thiết kế tối giản.'
  },
  {
    id: 'p4',
    name: 'Máy ảnh mini VlogCam 4K',
    slug: 'may-anh-vlogcam-4k',
    category: 'Camera',
    price: 5290000,
    rating: 4.6,
    stock: 31,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    description: 'Ghi hình 4K, chống rung tốt và micro rõ tiếng cho creator cần thiết bị nhỏ gọn.'
  }
];

export const categories = ['Tất cả', 'Điện tử', 'Phụ kiện', 'Wearable', 'Camera'];

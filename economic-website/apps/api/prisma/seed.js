const { PrismaClient, RoleName } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const categories = [
  { name: 'Dien tu', slug: 'dien-tu', description: 'Thiet bi dien tu va am thanh' },
  { name: 'Phu kien', slug: 'phu-kien', description: 'Phu kien lam viec va giai tri' },
  { name: 'Wearable', slug: 'wearable', description: 'Thiet bi deo thong minh' },
  { name: 'Camera', slug: 'camera', description: 'May anh va thiet bi sang tao noi dung' }
];

const products = [
  {
    name: 'Tai nghe AirBeat Pro',
    slug: 'tai-nghe-airbeat-pro',
    categorySlug: 'dien-tu',
    price: 2490000,
    salePrice: 1890000,
    sku: 'AIRBEAT-PRO',
    stock: 128,
    rating: 4.8,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    description: 'Am thanh giau chi tiet, chong on chu dong va pin dung ca ngay cho cong viec lan giai tri.'
  },
  {
    name: 'Ban phim co NovaKeys M75',
    slug: 'ban-phim-co-novakeys-m75',
    categorySlug: 'phu-kien',
    price: 1790000,
    salePrice: 1490000,
    sku: 'NOVKEY-M75',
    stock: 76,
    rating: 4.7,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
    description: 'Layout 75%, switch em, keycap PBT va den nen tinh te cho goc lam viec hien dai.'
  },
  {
    name: 'Dong ho thong minh Pulse S',
    slug: 'dong-ho-pulse-s',
    categorySlug: 'wearable',
    price: 3290000,
    salePrice: 2790000,
    sku: 'PULSE-S',
    stock: 54,
    rating: 4.9,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    description: 'Theo doi suc khoe, luyen tap, thong bao va thanh toan nhanh trong mot thiet ke toi gian.'
  },
  {
    name: 'May anh mini VlogCam 4K',
    slug: 'may-anh-vlogcam-4k',
    categorySlug: 'camera',
    price: 5290000,
    sku: 'VLOGCAM-4K',
    stock: 31,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    description: 'Ghi hinh 4K, chong rung tot va micro ro tieng cho creator can thiet bi nho gon.'
  }
];

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: RoleName.ADMIN },
    update: {},
    create: { name: RoleName.ADMIN }
  });
  await prisma.role.upsert({
    where: { name: RoleName.CUSTOMER },
    update: {},
    create: { name: RoleName.CUSTOMER }
  });
  await prisma.role.upsert({
    where: { name: RoleName.MANAGER },
    update: {},
    create: { name: RoleName.MANAGER }
  });

  await prisma.user.upsert({
    where: { email: 'admin@economic.local' },
    update: {},
    create: {
      email: 'admin@economic.local',
      fullName: 'Economic Admin',
      passwordHash: await bcrypt.hash('Admin123!', 10),
      roleId: adminRole.id,
      cart: { create: {} }
    }
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: product.categorySlug } });
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice,
        stock: product.stock,
        rating: product.rating,
        isFeatured: product.isFeatured ?? false,
        categoryId: category.id,
        images: {
          deleteMany: {},
          create: [{ url: product.image, alt: product.name, position: 0 }]
        }
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice,
        sku: product.sku,
        stock: product.stock,
        rating: product.rating,
        isFeatured: product.isFeatured ?? false,
        categoryId: category.id,
        images: { create: [{ url: product.image, alt: product.name, position: 0 }] }
      }
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

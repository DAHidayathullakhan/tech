const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const Ticket = require('./models/Ticket');
const Category = require('./models/Category');
const KnowledgeArticle = require('./models/KnowledgeArticle');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🍃 Connected to MongoDB Atlas for seeding...');

    // Clear existing sample data
    await User.deleteMany();
    await Ticket.deleteMany();
    await Category.deleteMany();
    await KnowledgeArticle.deleteMany();

    // Create Admin User
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@techservepro.com',
      password: 'AdminPassword123!',
      role: 'admin',
      organization: 'TechServe HQ',
      phone: '+1 (800) 555-TECH',
    });

    // Create Support Staff User
    const techUser = await User.create({
      name: 'Robert Martinez',
      email: 'robert@techservepro.com',
      password: 'TechPassword123!',
      role: 'support_staff',
      organization: 'IT Hardware Dept',
      phone: '+1 (800) 555-0192',
    });

    // Create Sample Categories
    const categories = await Category.insertMany([
      { name: 'Laptop & Mac Repair', slug: 'laptop-repair', description: 'Motherboard, display, liquid damage' },
      { name: 'Computer & Server Maintenance', slug: 'pc-server', description: 'Custom PC, server rack maintenance' },
      { name: 'AC & HVAC Cooling', slug: 'ac-hvac', description: 'Gas refill, jet clean, compressor' },
      { name: 'CCTV & Network Security', slug: 'cctv-network', description: 'IP camera, NVR cloud, Wi-Fi 6' },
      { name: 'College Lab AMC', slug: 'college-amc', description: 'Multi-OS imaging, structured cabling' },
    ]);

    // Create Sample Ticket
    await Ticket.create({
      ticketId: 'TECH-8842',
      title: 'Laptop Motherboard Repair & Thermal Paste Replacement',
      description: 'Power IC failure after liquid damage. Thermal stress test pending.',
      category: 'Laptop Repair & Diagnostics',
      priority: 'High',
      status: 'In Progress',
      user: adminUser._id,
      assignedTo: techUser._id,
      assignedTechName: 'Robert Martinez (Senior Engineer)',
      locationAddress: 'Silicon Tech Park, Suite 800',
      contactPhone: '+1 (555) 019-2831',
      history: [
        { status: 'Open', updatedBy: 'System Admin', notes: 'Ticket registered' },
        { status: 'In Progress', updatedBy: 'Robert Martinez', notes: 'Power IC replaced' },
      ],
    });

    // Create Sample Knowledge Base Article
    await KnowledgeArticle.create({
      title: 'How to Prevent Laptop Overheating and Extend Battery Life',
      slug: 'how-to-prevent-laptop-overheating',
      content: 'Regular fan dusting and annual thermal paste replacement can reduce CPU temperatures by up to 25 degrees C...',
      categoryName: 'Laptop & Mac Repair',
      author: adminUser._id,
      tags: ['laptop', 'overheating', 'battery', 'maintenance'],
    });

    console.log('✅ Sample data seeded successfully into MongoDB Atlas!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedData();

// models.js
const mongoose = require('mongoose');

// 1. PACKAGES SCHEMA
const PackageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    tagline: { type: String },
    theoryLessons: { type: Number },
    practicalLessons: { type: Number },
    durationDays: { type: Number, default: 30 },
    hoursPerDay: { type: Number, default: 1 },
    carType: { type: String, default: 'Basic Model' },
    freePickup: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false }
});

// 2. COURSES SCHEMA
const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    theoryHours: { type: Number },
    practicalHours: { type: Number },
    image: { type: String, default: 'src/images/6.jpg' },
    note: { type: String }
});

// 3. BOOKINGS SCHEMA
const BookingSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    studentPhone: { type: String, required: true },
    itemType: { type: String, required: true }, 
    itemName: { type: String, required: true }, 
    itemPrice: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' }
});

// 4. BLOGS SCHEMA
const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Isaac Herman' },
    date: { type: Date, default: Date.now },
    commentsCount: { type: Number, default: 0 },
    image: { type: String, default: 'src/images/blog1.jpg' },
    category: { type: String, default: 'Driving Course' },
    tags: [{ type: String }]
});

// 5. PAGE SETTINGS SCHEMA
const PageSettingsSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    tuitionCost: Number,
    theoryHours: Number,
    behindWheelHours: Number,
    courseLengthDays: Number,
    instructorName: String
}, { collection: 'page_settings' });

const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    category: String,
    instructor: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
const PageSetting = mongoose.models.PageSetting || mongoose.model('PageSetting', PageSettingsSchema);

// The CORRECT way to define the model
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

module.exports = { Package, Course, Booking, Blog, PageSetting, Contact };
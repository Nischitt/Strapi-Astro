// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Package, Course, Booking, Blog, PageSetting, Contact} = require('./models');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Range', 'X-Total-Count'],
    exposedHeaders: ['Content-Range', 'X-Total-Count'] 
}));
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/udrive')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// =================================================================
// SPECIAL: PAGE SETTINGS ENDPOINTS
// =================================================================
app.get('/api/page-settings/standard-course/:id', async (req, res) => {
    try {
        let settings = await PageSetting.findById(req.params.id);
        if (!settings) {
            settings = new PageSetting({
                _id: req.params.id,
                tuitionCost: 64.00,
                theoryHours: 4,
                behindWheelHours: 18,
                courseLengthDays: 30,
                instructorName: "Isaac Herman"
            });
            await settings.save();
        }
        res.json({ id: settings._id.toString(), ...settings.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/page-settings/standard-course/:id', async (req, res) => {
    try {
        const updatedSettings = await PageSetting.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        if (!updatedSettings) return res.status(404).json({ error: "Configuration not found." });
        res.json({ id: updatedSettings._id.toString(), ...updatedSettings.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =================================================================
// PACKAGES ENDPOINTS
// =================================================================
app.get('/api/packages', async (req, res) => {
    try {
        const packages = await Package.find();
        const mappedPackages = packages.map(pkg => ({ id: pkg._id.toString(), ...pkg.toObject() }));
        res.setHeader('Content-Range', `packages 0-${packages.length}/${packages.length}`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.json(mappedPackages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/packages/:id', async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) return res.status(404).json({ error: "Package not found" });
        res.json({ id: pkg._id.toString(), ...pkg.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/packages', async (req, res) => {
    try {
        const newPkg = new Package(req.body);
        await newPkg.save();
        res.status(201).json({ id: newPkg._id.toString(), ...newPkg.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/packages/:id', async (req, res) => {
    try {
        const updatedPkg = await Package.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        if (!updatedPkg) return res.status(404).json({ error: "Package not found to update" });
        res.json({ id: updatedPkg._id.toString(), ...updatedPkg.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/packages/:id', async (req, res) => {
    try {
        const deletedPkg = await Package.findByIdAndDelete(req.params.id);
        if (!deletedPkg) return res.status(404).json({ error: "Package not found to delete" });
        res.json({ id: deletedPkg._id.toString(), ...deletedPkg.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =================================================================
// BOOKINGS ENDPOINTS
// =================================================================
app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ message: "Booking recorded!", booking: newBooking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ bookingDate: -1 });
        const mappedBookings = bookings.map(b => ({ id: b._id.toString(), ...b.toObject() }));
        res.setHeader('Content-Range', `bookings 0-${bookings.length}/${bookings.length}`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.json(mappedBookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/bookings/:id', async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        if (!deletedBooking) return res.status(404).json({ error: "Booking not found" });
        res.json({ id: deletedBooking._id.toString(), ...deletedBooking.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// COURSES ENDPOINTS
// ==========================================
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        const mappedCourses = courses.map(c => ({ id: c._id.toString(), ...c.toObject() }));
        res.setHeader('Content-Range', `courses 0-${courses.length}/${courses.length}`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.json(mappedCourses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: "Course not found" });
        res.json({ id: course._id.toString(), ...course.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/courses', async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json({ id: newCourse._id.toString(), ...newCourse.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/courses/:id', async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        if (!updatedCourse) return res.status(404).json({ error: "Course not found to update" });
        res.json({ id: updatedCourse._id.toString(), ...updatedCourse.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/courses/:id', async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) return res.status(404).json({ error: "Course not found to delete" });
        res.json({ id: deletedCourse._id.toString(), ...deletedCourse.toObject() }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// BLOGS ENDPOINTS 
// ==========================================
app.get('/api/blogs', async (req, res) => {
    try {
        const total = await Blog.countDocuments();
        const start = parseInt(req.query._start) || 0;
        const end = parseInt(req.query._end) || 10;
        const limit = end - start;

        const blogs = await Blog.find().skip(start).limit(limit);
        
        // Map to ensure 'id' is present for React-Admin
        const mapped = blogs.map(b => ({ id: b._id.toString(), ...b.toObject() }));

        // Handle the case where no blogs exist
        const rangeEnd = blogs.length > 0 ? (start + blogs.length - 1) : 0;
        
        // Expose the header so React-Admin can see it
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Content-Range', `blogs ${start}-${rangeEnd}/${total}`);
        
        res.json(mapped);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/blogs', async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        const savedBlog = await newBlog.save();
        
        // Ensure the ID is explicitly mapped to 'id'
        res.status(201).json({ id: savedBlog._id.toString(), ...savedBlog.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/blogs/:id', async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        if (!updatedBlog) return res.status(404).json({ error: "Blog post not found to update" });
        res.json({ id: updatedBlog._id.toString(), ...updatedBlog.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/blogs/:id', async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) return res.status(404).json({ error: "Blog post not found to delete" });
        res.json({ id: deletedBlog._id.toString(), ...deletedBlog.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/contacts', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(201).json({ message: "Enquiry sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin Panel View
app.get('/api/contacts', async (req, res) => {
    try {
        const { start, limit } = getPagination(req);
        
        const total = await Contact.countDocuments();
        const contacts = await Contact.find()
            .sort({ date: -1 })
            .skip(start)
            .limit(limit);

        const mapped = contacts.map(c => ({ id: c._id.toString(), ...c.toObject() }));
        
        // React-Admin REQUIRE these headers
        res.setHeader('Content-Range', `contacts ${start}-${start + contacts.length}/${total}`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.json(mapped);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const getPagination = (req) => {
    const start = parseInt(req.query._start) || 0;
    const end = parseInt(req.query._end) || 10;
    const limit = end - start;
    return { start, limit };
};
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend API running on port ${PORT}`));
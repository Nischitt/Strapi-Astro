// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Package, Course, Booking, Blog, Contact, User, Team, Slot, PageSetting, Review, Settings} = require('./models');
const PDFDocument = require('pdfkit');

const JWT_SECRET = 'uDrive_Secret_Token_Key_123';

const app = express();
app.use(express.json());



app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Range', 'X-Total-Count'],
    exposedHeaders: ['Content-Range', 'X-Total-Count'] 
}));
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/udrive')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));


// (removed duplicate early signup route)

// Admin-Only Route to view users
app.get('/api/users', async (req, res) => {
    // Add logic here to verify JWT and check if role === 'admin'
    const users = await User.find();
    const mapped = users.map(u => ({ id: u._id.toString(), email: u.email, role: u.role }));
    res.setHeader('Content-Range', `users 0-${mapped.length}/${mapped.length}`);
    res.json(mapped);
});


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
// server.js - Use this single, consolidated route
app.get('/api/bookings/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        
        // Return the object with the required 'id' field for React-Admin
        res.json({ id: booking._id.toString(), ...booking.toObject() });
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

app.post('/api/slots/generate', async (req, res) => {
    // TODO: implement calendar generation
    res.json({ message: "Calendar populated!" });
});

app.put('/api/slots/:slotId/book', async (req, res) => {
    const { bookingId, studentEmail } = req.body;

    // 1. Check if booking exists and has sessions
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.remainingSessions <= 0) {
        return res.status(400).json({ error: "No sessions remaining." });
    }

    // 2. Atomic Update: Find slot and book only if not already booked
    const slot = await Slot.findOneAndUpdate(
        { _id: req.params.slotId, isBooked: false },
        { $set: { isBooked: true, studentEmail, bookingId } },
        { new: true }
    );

    if (!slot) return res.status(400).json({ error: "Slot already taken." });

    // 3. Decrement sessions in the booking
    booking.remainingSessions -= 1;
    await booking.save();

    res.json({ success: true });
});

// server.js
app.put('/api/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Update the booking in MongoDB
        const updatedBooking = await Booking.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true } // This returns the updated document
        );
        
        if (!updatedBooking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Return the updated object with the "id" field React-Admin expects
        res.json({ id: updatedBooking._id.toString(), ...updatedBooking.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Route to update payment status after a successful simulated transaction
app.put('/api/bookings/:id/pay', async (req, res) => {
    try {
        const { transactionId } = req.body;
        const bookingId = req.params.id;

        // SAFE GUARD: Check if the ID is a valid MongoDB ObjectId to prevent 500 CastError crashes
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            console.log(`[Simulation] Handling mock/temporary timestamp ID: ${bookingId}`);
            return res.status(200).json({ 
                message: "Simulated payment verified successfully for mock record",
                updatedBooking: { 
                    _id: bookingId, 
                    paymentStatus: 'Paid', 
                    status: 'Approved', 
                    transactionId 
                }
            });
        }

        // If it IS a valid MongoDB ObjectId, proceed with the actual database transaction
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { paymentStatus: 'Paid', status: 'Approved', transactionId },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking record not found in database" });
        }

        return res.status(200).json({ message: "Payment verified successfully", updatedBooking });
    } catch (error) {
        console.error("Backend payment processing error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
//pdf
app.get('/api/bookings/:id/certificate', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ error: "Booking record not found." });
        }

        // Optional Safety Check: Ensure they have actually completed or paid
        // if (booking.status !== 'Approved' || booking.remainingSessions > 0) {
        //     return res.status(400).json({ error: "Course conditions not met yet." });
        // }

        // 1. Create a new PDF document in Landscape orientation
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4'
        });

        // 2. Set headers so the browser triggers a download prompt
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Certificate_${booking.studentName.replace(/\s+/g, '_')}.pdf`);

        // 3. Pipe the PDF structure directly into the express response stream
        doc.pipe(res);

        // --- DRAWING THE CERTIFICATE ---
        
        // Draw a styling background border
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
           .lineWidth(4)
           .stroke('#f59e0b'); // Matches your gold primary theme color!

        doc.rect(28, 28, doc.page.width - 56, doc.page.height - 56)
           .lineWidth(1)
           .stroke('#111827');

        // Main Title Header
        doc.moveDown(4);
        doc.fillColor('#111827')
           .fontSize(40)
           .font('Helvetica-Bold')
           .text('CERTIFICATE OF COMPLETION', { align: 'center' });

        doc.moveDown(1);
        doc.fontSize(16)
           .font('Helvetica')
           .fillColor('#4b5563')
           .text('This is proudly presented to', { align: 'center' });

        // Student's Name
        doc.moveDown(1);
        doc.fontSize(28)
           .font('Helvetica-Bold')
           .fillColor('#f59e0b')
           .text(booking.studentName.toUpperCase(), { align: 'center' });

        // Description Body text
        doc.moveDown(1.5);
        doc.fontSize(16)
           .font('Helvetica')
           .fillColor('#4b5563')
           .text(`For successfully completing all instructional operations, practical frameworks,`, { align: 'center' });
        
        doc.moveDown(0.5);
        doc.text(`and regulations required under the training program for:`, { align: 'center' });

        // Course/Item Name
        doc.moveDown(1);
        doc.fontSize(22)
           .font('Helvetica-Bold')
           .fillColor('#111827')
           .text(`"${booking.itemName}"`, { align: 'center' });

        // Footer Date & Mock Signature line
        doc.moveDown(3);
        
        // Date (Left Side)
        doc.fontSize(12).font('Helvetica').text(`Date: ${new Date().toLocaleDateString()}`, 100, doc.y, { lineBreak: false });
        
        // Signature Line (Right Side)
        doc.text('Authorized Signature: ____________________', doc.page.width - doc.x - 200, doc.y, { align: 'right' });

        // 4. Finalize the stream writing operation
        doc.end();

    } catch (error) {
        console.error("Certificate error:", error);
        res.status(500).json({ error: "Failed to generate certificate file." });
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

app.get('/api/reviews', async (req, res) => {
    try {
        const total = await Review.countDocuments();
        const start = parseInt(req.query._start) || 0;
        const end = parseInt(req.query._end) || 10;
        const limit = end - start;

        // Base query: if an explicit public flag is handled, we could filter, 
        // but let's fetch everything for the admin panel
        const reviews = await Review.find().sort({ createdAt: -1 }).skip(start).limit(limit);
        const mapped = reviews.map(r => ({ id: r._id.toString(), ...r.toObject() }));
        
        const rangeEnd = reviews.length > 0 ? (start + reviews.length - 1) : 0;

        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.setHeader('Content-Range', `reviews ${start}-${rangeEnd}/${total}`);
        res.json(mapped);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// React-Admin target GET single review
app.get('/api/reviews/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ error: "Review not found" });
        res.json({ id: review._id.toString(), ...review.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUBLIC & ADMIN POST: To submit new reviews
app.post('/api/reviews', async (req, res) => {
    try {
        const newReview = new Review(req.body);
        const savedReview = await newReview.save();
        res.status(201).json({ id: savedReview._id.toString(), ...savedReview.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADMIN PUT: Toggle approval status or edit contents
app.put('/api/reviews/:id', async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        res.json({ id: updatedReview._id.toString(), ...updatedReview.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADMIN DELETE: Delete a review
app.delete('/api/reviews/:id', async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        res.json({ id: deletedReview._id.toString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Separate shortcut route for public landing page components to fetch approved items only
app.get('/api/public/reviews', async (req, res) => {
    try {
        const approved = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
        res.json(approved.map(r => ({ id: r._id.toString(), ...r.toObject() })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/team', async (req, res) => {
    const total = await Team.countDocuments();

    const range = req.query.range
        ? JSON.parse(req.query.range)
        : [0, 9];

    const start = range[0];
    const end = range[1];
    const limit = end - start + 1;

    const team = await Team.find().skip(start).limit(limit);

    const mapped = team.map(t => ({
        id: t._id.toString(),
        name: t.name,
        title: t.title,
        bio: t.bio,
        image: t.image,
        fbUrl: t.fbUrl,
        twUrl: t.twUrl,
        lnUrl: t.lnUrl
    }));

    res.setHeader('Content-Range', `team ${start}-${start + mapped.length}/${total}`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');

    res.json(mapped);
});
app.get('/api/team/:id', async (req, res) => {
    try {
        const teamMember = await Team.findById(req.params.id);

        if (!teamMember) {
            return res.status(404).json({
                message: "Team member not found",
                id: req.params.id
            });
        }

        res.json({
            id: teamMember._id.toString(),
            name: teamMember.name,
            title: teamMember.title,
            bio: teamMember.bio,
            image: teamMember.image,
            fbUrl: teamMember.fbUrl,
            twUrl: teamMember.twUrl,
            lnUrl: teamMember.lnUrl
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/api/team', async (req, res) => {
    const t = await new Team(req.body).save();
    res.status(201).json({ id: t._id.toString(), ...t.toObject() });
});

app.put('/api/team/:id', async (req, res) => {
    const t = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ id: t._id.toString(), ...t.toObject() });
});

app.delete('/api/team/:id', async (req, res) => {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id });
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

app.get('/api/my-progress', async (req, res) => {
    const { email } = req.query; // Send email from frontend
    const booking = await Booking.findOne({ studentEmail: email });
    res.json(booking);
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

const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Access denied. Token missing." });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Admin role required." });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token session." });
    }
};

app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword, role: 'user' });
        res.status(201).json({ message: "Registration successful" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user._id.toString(), email: user.email, role: user.role } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin-Only Route to view registered users
app.get('/api/users', authenticateAdmin, async (req, res) => {
    try {
        const total = await User.countDocuments();
        const users = await User.find().select('-password');
        const mapped = users.map(u => ({ id: u._id.toString(), email: u.email, role: u.role }));
        
        res.setHeader('Content-Range', `users 0-${mapped.length}/${total}`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
        res.json(mapped);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// CRUD ENDPOINTS (Packages, Bookings, Blogs, Contacts...)
// ==========================================
app.get('/api/packages', async (req, res) => {
    const packages = await Package.find();
    res.setHeader('Content-Range', `packages 0-${packages.length}/${packages.length}`);
    res.json(packages.map(p => ({ id: p._id.toString(), ...p.toObject() })));
});
app.post('/api/bookings', async (req, res) => {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json(newBooking);
});
app.get('/api/bookings', async (req, res) => {
    const bookings = await Booking.find();
    res.setHeader('Content-Range', `bookings 0-${bookings.length}/${bookings.length}`);
    res.json(bookings.map(b => ({ id: b._id.toString(), ...b.toObject() })));
});
app.get('/api/courses', async (req, res) => {
    const courses = await Course.find();
    res.setHeader('Content-Range', `courses 0-${courses.length}/${courses.length}`);
    res.json(courses.map(c => ({ id: c._id.toString(), ...c.toObject() })));
});
app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.find();
    res.setHeader('Content-Range', `blogs 0-${blogs.length}/${blogs.length}`);
    res.json(blogs.map(b => ({ id: b._id.toString(), ...b.toObject() })));
});
app.get('/api/contacts', async (req, res) => {
    const contacts = await Contact.find();
    res.setHeader('Content-Range', `contacts 0-${contacts.length}/${contacts.length}`);
    res.json(contacts.map(c => ({ id: c._id.toString(), ...c.toObject() })));
});

// 1. GET ROUTE: Fetches the data (or creates the fallback defaults if it doesn't exist yet)
app.get('/api/page-settings/standard-course/:id', async (req, res) => {
    const settings = await Settings.findOne({ name: 'standard-course' });
    res.json(settings);
    try {
        let settings = await PageSetting.findById(req.params.id);
        if (!settings) {
            // Self-healing database mechanism: creates defaults if collection is empty
            settings = new PageSetting({
                _id: req.params.id,
                tuitionCost: 64,
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

// 2. PUT ROUTE: Updates the database when you save from your Admin Panel
app.put('/api/page-settings/standard-course/:id', async (req, res) => {
    try {
        const updatedSettings = await PageSetting.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { returnDocument: 'after' } // Clears deprecation warnings
        );
        res.json({ id: updatedSettings._id.toString(), ...updatedSettings.toObject() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Backend API running on port ${PORT}`));
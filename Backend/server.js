require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
    Package,
    Course,
    Booking,
    Blog,
    Contact,
    User,
    Team,
    Slot,
    PageSetting,
    Review,
    SiteSettings
} = require('./models');

const app = express();
const JWT_SECRET = 'uDrive_Secret_Token_Key_123';

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Range', 'X-Total-Count'],
    exposedHeaders: ['Content-Range', 'X-Total-Count']
}));

// ======================
// DATABASE CONNECTION
// ======================
mongoose.connect('mongodb://127.0.0.1:27017/udrive')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error(err));

// ======================
// HELPERS
// ======================
const getPagination = (req) => {
    const start = parseInt(req.query._start) || 0;
    const end = parseInt(req.query._end) || 10;
    return { start, limit: end - start };
};

// ======================
// AUTH
// ======================
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
        return res.status(401).json({ error: "Token missing" });

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.role !== 'admin')
            return res.status(403).json({ error: "Admin only" });

        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};

// ======================
// AUTH ROUTES
// ======================
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed, role: 'user' });

    res.status(201).json({ message: "Registered" });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        token,
        user: { id: user._id, email: user.email, role: user.role }
    });
});

// ======================
// USERS (ADMIN)
// ======================
app.get('/api/users', authenticateAdmin, async (req, res) => {
    const users = await User.find().select('-password');
    const mapped = users.map(u => ({
        id: u._id.toString(),
        email: u.email,
        role: u.role
    }));

    res.setHeader('Content-Range', `users 0-${mapped.length}/${mapped.length}`);
    res.json(mapped);
});

// ======================
// SITE SETTINGS
// ======================
app.get('/api/site-settings', async (req, res) => {
    let settings = await SiteSettings.findOne({ name: 'GlobalSettings' });
    if (!settings) settings = await SiteSettings.create({ name: 'GlobalSettings' });

    res.setHeader('Content-Range', `site-settings 0-1/1`);
    res.json({ id: settings._id.toString(), ...settings.toObject() });
});

app.put('/api/site-settings/:id', async (req, res) => {
    const updated = await SiteSettings.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json({ id: updated._id.toString(), ...updated.toObject() });
});

// ======================
// PAGE SETTINGS
// ======================
app.get('/api/page-settings/standard-course/:id', async (req, res) => {
    try {
        let settings = await PageSetting.findById(req.params.id);

        if (!settings) {
            settings = await PageSetting.create({
                _id: req.params.id,
                tuitionCost: 64,
                theoryHours: 4,
                behindWheelHours: 18,
                courseLengthDays: 30,
                instructorName: "Isaac Herman"
            });
        }

        res.json({ id: settings._id.toString(), ...settings.toObject() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/page-settings/standard-course/:id', async (req, res) => {
    try {
        const updated = await PageSetting.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({ id: updated._id.toString(), ...updated.toObject() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ======================
// PACKAGES (FULL CRUD)
// ======================
app.get('/api/packages', async (req, res) => {
    const packages = await Package.find();
    res.setHeader('Content-Range', `packages 0-${packages.length}/${packages.length}`);
    res.json(packages.map(p => ({ id: p._id.toString(), ...p.toObject() })));
});

app.post('/api/packages', async (req, res) => {
    const pkg = await new Package(req.body).save();
    res.status(201).json({ id: pkg._id.toString(), ...pkg.toObject() });
});

app.put('/api/packages/:id', async (req, res) => {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ id: updated._id.toString(), ...updated.toObject() });
});

app.delete('/api/packages/:id', async (req, res) => {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    res.json({ id: deleted._id.toString() });
});

// ======================
// BOOKINGS
// ======================
app.post('/api/bookings', async (req, res) => {
    const booking = await new Booking(req.body).save();
    res.status(201).json({ id: booking._id.toString(), ...booking.toObject() });
});

app.get('/api/bookings/:id', async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Not found" });

    res.json({ id: booking._id.toString(), ...booking.toObject() });
});

app.get('/api/bookings', async (req, res) => {
    const bookings = await Booking.find();
    res.setHeader('Content-Range', `bookings 0-${bookings.length}/${bookings.length}`);
    res.json(bookings.map(b => ({ id: b._id.toString(), ...b.toObject() })));
});

// payment
app.put('/api/bookings/:id/pay', async (req, res) => {
    const { transactionId } = req.body;
    const bookingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.json({ message: "Mock payment success" });
    }

    const updated = await Booking.findByIdAndUpdate(
        bookingId,
        { paymentStatus: 'Paid', status: 'Approved', transactionId },
        { new: true }
    );

    res.json(updated);
});

// ======================
// COURSES
// ======================
app.get('/api/courses', async (req, res) => {
    const courses = await Course.find();
    res.setHeader('Content-Range', `courses 0-${courses.length}/${courses.length}`);
    res.json(courses.map(c => ({ id: c._id.toString(), ...c.toObject() })));
});

app.post('/api/courses', async (req, res) => {
    const course = await new Course(req.body).save();
    res.status(201).json({ id: course._id.toString(), ...course.toObject() });
});

app.put('/api/courses/:id', async (req, res) => {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ id: updated._id.toString(), ...updated.toObject() });
});

app.delete('/api/courses/:id', async (req, res) => {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    res.json({ id: deleted._id.toString() });
});

// ======================
// REVIEWS (PUBLIC)
// ======================
app.get('/api/public/reviews', async (req, res) => {
    const reviews = await Review.find({ isApproved: true });
    res.json(reviews);
});

// ======================
// TEAM
// ======================
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

// ======================
// BLOGS
// ======================
app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.find();
    res.setHeader('Content-Range', `blogs 0-${blogs.length}/${blogs.length}`);
    res.json(blogs.map(b => ({ id: b._id.toString(), ...b.toObject() })));
});

app.post('/api/blogs', async (req, res) => {
    const b = await new Blog(req.body).save();
    res.status(201).json({ id: b._id.toString(), ...b.toObject() });
});

app.put('/api/blogs/:id', async (req, res) => {
    const b = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ id: b._id.toString(), ...b.toObject() });
});

app.delete('/api/blogs/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id });
});

// ======================
// CONTACTS
// ======================
app.post('/api/contacts', async (req, res) => {
    await new Contact(req.body).save();
    res.json({ message: "Sent" });
});

app.get('/api/contacts', async (req, res) => {
    const { start, limit } = getPagination(req);
    const total = await Contact.countDocuments();

    const contacts = await Contact.find()
        .skip(start)
        .limit(limit);

    res.setHeader('Content-Range', `contacts ${start}-${start + contacts.length}/${total}`);
    res.json(contacts.map(c => ({ id: c._id.toString(), ...c.toObject() })));
});

// ======================
// SERVER START
// ======================
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
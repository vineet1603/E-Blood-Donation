const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs'); 
const http = require('http'); 
const { Server } = require('socket.io'); 
const jwt = require('jsonwebtoken'); 
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

// 🛡️ Core Global Middlewares
app.use(express.json()); // 🔥 FIXED: Restored missing JSON parser
app.use(cors({ origin: "*" }));

// 📑 Explicit Static HTML Routing (Highly Secure: Prevents leaking server.js secrets)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/portal.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'portal.html'));
});

// Cloud Database Connection
mongoose.connect('mongodb+srv://VineetKumar:vineetkumar006@e-blood-donation.pto9mdf.mongodb.net/?appName=E-Blood-Donation')
    .then(() => console.log("✅ Database Connected"))
    .catch(err => console.error("❌ Connection Failed:", err));

// --- SCHEMAS ---

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String 
});
const User = mongoose.model('User', userSchema);

const donorSchema = new mongoose.Schema({
    fullName: String,
    bloodGroup: String,
    email: { type: String, unique: true },
    phone: String, 
    city: String
});
const Donor = mongoose.model('Donor', donorSchema);

const emergencySchema = new mongoose.Schema({
    hospitalName: String,
    requiredGroup: String,
    urgency: String,
    location: String,
    createdAt: { type: Date, default: Date.now }
});
const Emergency = mongoose.model('Emergency', emergencySchema);

// JWT Middleware
const JWT_SECRET = "super_secret_university_key";
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "No token provided!" });
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Unauthorized!" });
        next();
    });
};

// ==========================================
// 🛡️ API ROUTES
// ==========================================

// 1. USER SIGNUP
app.post('/api/auth/signup', async (req, res) => {
    try {
        const newUser = new User({ email: req.body.email, password: req.body.password });
        await newUser.save();
        res.status(201).json({ message: "Account created successfully!" });
    } catch (error) {
        res.status(400).json({ error: "Email already exists. Please login." });
    }
});

// 2. USER LOGIN
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        
        if (user) {
            const token = jwt.sign({ id: user._id, role: "user", email: user.email }, JWT_SECRET, { expiresIn: 86400 });
            res.status(200).json({ auth: true, token: token, email: user.email });
        } else {
            res.status(401).json({ error: "Invalid Email or Password" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error during login." });
    }
});

// 3. ADMIN LOGIN
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === "admin123") {
        const token = jwt.sign({ id: 1, role: "admin" }, JWT_SECRET, { expiresIn: 86400 });
        res.status(200).json({ auth: true, token: token });
    } else {
        res.status(401).json({ error: "Invalid Admin Password" });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const newDonor = new Donor(req.body);
        await newDonor.save();
        const logData = `New Donor: ${req.body.fullName} at ${new Date()}\n`;
        fs.appendFile('donor_logs.txt', logData, () => {});
        res.status(201).json({ message: "Registered successfully!" });
    } catch (error) {
        res.status(400).json({ error: "Registration failed. Email might exist." });
    }
});

app.post('/api/emergencies', verifyToken, async (req, res) => {
    try {
        const newEmergency = new Emergency(req.body);
        await newEmergency.save();
        io.emit('new_emergency', newEmergency); 
        res.status(201).json({ message: "Broadcasted via Sockets!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to create emergency." });
    }
});

app.get('/api/donors', async (req, res) => {
    try {
        const donors = await Donor.find().sort({ _id: -1 });
        res.status(200).json(donors);
    } catch (error) { res.status(500).json({ error: "Could not fetch data." }); }
});

app.get('/api/emergencies', async (req, res) => {
    try {
        const emergencies = await Emergency.find().sort({ createdAt: -1 });
        res.status(200).json(emergencies);
    } catch (error) { res.status(500).json({ error: "Could not fetch emergency requirements." }); }
});

app.delete('/api/donors/:id', verifyToken, async (req, res) => {
    try {
        await Donor.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) { res.status(500).json({ error: "Failed" }); }
});

app.put('/api/donors/:id', verifyToken, async (req, res) => {
    try {
        await Donor.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: "Updated successfully" });
    } catch (error) { res.status(500).json({ error: "Failed" }); }
});

app.get('/api/seed', async (req, res) => {
    const dummyDonors = [{ fullName: "Arjun Sharma", bloodGroup: "O+", email: "arjun@example.com", phone: "+91 98765 11111", city: "Amritsar" }];
    try {
        await Donor.deleteMany({});
        await Emergency.deleteMany({});
        await Donor.insertMany(dummyDonors);
        res.send(`<h2 style="color: green; font-family: sans-serif;">✅ Database seeded!</h2>`);
    } catch (error) { res.status(500).send("❌ Error"); }
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
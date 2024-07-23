// mongodb+srv://mihirkate26:<password>@cluster0.ldqfu8r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//

const req = require('express/lib/request');
const mongoose = require('mongoose');
require('dotenv').config();
main().catch(err => console.log(err));

async function main() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    role: {
        type: String,
        enum: ['admin', 'customer', 'reviewer', 'guest'],
        default: 'guest'
    }
});
const User = mongoose.model('User', userSchema);
module.exports = {
    User,
};
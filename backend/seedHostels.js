const mongoose = require('mongoose');
const { Hostel } = require('./models');

const hostels = [
    {
        name: "Hostel 1",
        location: "Campus A",
        rooms: 100,
        capacity: 400,
        vacant: 400
    },
    {
        name: "Hostel 2",
        location: "Campus A",
        rooms: 100,
        capacity: 400,
        vacant: 400
    },
    {
        name: "Hostel 3",
        location: "Campus B",
        rooms: 100,
        capacity: 400,
        vacant: 400
    },
    {
        name: "Hostel 4",
        location: "Campus B",
        rooms: 100,
        capacity: 400,
        vacant: 400
    },
    {
        name: "Hostel 5",
        location: "Campus C",
        rooms: 100,
        capacity: 400,
        vacant: 400
    },
    {
        name: "Hostel 6",
        location: "Campus C",
        rooms: 100,
        capacity: 400,
        vacant: 400
    },
    {
        name: "Hostel 7",
        location: "Campus D",
        rooms: 100,
        capacity: 400,
        vacant: 400
    },
    {
        name: "Hostel 8",
        location: "Campus D",
        rooms: 100,
        capacity: 400,
        vacant: 400
    }
];

const seedHostels = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/hostel', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Clear existing hostels
        await Hostel.deleteMany({});

        // Insert new hostels
        await Hostel.insertMany(hostels);

        console.log('Hostels seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding hostels:', error);
        process.exit(1);
    }
};

seedHostels(); 
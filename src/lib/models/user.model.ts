import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
    },
    bio: {
        type: String,
    },
    dob: {
        type: String,
    },
    address: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    pincode: {
        type: String,
    },
    issues: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Issue"
        }
    ],
    totalIssues: {
        type: Number,
        default: 0
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    adminType: {
        type: String,
        enum: ['municipal', 'district', 'state', 'national'],
    },

    issuesHavetoResolve: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue"
    }],

    
    notification: [
        {
            text: {
                type: String,
                required: true
            },
            issueId: {
                type: String,
            },
            communityId: {
                type: String,
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    onboarded: {
        type: Boolean,
        default: false
    },
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
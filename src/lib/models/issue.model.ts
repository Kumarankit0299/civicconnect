import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: String,
    phase: {
        type: String,
        enum: [ 'municipal', 'district', 'state', 'national', 'resolved'],
        default: 'municipal'
    },

    reportDate: {
        type: Date,
        default: Date.now
    },
    resolutionDate: Date,
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    assignedAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    },
    comments: [
        {
            text: {
              type: String,
              required: true
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
    voteCount: {
        type: Number,
        default: 0
    },



});

const Issue =   mongoose.models.Issue || mongoose.model("Issue", issueSchema);

export default Issue;


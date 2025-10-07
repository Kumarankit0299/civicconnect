"use server"
import { revalidatePath } from "next/cache";
import Issue from "../models/issue.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Community from "../models/community.model";

interface Params {
    title: string;
    description: string;
    location: string;
    reporterId: string;
    image: string;
    communityId: string | null;
    path: string;
}

export async function createIssue({
    title,
    description,
    location,
    image,
    reporterId,
    communityId,
    path
}: Params) {
    connectToDB();

    try {
        const communityIdObject = await Community.findOne(
            { id: communityId },
            { _id: 1 }
        )
        const createdIssue = await Issue.create({
            title,
            description,
            location,
            image,
            reporter: reporterId,
            community: communityIdObject
        });


        await User.findByIdAndUpdate(reporterId, {
            $push: { issues: createdIssue._id, notification: { text: `You reported an issue!`, issueId: createdIssue._id } },
            $inc: { totalIssues: 1 }
        });
        const admins = await User.findOne({ isAdmin: true, adminType: 'municipal' });
        admins.issuesHavetoResolve.push(createdIssue._id);
        await admins.save();

        if (communityIdObject) {
            await Community.findByIdAndUpdate(communityIdObject, {
                $push: { issues: createdIssue._id },
            });
        }
        createdIssue.assignedAdmin = admins._id;
        createdIssue.phase = 'municipal';
        await createdIssue.save();

        console.log(createdIssue)
        revalidatePath(path);
    } catch (error: any) {
        console.log(`Failed to create issue: ${error.message}`)
    }
}

export async function fetchIssues(pageNumber = 1, pageSize = 20) {
    try {
        connectToDB();
        const skipAmount = (pageNumber - 1) * pageSize;
        const issuesQuery = Issue.find({})
            .sort({ reportDate: 'desc' })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'reporter', model: User, select: '_id id name issue image username' })
            .populate({ path: 'community', model: Community, select: 'id, name, image' })
            .populate({
                path: "comments", // Populate the children field
                populate: [
                    {
                        path: "user", // Populate the author field within children
                        model: User,
                        select: "_id id name username image", // Select only _id and username fields of the author
                    },
                ],
            })

        const totalIssuesCount = await Issue.countDocuments();

        const issues = await issuesQuery.exec();

        const isNext = totalIssuesCount > skipAmount + issues.length;

        return { issues, isNext };
    } catch (error: any) {
        console.log(error.message)
    }
}


export async function deleteIssue(id: string, path: string): Promise<void> {
    try {
        connectToDB();
        console.log('id', id)
        await Issue.findByIdAndDelete(id);
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to delete issue: ${error.message}`);
    }
}

export async function fetchIssueById(issueID: string) {
    connectToDB();

    try {
        const issue = await Issue.findById(issueID)
            .populate({
                path: "reporter",
                model: User,
                select: "_id id name image username",
            }) // Populate the author field with _id and username
            .populate({
                path: "community",
                model: Community,
                select: "_id id name image",
            }) // Populate the community field with _id and name
            .populate({
                path: "comments", // Populate the children field
                populate: [
                    {
                        path: "user", // Populate the author field within children
                        model: User,
                        select: "_id id name username image", // Select only _id and username fields of the author
                    },
                ],
            })
            .exec();

        return issue;
    } catch (err) {
        console.error("Error while fetching issue:", err);
        throw new Error("Unable to fetch issue");
    }
}

export async function addCommentToIssue(
    issueID: string,
    commentText: string,
    userId: string,
    path: string
) {
    connectToDB();
    try {
        const issue = await Issue.findById(issueID);
        if (!issue) {
            console.log('Issue not found')
        }
        const user = await User.findById(userId)
        if (!user) {
            console.log('User not found')
        }
        const newComment = {
            text: commentText,
            user: user,
            createdAt: new Date()
        };

        issue.comments.push(newComment);
        if (issue.reporter._id.toString() !== userId.toString())
            await User.findByIdAndUpdate(issue.reporter, {
                $push: { notification: { text: 'replied to your issue.', issueId: issue._id, user: user, } },
            });
        await issue.save();
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error adding comment to issue: ${error.message}`);
    }
}




export async function updateIssuePhaseByDefault() {
    try {
        const twoHoursInMilliseconds = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
        setInterval(async () => {
            // Find issues with phase 'created' or 'municipal' that are not resolved
            const issuesToUpdate = await Issue.find({
                phase: { $in: ['created', 'municipal', 'district', 'state'] },
                resolutionDate: { $exists: false }
            });

            let municipalAdmin = await User.findOne({ isAdmin: true, adminType: 'municipal' });
            let districtAdmin = await User.findOne({ isAdmin: true, adminType: 'district' });
            let stateAdmin = await User.findOne({ isAdmin: true, adminType: 'state' });
            let nationalAdmin = await User.findOne({ isAdmin: true, adminType: 'national' });

            // Update the phase of each issue   
            issuesToUpdate.forEach(async (issue) => {
                let newPhase;
                switch (issue.phase) {
                    case 'municipal':
                        // admins = await User.find({ isAdmin: true, adminType: 'municipal' });
                        // admins.issuesHavetoResolve.push(issue._id);
                        newPhase = 'district';
                        break;
                    case 'district':
                        newPhase = 'state';
                        break;
                    case 'state':
                        newPhase = 'national';
                        break;
                }

                // Update the issue's phase
                await Issue.findOneAndUpdate({ _id: issue._id }, { phase: newPhase });
            });
        }, twoHoursInMilliseconds);
    } catch (error) {
        console.error("Error updating issue phase:", error);
        throw error;
    }
}

updateIssuePhaseByDefault();

export async function updateIssuePhase(issueId: string) {
    try {
        console.log('In issueId', issueId)
        connectToDB();
        const issue = await Issue.findById(issueId);
        if (!issue) {
            console.log('Issue not found')
            return;
        }
        console.log('issue', issue)
        const currentAdmin = issue.assignedAdmin._id;
        console.log('currentAdmin', currentAdmin)
        const districtAdmin = await User.findOne({ isAdmin: true, adminType: 'district' });
        const stateAdmin = await User.findOne({ isAdmin: true, adminType: 'state' });
        const nationalAdmin = await User.findOne({ isAdmin: true, adminType: 'national' });
        let newPhase;
        switch (issue.phase) {
            case 'municipal': {
                console.log('issue.phase', issue.phase)
                newPhase = 'district';
                issue.assignedAdmin = districtAdmin._id;
                districtAdmin.issuesHavetoResolve.push(issue._id);
                await districtAdmin.save();
                break;
            }
            case 'district': {
                newPhase = 'state';
                issue.assignedAdmin = stateAdmin._id;
                stateAdmin.issuesHavetoResolve.push(issue._id);
                await stateAdmin.save();
                break;
            }
            case 'state': {
                newPhase = 'national';
                issue.assignedAdmin = nationalAdmin._id;
                nationalAdmin.issuesHavetoResolve.push(issue._id);
                await nationalAdmin.save();
                break;
            }
        }
        issue.phase = newPhase;
        await issue.save();
        await User.findByIdAndUpdate(issue.reporter, {
            $push: { notification: { text: `Your issue has been transfered to ${newPhase} administrative.`, issueId: issue._id } },
        });
        currentAdmin.issuesHavetoResolve.pull(issue._id);
        await currentAdmin.save();
        return issue.phase;
    } catch (error) {
        console.error("Error updating issue phase:", error);
        throw error;
    }
}


export async function resolveIssue(issueId: string) {
    try {
        connectToDB();
        const issue = await Issue.findById(issueId);
        if (!issue) {
            console.log('Issue not found')
            return;
        }
        if (issue.phase !== 'resolved') {
            issue.phase = 'resolved';
            issue.resolutionDate = new Date();
            await issue.save();
        }
        await User.findByIdAndUpdate(issue.reporter, {
            $push: { notification: { text: `Your issue has been resolved by ${issue.phase} administrative.`, issueId: issue._id } },
        });
        return issue.phase;
    }
    catch (error) {
        console.error("Error updating issue phase:", error);
        throw error;
    }
}


export async function fetchAllResolvedUserIssue(id: string) {
    connectToDB();
    try {
        const issues = await User.findOne({ id: id, phase: 'resolved' })
            .populate({
                path: "issues",
                model: Issue,
                populate: [
                    {
                        path: "community",
                        model: Community,
                        select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
                    },
                    {
                        path: "comments",
                        populate: [
                            {
                                path: "user", // Populate the author field within children
                                model: User,
                                select: "_id id name username image", // Select only _id and username fields of the author
                            },
                        ],
                    },
                ],
            });
        return issues;
    } catch (error: any) {
        console.log(error.message)
    }
}

export async function fetchAllResolvedIssue() {
    connectToDB();
    try {
        const issues = await Issue.find({ phase: 'resolved' })
            .sort({ reportDate: 'desc' })
            .populate({ path: 'reporter', model: User, select: '_id id name issue image username' })
            .populate({ path: 'community', model: Community, select: 'id, name, image' })
            .populate({
                path: "comments", // Populate the children field
                populate: [
                    {
                        path: "user", // Populate the author field within children
                        model: User,
                        select: "_id id name username image", // Select only _id and username fields of the author
                    },
                ],
            }).exec();

        return { issues };
    } catch (error: any) {
        console.log(error.message)
    }
}

export async function fetchAllPendingIssue() {
    connectToDB();
    try {
        const issues = await Issue.find({ phase: { $in: ['municipal', 'district', 'state', 'national'] } })
            .sort({ reportDate: 'desc' })
            .populate({ path: 'reporter', model: User, select: '_id id name issue image username' })
            .populate({ path: 'community', model: Community, select: 'id, name, image' })
            .populate({
                path: "comments", // Populate the children field
                populate: [
                    {
                        path: "user", // Populate the author field within children
                        model: User,
                        select: "_id id name username image", // Select only _id and username fields of the author
                    },
                ],
            }).exec();

        return { issues };
    } catch (error: any) {
        console.log(error.message)
    }
}


export async function fetchAllPendingUserIssue(id: string) {
    connectToDB();
    try {
        const issues = await User.findOne({ id: id, phase: { $not: 'resolved' } })
            .populate({
                path: "issues",
                model: Issue,
                populate: [
                    {
                        path: "community",
                        model: Community,
                        select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
                    },
                    {
                        path: "comments",
                        populate: [
                            {
                                path: "user", // Populate the author field within children
                                model: User,
                                select: "_id id name username image", // Select only _id and username fields of the author
                            },
                        ],
                    },
                ],
            });
        return issues;
    } catch (error: any) {
        console.log(error.message)
    }
}


export async function adminFetchIssue(adminId: string) {
    connectToDB();

    try {
        const issues = await Issue.find({ assignedAdmin: adminId })
            .sort({ reportDate: 'desc' })
            .populate({ path: 'reporter', model: User, select: '_id id name issue image username' })
            .populate({ path: 'community', model: Community, select: 'id, name, image' })
            .populate({
                path: "comments", // Populate the children field
                populate: [
                    {
                        path: "user", // Populate the author field within children
                        model: User,
                        select: "_id id name username image", // Select only _id and username fields of the author
                    },
                ],
            }).exec();

        return { issues };

    } catch (err) {
        console.error("Error while fetching issue:", err);
        throw new Error("Unable to fetch issue");
    }
}
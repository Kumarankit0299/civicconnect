"use server";

import { FilterQuery, SortOrder } from "mongoose";

import Community from "../models/community.model";
import Issue from "../models/issue.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";
interface CreateCommunityInput {
  name: string;
  image: string;
  bio: string;
  createdById: string;
  username: string;
  city: string;
  state: string;
  pincode: string;
}

export async function createCommunity(
  {
    name,
    image,
    username,
    bio,
    city,
    state,
    pincode,
    createdById,
  }: CreateCommunityInput
) {
  try {
    connectToDB();
    // Find the user with the provided unique id
    const user = await User.findOne({ id: createdById });

    if (!user) {
      throw new Error("User not found"); // Handle the case if the user with the id is not found
    }

    const userNameIsTaken = await Community.findOne({ username });
    if (userNameIsTaken) {
      return { error: "Username is already taken" };
    }

    const createdCommunity = await Community.create({
      name,
      username,
      image,
      bio,
      city,
      state,
      pincode,
      createdBy: user._id, // Use the mongoose ID of the user
    });
    const admins = await User.find({isAdmin : true}, { _id: 1 });

    createdCommunity.members.push(user._id)
    admins.forEach(admin => {
      createdCommunity.members.push(admin._id);
  });
    // createdCommunity.members.push(user._id, );
    createdCommunity.id = createdCommunity._id.toString();
    await createdCommunity.save();
    // Update User model

    user.communities.push(createdCommunity._id);
    await user.save();

    console.log(createdCommunity)
    return createdCommunity._id;
  } catch (error) {
    // Handle any errors
    console.error("Error creating community:", error);
    throw error;
  }
}

export async function fetchCommunityDetails(id: string) {
  try {
    connectToDB();

    const communityDetails = await Community.findById(id)
      .populate([
        "createdBy",
        {
          path: "members",
          model: User,
          select: "name username image _id id",
        },
      ]);

    return communityDetails;
  } catch (error) {
    // Handle any errors
    console.error("Error fetching community details:", error);
    throw error;
  }
}

export async function fetchCommunityPosts(id: string) {
  try {
    connectToDB();

    const communityPosts = await Community.findById(id).populate({
      path: "issues",
      model: Issue,
      populate: [
        { path: 'reporter', model: User, select: '_id id name issue image username' },
        {
          path: "comments", // Populate the children field
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

    return communityPosts;
  } catch (error) {
    // Handle any errors
    console.error("Error fetching community posts:", error);
    throw error;
  }
}

export async function fetchAllResolvedCommunityIssue(id: string) {  
  try {
    connectToDB();

    const communityPosts = await Community.findOne({_id : id, phase: 'resolved'}).populate({
      path: "issues",
      model: Issue,
      populate: [
        { path: 'reporter', model: User, select: '_id id name issue image username' },
        {
          path: "comments", // Populate the children field
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
    return communityPosts;
  }
  catch (error) {
    // Handle any errors
    console.error("Error fetching community posts:", error);
    throw error;
  }
}

export async function fetchCommunities({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of communities to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter communities.
    const query: FilterQuery<typeof Community> = {};

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched communities based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the communities based on the search and sort criteria.
    const communitiesQuery = Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("members");

    // Count the total number of communities that match the search criteria (without pagination).
    const totalCommunitiesCount = await Community.countDocuments(query);

    const communities = await communitiesQuery.exec();

    // Check if there are more communities beyond the current page.
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
}

export async function addMemberToCommunity(
  { communityId,
    memberId }: { communityId: string, memberId: string }
) {
  try {
    connectToDB();

    // Find the community by its unique id
    const community = await Community.findOne({ id: communityId });
    console.log(community)

    if (!community) {
      throw new Error("Community not found");
    }

    // Find the user by their unique id
    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is already a member of the community
    if (community.members.includes(user._id)) {
      throw new Error("User is already a member of the community");
    }

    // Add the user's _id to the members array in the community
    community.members.push(user._id);
    await community.save();

    // Add the community's _id to the communities array in the user
    user.communities.push(community._id);
    user.notification.push({ text: `You joined the community ${community.name} `, communityId: community._id });
    await user.save();

    return { success: true };
  } catch (error) {
    // Handle any errors
    console.error("Error adding member to community:", error);
    throw error;
  }
}

export async function removeUserFromCommunity(
  { userId,
    communityId
  }: { userId: string, communityId: string }
) {
  try {
    connectToDB();
    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne({ id: communityId });


    if (!userIdObject) {
      throw new Error("User not found");
    }

    if (!communityIdObject) {
      throw new Error("Community not found");
    }

    // Remove the user's _id from the members array in the community
    console.log(userIdObject);
    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id, notification: { text: `You leaved a community '${communityIdObject.name}' `, communityId: communityIdObject._id } } }
    );

    // Remove the community's _id from the communities array in the user
    await User.updateOne(
      { _id: userIdObject._id },
      {
        $pull: { communities: communityIdObject._id },
        $push: { notification: { text: `You leaved the community ${communityIdObject.name} `, communityId: communityIdObject._id } }
      }

    );
    return { success: true };
  } catch (error) {
    // Handle any errors
    console.error("Error removing user from community:", error);
    throw error;
  }
}

export async function updateCommunityInfo(
  communityId: string,
  name: string,
  username: string,
  image: string
) {
  try {
    connectToDB();

    // Find the community by its _id and update the information
    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { name, username, image }
    );

    if (!updatedCommunity) {
      throw new Error("Community not found");
    }

    return updatedCommunity;
  } catch (error) {
    // Handle any errors
    console.error("Error updating community information:", error);
    throw error;
  }
}

export async function deleteCommunity(communityId: string) {
  try {
    connectToDB();

    // Find the community by its ID and delete it
    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });

    if (!deletedCommunity) {
      throw new Error("Community not found");
    }

    // Delete all threads associated with the community
    await Issue.deleteMany({ community: communityId });

    // Find all users who are part of the community
    const communityUsers = await User.find({ communities: communityId });

    // Remove the community from the 'communities' array for each user
    const updateUserPromises = communityUsers.map((user) => {
      user.communities.pull(communityId);
      return user.save();
    });

    await Promise.all(updateUserPromises);

    return deletedCommunity;
  } catch (error) {
    console.error("Error deleting community: ", error);
    throw error;
  }
}


export async function suggestCommunities(
  userId: string){
    try {
      const user = await User.findOne({ id: userId });
      const suggestesCommunities = await Community.find({ city: user.city, state: user.state });
      return suggestesCommunities;
    } catch (error) {
      console.log(error)
    }
  }
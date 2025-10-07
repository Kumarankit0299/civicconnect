"use server"
import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Issue from "../models/issue.model";
import Community from "../models/community.model";

interface Params {
  userId: string,
  name: string,
  username: string,
  email: string,
  image: string,
  bio?: string,
  path?: string,
  address?: string,
  state?: string,
  city?: string,
  pincode?: string
  isAdmin?: boolean
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId })
      .populate({
        path: "communities",
        model: Community,
      });
  } catch (error: any) {
    console.log(`Failed to fetch user: ${error.message}`);
  }
}

export async function updateUser(
  {
    userId,
    name,
    username,
    email,
    image,
    bio,
    path,
    address,
    state,
    city,
    pincode,
    isAdmin,
  }: Params
): Promise<void> {
  connectToDB();

  try {
    const user = await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name: name,
        email: email.toLowerCase(),
        image: image,
        bio: bio,
        address: address,
        state: state,
        city: city,
        pincode: pincode,
        onboarded: true,
        // isAdmin : true,
        // adminType : 'municipal'
        // adminType : 'district'
        // adminType : 'state'
        // adminType : 'national'
      },
      { upsert: true }
    );
    
    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error: any) {
    console.log(error);
  }

}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();
    const issues = await User.findOne({ id: userId })
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
      // console.log(issues)
      
    return issues;
  } catch (error: any) {
    console.log(`Failed to fetch user posts: ${error.message}`);
  }

}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all threads created by the user
    const userIssues = await Issue.find({ reporter: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const userIssuesIds = userIssues.reduce((acc, userIssue) => {
      return acc.concat(userIssue.comments);
    }, []);

    // console.log('userIssuesIds', userIssuesIds)

    // const replies = await Issue.find({
    //   comments: { $in: userIssuesIds },
    //   reporter: { $ne: userId }, // Exclude threads authored by the same user
    // })
    // .populate({
    //   path: "reporter",
    //   model: User,
    //   select: "name image _id",
    // });

    // console.log("Replies: ", replies);

    return [];
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}

export async function getNotification(userId: string) {
  try {
    connectToDB();
    // console.log('userId', userId)
    const notification = await User.findOne({ _id: userId })
      .populate({
        path: "notification",
        populate: [
          {
            path: "user",
            model: User,
            select: "_id id name username image",
          },
        ]
      }).exec();
    return notification.notification.reverse();
  } catch (error) {
    console.error("Error fetching notification: ", error);
    throw error;
  }
}
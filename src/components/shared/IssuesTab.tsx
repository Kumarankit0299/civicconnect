import { redirect } from "next/navigation";

// import { fetchCommunityPosts } from "@/lib/actions/community.actions";

import IssueCard from "../cards/IssueCard";
import { fetchUser, fetchUserPosts } from "@/lib/actions/user.actions";
import { fetchAllResolvedCommunityIssue, fetchCommunityDetails, fetchCommunityPosts } from "@/lib/actions/community.actions";
import { currentUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

interface Result {
  name: string;
  image: string;
  id: string;
  username: string;
  issues: {
    _id: string;
    title: string;
    description: string;
    reportDate: string;
    phase: string;
    location: string;
    image: string;
    voteCount: number;
    reporter: {
      name: string;
      image: string;
      id: string;
      username: string;
    };
    resolvedDate?: string | undefined;
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    comments: {
      text: string;
      user: {
        name: string;
        image: string;
        id: string;
        username: string;
      };
      _id: string;
    }[];
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
  resolvedIssues?: boolean
  userId: string
}

async function IssuesTab({ currentUserId, accountId, accountType , resolvedIssues, userId}: Props) {
  console.log({accountType})
  console.log({accountId})
  console.log({currentUserId})
  const user = await currentUser();
  if (!user) return null;

  let result: Result;
if(accountType === "Community" ) {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(currentUserId);
  }


  if (!result) {
    redirect("/");
  }

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {
      result.issues.map((issue: any) => (
          <IssueCard
            key={issue._id}
            id={issue._id}
            currentUserId={userId}
            title={issue.title}
            description={issue.description}
            reportDate={issue.reportDate}
            phase={issue.phase}
            location={issue.location.toString()}
            voteCount={issue.voteCount}
            resolvedDate={issue.resolutionDate}
            comments={issue.comments}
            commentCount={issue.comments.length}
            isComment={false}
            image={issue.image}
            reporter={
              accountType === "User"
                ? { name: result.name, image: result.image, id: result.id, username: result.username }
                : {
                  name: issue.reporter.name,
                  image: issue.reporter.image,
                  id: issue.reporter.id,
                  username: issue.reporter.username,
                }
            }
            community={
              accountType === "Community"
                ? { name: result.name, id: result.id, image: result.image }
                : issue.community
            }
          />
        ))
      }
    </section>
  );
}

export default IssuesTab;

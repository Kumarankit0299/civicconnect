import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import Comment from "@/components/forms/Comment";
import IssueCard from "@/components/cards/IssueCard";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchIssueById } from "@/lib/actions/issue.action";
import CommentCard from "@/components/cards/CommentCard";

export const revalidate = 0;

async function page({ params }: { params: { id: string } }) {
    if (!params.id) return null;

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const issue = await fetchIssueById(params.id);
    return (
        <section className='relative'>
            <div>
                <IssueCard
                    id={issue._id}
                    currentUserId={user.id}
                    title={issue.title}
                    description={issue.description}
                    reportDate={issue.reportDate}
                    phase={issue.phase}
                    location={issue.location.toString()}
                    voteCount={issue.voteCount}
                    reporter={issue.reporter}
                    community={issue.community}
                    resolvedDate={issue.resolutionDate}
                    comments={issue.comments}
                    commentCount={issue.comments.length}
                    isComment={false}
                    image={issue.image}
                />
            </div>

            <div className='mt-7'>
                <Comment
                    issueID={params.id}
                    currentUserImg={user.imageUrl}
                    currentUserId={userInfo._id}
                />
            </div>

            <div className='mt-10 flex flex-col gap-2'>
                {issue.comments.map((comment: any) => (
                    <CommentCard    
                    key={comment._id}
                    id={comment._id}
                    currentUserId={user.id}
                    user={comment.user}
                    createdAt={comment.createdAt}
                    text={comment.text}
                    // name={comment.name}
                    // image={comment.image}
                    // username={comment.username}
                    />
                ))}
            </div>
        </section>
    );
}

export default page;

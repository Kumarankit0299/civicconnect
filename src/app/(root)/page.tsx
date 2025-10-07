
import { currentUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";

import IssueCard from "@/components/cards/IssueCard";
import Pagination from "@/components/shared/Pagination";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchIssues } from "@/lib/actions/issue.action";
import Chat from "./chatbot";

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  // console.log(userInfo)
  if(userInfo?.isAdmin) redirect("/admin");
  // console.log(userInfo?.isAdmin)
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchIssues(
    searchParams.page ? +searchParams.page : 1,
    30
  );
  
  return (
    <>
      <h1 className='head-text text-left'>Home</h1>

      <section className='mt-9 flex flex-col gap-10'>
        {result?.issues.length === 0 ? (
          <p className='no-result'>No Issue found</p>
        ) : (
          <>
            {result?.issues.map((issue) => (
              <IssueCard
                key={issue._id}
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
                image = {issue.image}
                isComment={false}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path='/'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result?.isNext}
      />

      <Chat/>
    </>
  );
}

export default Home;

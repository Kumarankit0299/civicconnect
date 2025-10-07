import Image from "next/image";
import { currentUser } from "@clerk/nextjs";

import { communityTabs } from "@/constants";

import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchAllResolvedCommunityIssue, fetchCommunityDetails, fetchCommunityPosts } from "@/lib/actions/community.actions";
import IssuesTab from "@/components/shared/IssuesTab";
import { fetchUser } from "@/lib/actions/user.actions";
import IssueCard from "@/components/cards/IssueCard";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const communityDetails = await fetchCommunityDetails(params.id);
  const userInfo = await fetchUser(user.id)
  console.log('user id', userInfo.id);
  let isMember = false;
  if (communityDetails) {
    communityDetails?.members.forEach((member: any) => {
      if (member._id.toString() === userInfo._id.toString()) {
        isMember = true;
        return;
      }
    })
  }
  const allResolvedCommunityIssue = await fetchCommunityPosts(communityDetails._id)
  const resolvedIssues = allResolvedCommunityIssue.issues.filter((issue: any) => issue.phase === 'resolved');


  return (
    <section>
      <ProfileHeader
        accountId={communityDetails._id.toString()}
        authUserId={userInfo.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        type='Community'
        isMember={isMember}
      />

      <div className='mt-9'>
        <Tabs defaultValue='issues' className='w-full'>
          <TabsList className='tab'>
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label === "Issues" && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {communityDetails.issues.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {isMember && (
            <>
              <TabsContent value='issues' className='w-full mt-9 text-light-1'>
                {/* @ts-ignore */}
                <IssuesTab
                  currentUserId={user.id}
                  accountId={communityDetails._id}
                  accountType='Community'
                />
              </TabsContent>
              <TabsContent value='members' className='mt-9 w-full text-light-1'>
                <section className='mt-9 flex flex-col gap-10'>
                  {communityDetails.members.map((member: any) => (
                    <UserCard
                      key={member.id}
                      id={member.id}
                      name={member.name}
                      username={member.username}
                      imgUrl={member.image}
                      personType='User'
                    />
                  ))}
                </section>
              </TabsContent>

              <TabsContent value='resolved_issue' className='w-full mt-9 text-light-1'>
                {/* @ts-ignore */}
                <section className='mt-9 flex flex-col gap-10'>
                  {resolvedIssues.map((issue: any) => (
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
                      image={issue.image}
                      isComment={false}
                      isAdmin={userInfo?.isAdmin}
                      adminType={userInfo?.adminType}

                    />
                  ))}
                </section>
              </TabsContent>
            </>
          )
          }
        </Tabs>
        {!isMember &&
          <div className='flex flex-col items-center gap-4 h-10 mt-20'>
            <h1 className="text-heading3-bold text-light-1">Join the community to view the reports.</h1>
          </div>
        }
      </div>
    </section>
  );
}

export default Page;

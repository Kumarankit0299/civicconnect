import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { profileTabs } from "@/constants";

import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchUser, fetchUserPosts } from "@/lib/actions/user.actions";
import IssuesTab from "@/components/shared/IssuesTab";
import IssueCard from "@/components/cards/IssueCard";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) redirect("/onboarding")

  const currentUserImage = userInfo?.image;
  console.log({currentUserImage});

  const userIssues = await fetchUserPosts(userInfo?.id)
  const resolvedIssues = userIssues?.issues.filter((issue: any) => issue.phase === 'resolved');
  const pendingIssues = userIssues?.issues.filter((issue: any) => issue.phase !== 'resolved');
  // console.log(resolvedIssues, pendingIssues, 'resolved and pending issues')

  // console.log('userIssues', resolvedIssues)
  
  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className='mt-9'>
        <Tabs defaultValue='issues' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => (
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
                    {userInfo?.issues?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value='issues' className='w-full text-light-1'>
            {/* @ts-ignore */}
            <IssuesTab
              currentUserId={userInfo.id}
              accountId={userInfo._id}
              userId = {user.id}
              accountType='User'
            />
          </TabsContent>
          <TabsContent value='pending_issue' className='mt-9 w-full text-light-1'>
          <section className='mt-9 flex flex-col gap-10'>
            {pendingIssues.map((issue: any) => (
              <IssueCard
                key={issue._id}
                id={issue._id}
                userInfo={userInfo}
                currentUserId={user.id}
                title={issue.title}
                description={issue.description}
                reportDate={issue.reportDate}
                phase={issue.phase}
                location={issue.location.toString()}
                voteCount={issue.voteCount}
                // reporter={issue.reporter}
                reporter={{ name: userInfo.name, image: userInfo.image, id: pendingIssues.id, username: userInfo.username }}
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
                reporter={{ name: userInfo.name, image: userInfo.image, id: resolvedIssues.id, username: userInfo.username }}
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
        </Tabs>
      </div>
    </section>
  );
}
export default Page;

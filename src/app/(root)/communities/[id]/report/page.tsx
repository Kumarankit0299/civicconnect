import PostIssue from "@/components/forms/PostIssue";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


async function Page({ params }: { params: { id: string } }) {
    const communityId = params.id;
    // console.log(communityId)

    const user = await currentUser();
    if (!user) return null;

    // fetch organization list created by user
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const location = `${userInfo.address}, ${userInfo.city}, ${userInfo.state}, ${userInfo.pincode}`;

    return (
        <>
            <h1 className='head-text'>Report Issue</h1>

            <PostIssue userId={userInfo._id} location={location} communityId={communityId}/>
        </>
    );
}

export default Page;

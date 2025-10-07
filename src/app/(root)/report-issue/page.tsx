import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import PostIssue from "@/components/forms/PostIssue";
import { fetchUser } from "@/lib/actions/user.actions";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const location = `${userInfo.address}, ${userInfo.city}, ${userInfo.state}, ${userInfo.pincode}`;

  return (
    <>
      <h1 className='head-text'>Report Issue</h1>

      <PostIssue userId={userInfo._id} location={location} />
    </>
  );
}

export default Page;

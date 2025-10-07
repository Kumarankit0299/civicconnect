import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";

type User = {
  id: string;
  objectId: string;
  username: string | null;
  email: string;
  name: string;
  bio: string;
  image: string;
  address: string;
  pincode: string;
  state: string;
  city: string;
};

async function Page() {
  const user = await currentUser();
  if (!user) return null; // to avoid typescript warnings

  const userInfo = await fetchUser(user.id);
  if (userInfo?.isAdmin) redirect("/admin");
  if (userInfo?.onboarded) redirect("/");

  let userData : User = {
    id: user.id,
    objectId: '',
    username: user.username,
    email: user.emailAddresses[0].emailAddress,
    name: `${user.firstName} ${user.lastName ?? '' }` ?? "",
    bio: "",
    image: user.imageUrl,
    address: '',
    pincode: '',
    state: '',
    city: ''
  };
  if (userInfo) {
    userData = {
      id: user.id,
      objectId: userInfo?._id,
      username: userInfo ? userInfo?.username : user.username,
      name: userInfo ? userInfo?.name : `${user.firstName} ${user.lastName ?? ''}` ?? "",
      bio: userInfo ? userInfo?.bio : "",
      image: userInfo ? userInfo?.image : user.imageUrl,
      email: userInfo.email || user.emailAddresses[0].emailAddress,
      address: userInfo ? userInfo.address : '',
      pincode: userInfo ? userInfo.pincode : '',
      state: userInfo ? userInfo.state : '',
      city: userInfo ? userInfo.city : ''
    }
  }

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='head-text'>Onboarding</h1>
      <p className='mt-3 text-base-regular text-light-2'>
        Complete your profile now, to use Cric Connect.
      </p>

      <section className='mt-9 bg-dark-2 p-10'>
        <AccountProfile user={userData}
          btnTitle='Continue' />
      </section>
    </main>
  );
}

export default Page;

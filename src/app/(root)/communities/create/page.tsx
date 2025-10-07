import CreateCommunity from "@/components/forms/CreateCommunity";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

const Page = async () => {
    const user = await currentUser();
    if (!user) return null;
    const userInfo =await fetchUser(user.id);

    return (
        <div>
            <CreateCommunity userId={userInfo?.id} state={userInfo?.state} city={userInfo?.city} pinCode={userInfo?.pincode} />
        </div>
    );
}

export default Page;
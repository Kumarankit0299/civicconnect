import IssueCard from "@/components/cards/IssueCard";
import {  updateIssuePhase } from "@/lib/actions/issue.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page({ params }: { params: { id: string } }) {
    const user = await currentUser();
    if (!user) return null; // to avoid typescript warnings

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.isAdmin) redirect("/");

    // const issue = await fetchIssueById(params.id);
    console.log("params", params.id);
    try {
        const transferIssuePhase = await updateIssuePhase(params.id);
        console.log(transferIssuePhase);
        redirect('/');  
    } catch (error) {
        redirect('/');  
    }

}

export default Page;
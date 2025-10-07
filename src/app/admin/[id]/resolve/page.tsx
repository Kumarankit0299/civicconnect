import IssueCard from "@/components/cards/IssueCard";
import {  resolveIssue, updateIssuePhase } from "@/lib/actions/issue.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page({ params }: { params: { id: string } }) {
    const user = await currentUser();
    if (!user) return null; // to avoid typescript warnings

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.isAdmin) redirect("/");

    // const issue = await fetchIssueById(params.id);
    try {
        const resolved = await resolveIssue(params.id);
        redirect('/resolved-issues');  
    } catch (error) {
        redirect('/');  
    }

}

export default Page;
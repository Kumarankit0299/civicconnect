"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteIssue } from "@/lib/actions/issue.action";
import { DeleteIcon, Trash2 } from "lucide-react";

interface Props {
  issueId: string;
  currentUserId: string;
  reporterId: string;
  // parentId: string | null;
  isComment?: boolean;
}

function DeleteIssue({
  issueId,
  currentUserId,
  reporterId,
  // parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  console.log(currentUserId, reporterId);

  if (currentUserId !== reporterId || pathname === "/"){
    return null;
  };

  return (
    <div className="" onClick={async () => {
      await deleteIssue(JSON.parse(issueId), pathname);
      // router.push("/");
    }}>
      <Trash2  className="text-red-400 cursor-pointer hover:text-red-500" />
    </div>
  );
}

export default DeleteIssue;

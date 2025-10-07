"use client"
import Link from "next/link";
import Image from "next/image";
import { PlusIcon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { addMemberToCommunity, removeUserFromCommunity } from "@/lib/actions/community.actions";
import { useRouter } from "next/navigation";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: string;
  isMember?: boolean;
}

function ProfileHeader({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type,
  isMember,
}: Props) {
  const router = useRouter();


  const handleLeaveCommunity = async () => {
    try {
      const result = await removeUserFromCommunity({
        userId: authUserId,
        communityId: accountId
      });
      if (result?.success) {
        router.refresh();
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const handleJoinCommunity = async () => {
    try {
      const result = await addMemberToCommunity(
        {
          communityId: accountId,
          memberId: authUserId
        }
      );
      if (result) {
        router.refresh();
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }
  return (
    <div className='flex w-full flex-col justify-start'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='relative h-20 w-20 object-cover'>
            <Image
              src={imgUrl}
              alt='logo'
              fill
              className='rounded-full object-cover shadow-2xl'
            />
          </div>

          <div className='flex-1'>
            <h2 className='text-left text-heading3-bold text-light-1'>
              {name}
            </h2>
            <p className='text-base-medium text-gray-1'>@{username}</p>
          </div>
        </div>
        {accountId === authUserId && type !== "Community" && (
          <Link href='/profile/edit'>
            <div className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2'>
              <Image
                src='/assets/edit.svg'
                alt='logout'
                width={16}
                height={16}
              />
              <p className='text-light-2 max-sm:hidden'>Edit</p>
            </div>
          </Link>
        )}
        {type === "Community" && isMember && (
          <div className="flex flex-col sm:flex-row items-center  gap-4">
            <Button variant="destructive" onClick={handleLeaveCommunity}>
              <Trash2 size={16} />
              <p className='ml-2 '>Leave</p>
            </Button>
            <Link href={`/communities/${accountId}/report`}>
              <Button>
                Report Issue
              </Button>

            </Link>
          </div>
        )}
        {type === "Community" && !isMember && (
          <div className="flex flex-col gap-2">
            <Button onClick={handleJoinCommunity}>
              <PlusIcon size={16} />
              <p className='ml-2 max-sm:hidden'>Join</p>
            </Button>
            <p className="text-small-medium text-gray-1">Join to view and report issues in this community. </p>
          </div>
        )}
      </div>

      <p className='mt-6 max-w-lg text-base-regular text-light-2'>{bio}</p>

      <div className='mt-12 h-0.5 w-full bg-dark-3' />
    </div>
  );
}

export default ProfileHeader;


import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";
import { CheckCircle, Heart, MapPinned, MessageCircle, ShieldAlert } from 'lucide-react';
import DeleteIssue from "../forms/DeleteIssue";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

interface Props {
  id: string;
  currentUserId: string;
  title: string;
  description: string;
  reportDate: string;
  phase: string;
  location: string;
  voteCount: number;
  reporter: {
    name: string;
    image: string;
    username: string;
    id: string;
  };
  resolvedDate?: string | undefined;
  community: {
    _id: string;
    id: string;
    name: string;
    image: string;
  } | null;
  comments: {
    text: string;
    user: {
      id: string;
      name: string;
      image: string;
      username: string;
    }
  }[];
  isComment?: boolean;
  commentCount: string;
  image?: string;
  isAdmin?: boolean;
  adminType?: string;
  userInfo?: any;
}

function IssueCard({
  id,
  currentUserId,
  title,
  description,
  reportDate,
  phase,
  location,
  voteCount,
  reporter,
  community,
  resolvedDate,
  comments,
  isComment,
  commentCount,
  image,
  isAdmin,
  adminType,
  userInfo
}: Props) {
  // const router = useRouter();
  // const handlePhaseChange = async() => {

  // }
  let phasevalue;
  if (phase === 'municipal') {
    phasevalue = 20;
  }
  else if (phase === 'district') {
    phasevalue = 40;
  }
  else if (phase === 'state') {
    phasevalue = 60;
  }
  else if (phase === 'national') {
    phasevalue = 80;
  }
  else if (phase === 'resolved') {
    phasevalue = 100;
  }

  console.log({image})
  return (
    <article
      className="flex w-full relative flex-col rounded-xl bg-dark-2 p-7">
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link href={`/profile/${reporter.id}`} className='relative h-11 w-11 '>
              <Image
                src={reporter.image}
                alt='user_community_image'
                fill
                className='cursor-pointer rounded-full border-primary-500 border-2'
              />
            </Link>

            <div className='thread-card_bar' />
          </div>

          <div className='flex w-full flex-col'>
            <div className="flex justify-between items-center">
              <Link href={`/profile/${reporter.id}`} className='w-fit'>
                <h4 className='cursor-pointer text-base-semibold flex gap-2 text-light-1'>
                  {reporter.name}

                  <span className="text-sm md:text-normal text-gray-1">@{reporter.username}</span>
                </h4>
              </Link>

              <p className='hidden md:block mr-8 text-subtle-medium text-gray-1'>{formatDateString(reportDate)}</p>
            </div>


            <p className='mt-2 text-heading3-semibold text-red-400'>{title}</p>
            <p className='mt-2 text-small-regular text-light-2'>{description}</p>

            {
              image && (
                <div className='flex mt-4 items-center justify-start w-full h-full'>
                  <Image
                    src={image}
                    alt='issue_image'
                    width={400}
                    height={400}
                    className='rounded-lg object-cover'
                  />
                </div>
              )
            }

            <div className={` mt-5 sm:mt-8 flex flex-col gap-3`}>
              <div className='flex flex-col md:flex-row md:items-center justify-between'>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1 ">
                    <Heart size={20} className="text-gray-1 cursor-pointer" />
                    <span className='text-small text-gray-1'>{voteCount}</span>
                  </div>
                  <Link href={`/issue/${id}`} className="flex items-center gap-1 ">
                    <MessageCircle size={20} className='cursor-pointer text-gray-1' />
                    <span className='text-small text-gray-1'>{commentCount}</span>
                  </Link>
                </div>
                <div className="mt-4 flex  items-center gap-4">
                  <div className="flex items-center gap-4 md:flex-row">
                    <p className="text-small-regular text-light-1 ">Progress Level : </p>
                    <div className="flex flex-col justify-center items-center gap-2">
                      <Progress value={phasevalue} className="w-20 md:w-32 bg-red-200" />
                      {phase !== 'resolved' &&
                        <p className="text-small-regular text-light-1">{phase.toUpperCase()} LEVEL</p>
                      }
                    </div>
                  </div>

                  {phase === 'resolved' ? (
                    <div>
                      <div className="flex  items-center gap-2">
                        <CheckCircle className="text-green-200" size={20} />
                        <p className=' md:hidden text-small-regular text-white'>Resolved</p>
                        <p className='hidden md:block text-small-regular text-white'>Resolved on</p>
                        <span className='hidden md:block text-small-regular text-gray-1'>{formatDateString(resolvedDate ?? '')}</span>
                      </div>

                    </div>

                  ) : (
                    <div className="flex gap-10">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="text-yellow-200" />
                        <p className='text-subtle-medium text-white'>Pending</p>

                  </div>
                      {
                        isAdmin && (
                          <div className="flex gap-4 items-center">
                            <Link href={`/admin/${id}/resolve`} className="flex items-center gap-2">
                              <Button>Resolve</Button>
                            </Link>
                            <Link href={`/admin/${id}/transfer`} className="flex items-center gap-2">
                              <Button variant="secondary">Transfer</Button>
                            </Link>
                          </div>
                        )
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>


        <DeleteIssue
          issueId={JSON.stringify(id)}
          currentUserId={currentUserId}
          reporterId={reporter.id}
          isComment={isComment}
        />
      </div>

      {!isComment && comments.length > 0 && (
        <div className='ml-1 mt-3 flex items-center gap-2'>
          {comments.slice(0, 2).map((comment, index: number) => (
            <Image
              key={index}
              src={comment.user.image}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}

          <Link href={`/issue/${id}`}>
            <p className='mt-1 text-subtle-medium text-gray-1'>
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {!isComment && community && (
        <Link
          href={`/communities/${community._id}`}
          className='mt-5 flex items-center'
        >
          <Image
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
            className='ml-1 rounded-full object-cover'
          />
          <span className="ml-2 text-subtle-medium ">{community.name}</span>
        </Link>
      )}
      <div className="justify-end flex md:justify-between">

        <div className="hidden md:flex my-2 justify-between left-2">
          <div className="">
            <span className="text-subtle-medium text-gray-1">Application no.: </span>
            <span className="text-subtle-medium text-gray-1">{id}</span>
          </div>
        </div>

        <div className="flex ml-10 items-center gap-2 ">
          <MapPinned size={15} className="text-gray-1" />
          <p className='text-subtle-medium text-gray-1'>{location}</p>
        </div>
      </div>
    </article>
  );
}

export default IssueCard;

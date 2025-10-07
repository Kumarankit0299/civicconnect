import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  id: string;
  currentUserId: string;
  text: string;
  user: {
    id: string;
    name: string;
    image: string;
    username: string;
  },
  // name: string;
  // image: string;
  // username: string;
  createdAt: string,
}

function CommentCard({
  id,
  currentUserId,
  text,
  user,
  createdAt,
  // name,
  // image,
  // username
}: Props) {
  return (
    <article
      className={`flex w-full relative flex-col rounded-xl px-0 xs:px-7`}
    >
      <p className='absolute top-2 right-2 text-subtle-medium text-gray-1'>{formatDateString(createdAt)}</p>
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4 p-2 rounded-full'>
          <div className='flex flex-col items-center'>
            <Link href={`/profile/${user.image}`} className='relative h-11 w-11 '>
              <Image
                src={user.image}
                alt='user_community_image'
                fill
                className='cursor-pointer rounded-full border-primary-500 border-2'
              />
            </Link>

            <div className='thread-card_bar' />
          </div>

          <div className='flex w-full flex-col'>
            <div className="flex justify-between items-center">
              <Link href={`/profile/${id}`} className='w-fit'>
                <h4 className='cursor-pointer text-base-semibold flex gap-2 text-light-1'>
                  {user.name}

                  <span className="text-gray-1">@{user.username}</span>
                </h4>
              </Link>
            </div>
            <p className='mb-10 text-heading3-semibold text-light-2'>{text}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default CommentCard
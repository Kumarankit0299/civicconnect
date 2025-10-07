import { suggestCommunities } from '@/lib/actions/community.actions'
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from '../ui/button';

const RightSidebar = async () => {
  const user = await currentUser();
  if (!user) return null;
  const suggestedCommunities = await suggestCommunities(user.id);
  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>
          Suggested Communities
        </h3>
        <div className='flex flex-col gap-4 mt-4'>
          {suggestedCommunities?.map((community) => (
            <div key={community.id} className='flex items-center gap-3'>
              <Image
                src={community.image}
                alt='community'
                width={40}
                height={40}
                className='w-10 h-10 rounded-full'
              />
              <div className='gap-6 flex items-center justify-between w-full'>
                <div className='flex flex-col'>
                  <h4 className='text-heading5-medium text-light-1'>{community.name} </h4>
                  <span className='text-gray-1 text-small-regular'>@{community.username}</span>
                </div>
                <Link href={`/communities/${community.id}`} className='text-body-medium text-light-1'>
                  <Button variant='default'>view</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className='flex flex-1 flex-col justify-start'>
          <h3 className='text-heading4-medium text-light-1'>

          </h3>
        </div>
      </div>
    </section>
  )
}

export default RightSidebar
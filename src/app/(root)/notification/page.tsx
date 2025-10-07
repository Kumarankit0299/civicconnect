import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser, getNotification } from "@/lib/actions/user.actions";
import { formatDateString } from "@/lib/utils";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const notification = await getNotification(userInfo._id);

  return (
    <>
      <h1 className='head-text'>Notifications</h1>

      <section className='mt-10 flex flex-col gap-5'>
        {notification.length > 0 ? (
          <>
            {notification.map((notification: any) => (
              <Link key={notification._id} href={`/issue/${notification.issueId}`}>
                {notification.user ?
                  (
                    <article className='activity-card'>
                      <Image
                        src={notification.user?.image}
                        alt='user_logo'
                        width={20}
                        height={20}
                        className='rounded-full object-cover'
                      />
                      <div className="flex justify-between items-center w-full">
                        <p className='!text-small-regular text-light-1'>
                          <span className='mr-1 text-primary-500'>
                            {notification.user?.name}
                          </span>{" "}
                          {notification.text}
                        </p>

                        <span className='text-subtle-medium text-gray-1'>
                          {formatDateString(notification.createdAt)}</span>
                      </div>
                    </article>
                  )
                  : (
                    <article className='activity-card'>
                      <div className="flex justify-between items-center w-full">
                        <p className='!text-small-regular text-light-1'>
                          {notification.text}
                        </p>

                        <span className='text-subtle-medium text-gray-1'>
                          {formatDateString(notification.createdAt)}</span>
                      </div>
                    </article>
                  )
                }

              </Link>
            ))}
          </>
        ) : (
          <p className='!text-base-regular text-light-3'>No notification yet</p>
        )}
      </section>
    </>
  );
}

export default Page;

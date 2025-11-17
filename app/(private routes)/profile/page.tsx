import Image from 'next/image';
import Link from 'next/link';
import { getMe } from '@/lib/api/serverApi';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import css from './ProfilePage.module.css';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'User profile and settings',
};

export default async function ProfilePage() {
  let user;

  try {
    user = await getMe();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    user = null;
  }

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>My Profile</h1>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || '/default-avatar.png'}
            alt={`${user.username}'s avatar`}
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <p>Username: {user.username}</p>
          </div>
          <p>Email: {user.email}</p>
        </div>

        <Link href="/profile/edit" className={css.editProfileButton}>
          Edit Profile
        </Link>
      </div>
    </main>
  );
}

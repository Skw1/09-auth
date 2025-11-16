'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import css from './ProfilePage.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { getMe } from '@/lib/api/clientApi';

const ProfilePage = () => {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      getMe()
        .then(setUser)
        .catch(() => {});
    }
  }, [user, setUser]);

  if (!user) return <p>Loading...</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile</h1>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <p>Username: {user.username}</p>
          </div>
          <p>Email: {user.email}</p>
        </div>

        <button onClick={() => router.push('/profile/edit')} className={css.editProfileButton}>
          Edit
        </button>
      </div>
    </main>
  );
};

export default ProfilePage;

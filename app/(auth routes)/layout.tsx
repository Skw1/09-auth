'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, [router]);

  return <>{children}</>;
};

export default AuthLayout;

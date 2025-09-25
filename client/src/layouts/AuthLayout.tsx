import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
}: AuthLayoutProps) => {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="rounded shadow-md p-8 w-full max-w-md">{children}</div>
    </main>
  );
};

export default AuthLayout;

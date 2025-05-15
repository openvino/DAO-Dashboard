import Header from '@/src/components/ui/Header';
import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error: any = useRouteError();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-y-4">
      <Header level={1} className="text-xl">
        An unexpected error has occurred
      </Header>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
};

export default ErrorPage;

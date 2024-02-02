import Forbidden from '@modules/permissions/components/pages/Forbidden';
import { NextPage } from 'next';

const ForbiddenPage: NextPage = () => {
  return (
    <>
      <Forbidden />
    </>
  );
};

export default ForbiddenPage;

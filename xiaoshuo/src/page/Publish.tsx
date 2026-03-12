import { useSelector } from 'react-redux';
import AuthorPublish from '../components/AuthorPublish';
import AuthorCertification from '../components/AuthorCertification';
import { ROLE_NAME } from '../constants/role';
import React from 'react';
import { RootState } from '../store';

export default function Publish() {
  const roles = useSelector((state: RootState) => state?.auth?.userInfo?.roles);
  // const permissions = useSelector(state => state.auth.permissions);

  // 判断是否是作者
  const isAuthor = roles?.includes(ROLE_NAME.AUTHOR);
  return (
    <div>
      {isAuthor ? (
        <AuthorPublish />
      ) : (
        <AuthorCertification />
      )}
    </div>
  );
}


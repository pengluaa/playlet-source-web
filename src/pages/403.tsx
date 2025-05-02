import { Result, Button } from 'antd';
import { GoHome } from './404';

export default function () {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={<GoHome />}
    />
  );
}

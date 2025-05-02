import { Result, Button } from 'antd';
import { Link } from 'umi';

export const GoHome = () => {
  return (
    <Link to="/">
      <Button type="primary">Back Home</Button>
    </Link>
  );
};
export default function () {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<GoHome />}
    />
  );
}

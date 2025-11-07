interface UserInfo {
  id: number;
  account: string;
  username: string;
  status: 'INACTIVE' | 'BANNED' | 'ACTIVE';
}

import ImgBg from '@/assets/images/pic_home.svg';
import styles from './index.less';

const IndexPage = () => {
  return (
    <div style={{ marginTop: 16, background: '#fff', padding: '30px 0' }}>
      <div className={styles.content}>
        <h1>WELCOME</h1>
        <p>欢迎使用管理系统</p>
        <img className={styles.bg} src={ImgBg} />
      </div>
    </div>
  );
};

export default IndexPage;

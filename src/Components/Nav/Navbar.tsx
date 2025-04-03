import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useState } from 'react';
import logo from '../../Assets/img/Frame 10.png'

export default function Navbar() {
  const [isActive, setActive] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false)

  const handleMouseEnter = () => {
    setActive(true);
  };

  const handleMouseLeave = () => {
    setActive(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${styles.sidebar} ${isActive ? styles.active : ""}`} // 클래스 추가 방식으로 변경
    >
      <div className={styles.topItem}>
        <img src={logo} alt="" width={30} className={styles.logo} />
        <div className={styles.profile}>
          {
            isLogin ?
            <span>3학년 1반 7번 김신우</span> :
            <div className={styles.auth_container}>
              <Link to="/login">로그인</Link>
              <Link to="/join">회원가입</Link>
            </div>
          }
        </div>
      </div>
      <div className={styles.menu}>
        <Link to="/" className={styles.menuItem}>🏠 메인페이지</Link>
        <Link to="/cumunity" className={styles.menuItem}>💬 커뮤니티</Link>
        <Link to="/" className={styles.menuItem}>👥 모임</Link>
        <Link to="/" className={styles.menuItem}>📂 프로젝트</Link>
        <Link to="/" className={styles.menuItem}>🎓 맞춤 학습</Link>
      </div>
    </div>
  );
}
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useEffect, useState } from 'react';
import logo from '../../Assets/img/Frame 10.png'

const NavItems = [
  { path: "/", label: "🏠 메인페이지" },
  { path: "/mentor", label: "🤝 멘토멘티" },
  { path: "/club", label: "👥 동아리" },
  { path: "/projects", label: "📂 프로젝트" },
  { path: "/learning", label: "🎓 맞춤 학습" }
];


export default function Navbar() {
  const [isActive, setActive] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState(false);

  const location = useLocation();
  const navigate = useNavigate(); // 로그아웃 후 리다이렉션을 위해 추가

  // 초기 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('refreshToken');
    // token이 존재하고 비어있지 않은 경우 로그인 상태로 설정
    setIsLogin(!!token);
  }, []); // 의존성 배열에서 token 제거, 초기 렌더링 시에만 확인

  const HandleMouseEnter = () => {
    setActive(true);
  };

  const HandleMouseLeave = () => {
    setActive(false);
  };  

  const logout = () => {
    localStorage.clear();
    setIsLogin(false);
    navigate('/'); // 로그아웃 후 로그인 페이지로 리다이렉션
  };

  return (
    <div
      onMouseEnter={HandleMouseEnter}
      onMouseLeave={HandleMouseLeave}
      className={styles.sidebar} // 클래스 추가 방식으로 변경
    >
      <div className={styles.topItem}>
        <img src={logo} alt="" width={30} className={styles.logo} />
        <div className={styles.profile}>
          {
            isLogin ?
            <div>
              <span onClick={() => navigate('/mypage')}>{localStorage.getItem('name')} 님</span>
              <button className={styles.logout_button} onClick={() => logout()}>로그아웃</button>
            </div> :
            <div className={styles.auth_container}>
              <Link to="/login">로그인</Link>
              <Link to="/join">회원가입</Link>
            </div>
          }
        </div>
      </div>
      <div className={styles.menu}>
            {NavItems.map((item) => (
                <Link 
                    key={item.path} 
                    to={item.path} 
                    className={`${styles.menuItem} ${location.pathname === item.path ? styles.active : ""}`}
                >
                    {item.label}
                </Link>
            ))}
        </div>
    </div>
  );
}
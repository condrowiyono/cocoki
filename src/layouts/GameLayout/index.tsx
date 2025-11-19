import { Outlet, Link } from 'react-router-dom';
import styles from './GameLayout.module.scss';

function GameLayout() {
  return (
    <div className={styles.gamePage}>
      <div className={styles.gameHeader}>
        <Link to="/" className={styles.backButton}>
          ← Kembali ke Beranda
        </Link>
      </div>
      <Outlet />
    </div>
  );
}

export default GameLayout;

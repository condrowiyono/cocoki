import { Link } from 'react-router-dom';
import styles from './HomePage.module.scss';

function HomePage() {
  const games = [
    {
      id: 1,
      title: 'Cocokkan Gambar ke Teks',
      description: 'Cocokkan gambar dengan kata yang sesuai',
      path: '/connect-picture-to-text',
      icon: '🖼️',
    },
    {
      id: 2,
      title: 'Belajar Menulis',
      description: 'Belajar menulis huruf dan angka dengan menelusuri',
      path: '/letter-tracing',
      icon: '✏️',
    },
    // More games will be added here later
  ];

  return (
    <div className={styles.homePage}>
      <h1 className={styles.homeTitle}>Aktivitas Bermain Anak</h1>
      <p className={styles.homeSubtitle}>Pilih aktivitas untuk mulai bermain!</p>

      <div className={styles.gamesGrid}>
        {games.map((game) => (
          <Link
            key={game.id}
            to={game.path}
            className={styles.gameCard}
          >
            <div className={styles.gameIcon}>{game.icon}</div>
            <h2 className={styles.gameTitle}>{game.title}</h2>
            <p className={styles.gameDescription}>{game.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;

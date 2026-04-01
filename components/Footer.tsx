import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <p>&copy; {currentYear} yangyu‘s blog. All rights reserved.</p>
          <p>
            Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js
            </a>{" "}
            and{" "}
            <a href="https://hexo.io" target="_blank" rel="noopener noreferrer">
              Hexo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">Tonal Field</span>
          <span className="footer-note">Legal pages are draft placeholders.</span>
        </div>
        <nav className="footer-links" aria-label="Legal">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/license">License</Link>
          <Link href="/legal">Legal</Link>
        </nav>
      </div>
    </footer>
  );
}

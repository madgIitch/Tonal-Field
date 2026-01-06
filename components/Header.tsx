import Link from "next/link";

export function Header() {
  return (
    <header className="header">
      <div className="logo-group">
        <img
          src="/icon.png"
          alt=""
          aria-hidden
          style={{ width: "24px", height: "24px", flexShrink: 0 }}
        />
        <Link className="logo" href="/">
          Tonal Field
        </Link>
        <span className="logo-pill">MVP</span>
      </div>
      <nav className="nav">
        <Link href="/">Home</Link>
        <Link href="/system">System</Link>
        <Link href="/studio">Studio</Link>
        <Link href="/community">Community</Link>
        <Link href="/pricing">Plans</Link>
      </nav>
      <div className="header-actions">
        <Link className="nav-cta" href="/pricing">
          Upgrade
        </Link>
      </div>
    </header>
  );
}

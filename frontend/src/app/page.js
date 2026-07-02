import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <div className="form-card" style={{ textAlign: 'center', alignItems: 'center' }}>
        <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>NexTube</h1>
        <p className="subtitle" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
          A premium full-stack video platform experience.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <Link href="/register" className="btn" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
            Go to Register
          </Link>
          
          <p style={{ fontSize: '0.85rem', color: '#8f8f8f', marginTop: '1rem' }}>
            Backend API: <code style={{ color: '#ededed' }}>http://localhost:8000/api/v1</code>
          </p>
        </div>
      </div>
    </div>
  );
}

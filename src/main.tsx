import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure OpenGraph and Twitter images use the full absolute URL for social crawlers (WhatsApp, iMessage, etc.)
if (typeof window !== 'undefined') {
  try {
    const origin = window.location.origin;
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && !ogImage.getAttribute('content')?.startsWith('http')) {
      ogImage.setAttribute('content', `${origin}/og-preview.png`);
    }
    const ogSecure = document.querySelector('meta[property="og:image:secure_url"]');
    if (ogSecure && !ogSecure.getAttribute('content')?.startsWith('http')) {
      ogSecure.setAttribute('content', `${origin}/og-preview.png`);
    }
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage && !twitterImage.getAttribute('content')?.startsWith('http')) {
      twitterImage.setAttribute('content', `${origin}/og-preview.png`);
    }
  } catch (err) {
    console.warn('Metadata origin resolution skipped:', err);
  }
}

createRoot(document.getElementById('root')!).render(<App />);

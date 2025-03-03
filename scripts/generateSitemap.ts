import 'dotenv/config';
import fs from 'fs';
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

const siteUrl = 'https://gptz.directory';

async function generateSitemap() {
    console.log('Fetching tool IDs from Firebase...');

    try {
        const querySnapshot = await getDocs(collection(db, 'gpts_live'));
        const toolIds = querySnapshot.docs.map((doc) => doc.id);

        const staticPages = ['/', '/submit'];

        const urls = [
            ...staticPages.map((page) => `${siteUrl}${page}`),
            ...toolIds.map((toolId) => `${siteUrl}/gpt/${toolId}`),
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
                .map(
                    (url) => `
  <url>
    <loc>${url}</loc>
    <priority>0.80</priority>
  </url>`
                )
                .join('')}
</urlset>`;

        fs.writeFileSync('public/sitemap.xml', sitemap);
        console.log('✅ Sitemap generated successfully!');
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
    }
}

generateSitemap();

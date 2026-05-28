import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { Lato } from 'next/font/google'
import styles from './home.module.css'

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export default function Home() {
  return (
    <div className={`${styles.page} ${lato.className}`}>

      {/* ── Falling stars background ── */}
      <div className={styles.stars}>
        <div className={styles.star} />
        <div className={styles.star} />
        <div className={styles.star} />
        <div className={styles.star} />
        <div className={styles.star} />
        <div className={styles.star} />
        <div className={styles.star} />
        <div className={styles.star} />
        <div className={styles.star} />
        <div className={styles.star} />
      </div>

      <main className={styles.main}>

        {/* Logo */}
        <div className={styles.fadeInDown} style={{ textAlign: 'center', paddingTop: '40px' }}>
          <Image
            src="/MoMP.png"
            alt="The Museum of Magical Phenomena"
            width={1522}
            height={637}
            priority
            style={{ filter: 'invert(1)', maxWidth: '600px', width: '100%', height: 'auto', margin: '0 auto' }}
          />
        </div>

        {/* ── Enter Museum CTA ── */}
        <div style={{ textAlign: 'center', marginTop: '32px', marginBottom: '20px' }}>
          <Link href="/room-a" className={styles.enterButton}>
            ➜ Enter the (WIP) virtual museum
          </Link>
        </div>

        

        {/* ── Roadmap ── */}
        <div className={styles.container} style={{ marginTop: '60px' }}>
          <h3>Roadmap</h3>

          {/* Desktop breadcrumb row */}
          <div
            className={styles.hideonmobile}
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            <div
              className={styles.breadcrumb}
              style={{ maxWidth: '200px', background: '#7c6490' }}
            >
              <em>Phase 1:</em>
              <br />
              Construct a virtual museum that serves as a proof-of-concept for a real museum to be
              created at a later date.
            </div>
            <div className={styles.breadcrumb} style={{ maxWidth: '300px' }}>
              <em>Phase 2:</em>
              <br />
              A traveling pop-up exhibit. A small version of the in-person experience that can be
              easily transported and presented at existing museums as a temporary exhibit.
            </div>
            <div className={styles.breadcrumb} style={{ maxWidth: '300px' }}>
              <em>Phase 3:</em>
              <br />
              A permanent museum, providing the complete experience, including several interactive,
              haptic, and sensory experiences, as well as complimentary souvenirs.
            </div>
          </div>

          {/* Mobile roadmap text */}
          <div className={styles.hideondesktop}>
            <p>
              <em>Phase 1:</em> Construct a virtual museum that serves as a proof-of-concept for a
              real museum to be created at a later date.
            </p>
            <p>
              <em>Phase 2:</em> A traveling pop-up exhibit. A small version of the in-person
              experience that can be easily transported and presented at existing museums as a
              temporary exhibit.
            </p>
            <p>
              <em>Phase 3:</em> A permanent museum, providing the complete experience, including
              several interactive, haptic, and sensory experiences, as well as complimentary
              souvenirs. Location is still to be determined.
            </p>
          </div>

          <br />
          <p>
            <a
              className={styles.button}
              href="https://forms.gle/4E79fNvAYKkPkiB88"
              target="_blank"
              rel="noopener noreferrer"
            >
              Become a volunteer!
            </a>
          </p>
        </div>

        {/* ── About the museum ── */}
        <div className={styles.container} style={{ marginTop: '60px' }}>
          <h3>About the museum</h3>
          <p>
            <em>What counts as magical phenomena?</em> Forces that are invisible to the naked eye
            are generally considered to be magical, and we expand on this to include prophecy and
            communication with animals.
          </p><br></br>
          <p>
            <em>Planned Exhibits:</em>
          </p>
          <ul>
            <li>• Art Hall</li>
            <li>• Persistent Mysteries</li>
            <li>• Magical Phenomena in Nature</li>
            <li>• Magical Phenomena in Technology</li>
            <li>• Magic Types and Systems in Fictional Media</li>
            <li>• Occupational History</li>
            <li>• Intersections with Religion and Folklore</li>
            <li>• Rethink the Limit: Chamber of Inspiration</li>
            <li>• Wish Room: Dress-up area + paper star station</li>
          </ul>
          <br /><br></br>
          <p>Want to help curate the exhibits?&nbsp; &nbsp; &nbsp; 
            <a
              className={styles.button}
              href="https://forms.gle/4E79fNvAYKkPkiB88"
              target="_blank"
              rel="noopener noreferrer"
            >
              Become a volunteer!
            </a>
          </p>
        </div>

        {/* ── Subscribe ── */}
        <div className={styles.container} style={{ marginTop: '60px' }}>
          <h3>Subscribe to updates</h3>
          <iframe
            data-w-type="embedded"
            frameBorder={0}
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src="https://13q83.mjt.lu/wgt/13q83/0n61/form?c=19cf8636"
            width="100%"
            style={{ height: 0 }}
          />
          <Script
            src="https://app.mailjet.com/pas-nc-embedded-v2.js"
            strategy="afterInteractive"
          />
        </div>

        {/* ── Footer ── */}
        <div className={styles.container} style={{ marginTop: '60px' }}>
          <p>
            Copyright © 2026 The Museum of Magical Phenomena. All rights reserved.
            <br />
            This site does not use cookies.
            <br />
            Falling stars effect by{' '}
            <a href="https://codepen.io/alphardex" target="_blank" rel="noopener noreferrer">
              alphardex
            </a>
            .
          </p>
        </div>

      </main>
    </div>
  )
}

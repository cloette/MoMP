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

      {/* Falling stars background */}
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

        <div className={styles.container} style={{ marginTop: '60px' }}>
          <h3>About the museum</h3>
          <h2>The planet we inhabit and the universe we live in is much more &quot;magical&quot; than we might think.</h2>

          <p>
            <br></br>This museum aims to:
            </p>
            <ul>
              <li>• Renew a sense of wonder across all ages</li>
              <li>• Protect important historical media</li>
              <li>• Inspire new ways of thinking about persistent mysteries in science</li>
              <li>• Build familiarity with how the technology we use today actually works</li>
              <li>• Highlight common threads across cultures (regarding these phenomena)</li>
            </ul>
<p>
            <br></br>
            <em>What counts as magical phenomena?</em> Forces / mechanisms that are invisible to the naked eye. The list below is not exhaustive, but covers many of the phenomena we plan to explore in the museum. <br />
            <br></br>
            </p>
            <div style={{maxWidth: '100%', overflowX: 'auto'}}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td>Telekinesis</td>
                  <td>Healing</td>
                  <td>Illusion</td>
                  <td>Invisibility</td>
                </tr>
                <tr>
                  <td>Telepathy</td>
                  <td>Revival</td>
                  <td>Hypnotism</td>
                  <td>Shapeshifting</td>
                </tr>
                <tr>
                  <td>Teleportation</td>
                  <td>Growth</td>
                  <td>Time manipulation</td>
                  <td>Flight</td>
                </tr>
                <tr>
                  <td>Search</td>
                  <td>Summoning</td>
                  <td>Purification</td>
                  <td>Prophecy</td>
                </tr>
                <tr>
                  <td>Underwater breathing</td>
                  <td>Mind reading</td>
                  <td>Puppetry / golems</td>
                  <td>Energy transfer</td>
                </tr>
                <tr>
                  <td>Harden / Barrier / Strengthening </td>
                  <td>Gigantify / Minify</td>
                  <td>Reveal (enhanced vision)</td>
                  <td>Alchemy / Transmutation </td>
                </tr>
                <tr>
                  <td>Memory storage / transfer / display / manipulation</td>
                  <td>Movement of elements (earth / fire / water / ice / air / lightning / metal / plants)</td>
                  <td>Communication with animals (at a complex level)</td>
                  <td>Induce paralysis / blind / bind / sleep</td>
                </tr>
              </tbody>
            </table>
            </div>
            <br />
            <p>Note: Several of these phenomena do NOT have a real-life equivalent; we use <Link href="https://docs.google.com/spreadsheets/d/1yox81e1Y4y29dJWvztrAD3K3_6Sw17m87RjuGD3CLT0/edit?usp=sharing" target="_blank">
            this document</Link> to track our research and determine inclusion into the exhibits.</p>
          <br></br>
          <p>
            <em>Planned Exhibits:</em>
          </p>
          <ul>
            <li>• Art Hall</li>
            <li>• Persistent Mysteries</li>
            <li>• Magical Phenomena in Nature</li>
            <li>• Magical Phenomena in Technology</li>
            <li>• Occupational History</li>
            <li>• Echoes Across Cultures</li>
            <li>• Unique Magic Systems in Fictional Media</li>
            <li>• Rethink the Limit: Chamber of Inspiration</li>
            <li>• Wish Room: Dress-up area + paper star station</li>
          </ul>
          <br /><br></br>
          <p>Want to help curate the exhibits? <br /><br />
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

        {/* Roadmap */}
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

        {/* Enter Museum */}
        <div style={{ textAlign: 'center', marginTop: '32px', marginBottom: '20px' }}>
          <Link href="/lobby" className={styles.enterButton}>
            ➜ Enter the POC virtual museum
          </Link>
        </div>

        {/* Enter Museum */}
        <div style={{ textAlign: 'center', marginTop: '32px', marginBottom: '20px' }}>
          <Link href="https://docs.google.com/spreadsheets/d/1yox81e1Y4y29dJWvztrAD3K3_6Sw17m87RjuGD3CLT0/edit?usp=sharing" target="_blank" className={styles.enterButton}>
            🔎 Transparency: Scientific Research
          </Link>
        </div>

        {/* Subscribe */}
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

        {/* Footer */}
        <div className={styles.container} style={{ marginTop: '60px' }}>
          <p>
            Copyright © 2026 The Museum of Magical Phenomena. All rights reserved.
            <br />
            This site does not use cookies. In the virtual museum, we do use local storage to save your progress, but this data is stored only on your device and is not shared with any third parties.
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

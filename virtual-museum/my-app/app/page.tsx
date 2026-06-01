'use client'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { Lato } from 'next/font/google'
import styles from './home.module.css'
import { useLanguage } from './contexts/LanguageContext'
import { LanguageSwitcher } from './components/LanguageSwitcher'

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export default function Home() {
  const { t } = useLanguage()

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

        {/* Logo + language switcher */}
        <div className={styles.fadeInDown} style={{ textAlign: 'center', paddingTop: '40px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0 }}>
            <LanguageSwitcher />
          </div>
          <Image
            src="/MoMP.png"
            alt="The Museum of Magical Phenomena"
            width={1522}
            height={637}
            priority
            style={{ filter: 'invert(1)', maxWidth: '600px', width: '100%', height: 'auto', margin: '0 auto' }}
          />
        </div>

        {/* Roadmap */}
        <div className={styles.container} style={{ marginTop: '60px' }}>
          <h3>{t('home.roadmapTitle')}</h3>

          {/* Desktop breadcrumb row */}
          <div
            className={styles.hideonmobile}
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            <div
              className={styles.breadcrumb}
              style={{ maxWidth: '200px', background: '#7c6490' }}
            >
              <em>{t('home.phase1Label')}</em>
              <br />
              {t('home.phase1Desc')}
            </div>
            <div className={styles.breadcrumb} style={{ maxWidth: '300px' }}>
              <em>{t('home.phase2Label')}</em>
              <br />
              {t('home.phase2Desc')}
            </div>
            <div className={styles.breadcrumb} style={{ maxWidth: '300px' }}>
              <em>{t('home.phase3Label')}</em>
              <br />
              {t('home.phase3DescDesktop')}
            </div>
          </div>

          {/* Mobile roadmap text */}
          <div className={styles.hideondesktop}>
            <p>
              <em>{t('home.phase1Label')}</em> {t('home.phase1Desc')}
            </p>
            <p>
              <em>{t('home.phase2Label')}</em> {t('home.phase2Desc')}
            </p>
            <p>
              <em>{t('home.phase3Label')}</em> {t('home.phase3DescMobile')}
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
              {t('home.becomeVolunteer')}
            </a>
          </p>
        </div>

        {/* About the museum */}
        <div className={styles.container} style={{ marginTop: '60px' }}>
          <h3>{t('home.aboutTitle')}</h3>
          <p>
            <em>{t('home.whatCountsLabel')}</em> {t('home.whatCountsDesc')}
          </p><br />
          <p>
            <em>{t('home.plannedExhibitsLabel')}</em>
          </p>
          <ul>
            <li>• {t('home.exhibitArtHall')}</li>
            <li>• {t('home.exhibitPersistentMysteries')}</li>
            <li>• {t('home.exhibitNature')}</li>
            <li>• {t('home.exhibitTechnology')}</li>
            <li>• {t('home.exhibitFictionalMedia')}</li>
            <li>• {t('home.exhibitOccupationalHistory')}</li>
            <li>• {t('home.exhibitReligionFolklore')}</li>
            <li>• {t('home.exhibitChamberOfInspiration')}</li>
            <li>• {t('home.exhibitWishRoom')}</li>
          </ul>
          <br /><br />
          <p>{t('home.wantToHelp')} <br /><br />
            <a
              className={styles.button}
              href="https://forms.gle/4E79fNvAYKkPkiB88"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('home.becomeVolunteer')}
            </a>
          </p>
        </div>

        {/* Enter Museum */}
        <div style={{ textAlign: 'center', marginTop: '32px', marginBottom: '20px' }}>
          <Link href="/room-a" className={styles.enterButton}>
            {t('home.enterMuseum')}
          </Link>
        </div>

        {/* Subscribe */}
        <div className={styles.container} style={{ marginTop: '60px' }}>
          <h3>{t('home.subscribeTitle')}</h3>
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
            {t('home.copyright')}
            <br />
            {t('home.noCookies')}
            <br />
            {t('home.fallingStarsCredit')}{' '}
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

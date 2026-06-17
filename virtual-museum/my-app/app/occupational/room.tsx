'use client'
import { useMemo, Suspense, useEffect, useRef } from 'react'
import { Html, useGLTF, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Door } from '../components/Door'
import { ExhibitFrame } from '../components/ExhibitFrame'
import { Curtain } from './curtain'
import { InfoPanel } from '../components/InfoPanel'
import { CategoryPlaque } from '../components/Plaque'

const FAR_Z = -18         // far end: one front doors
const BACK_Z = 18         // back end: one rear door
const W = 36
const D = 38
const H = 5.6

const EXHIBITS = {
  B1: {
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/occupational/playbills.png',
      width: 400,
      height: 200,
      alt: 'Playbills',
    },
  },
  B4: {
    title: 'Sangoma & Inyanga',
    body: 'The sangoma (diviner) and inyanga (herbalist) are the two main types of traditional healers in Southern Africa. These healers are highly revered and respected in a society where illness is thought to be caused by witchcraft, pollution (contact with impure objects or occurrences) or through neglect of the ancestors. Unlike European cunning folk who were often prosecuted, sangoma and inyanga have maintained unbroken social legitimacy throughout the colonial and post-colonial periods. Although sangoma is a Zulu term that is colloquially used to describe all types of Southern African traditional healers, there are differences between practices: an inyanga is concerned mainly with medicines made from plants and animals, while a sangoma communicates with ancestors from the spirit world to receive instruction and advice to heal illness, social disharmony and spiritual difficulties. Traditional healers are consulted by approximately 60% of the South African population, usually in conjunction with modern bio-medical services.',
    title2: 'Notable Persons: Nkunzi Zandile Nkabinde',
    body2: 'A South African sangoma, author, and LGBT activist best known for their memoir Black Bull, Ancestors and Me. After their mother died, Nkabinde was summoned to become a sangoma. Initially, they resisted until they were bombarded with voices, dreams, and other supernatural forces that urged them to give into becoming a sangoma. A woman came to them in their dream and told them to stop being stubborn because they were destined to perform this work. Nkabinde\'s abilities as a sangoma include connecting with and controlling their ancestors to manipulate herbs and cure illnesses.',
    africa: {
      type: 'image' as const,
      src: '/continents/Africa.png',
      alt: 'Africa',
      width: 130,
      height: 125,
    },
    usa: {
      type: 'image' as const,
      src: '/continents/USA.png',
      alt: 'USA',
      width: 130,
      height: 125,
    },
    egypt: {
      type: 'image' as const,
      src: '/continents/Egypt.png',
      alt: 'Egypt',
      width: 130,
      height: 125,
    },
    europe: {
      type: 'image' as const,
      src: '/continents/Europe.png',
      alt: 'Europe',
      width: 130,
      height: 125,
    },
    china: {
      type: 'image' as const,
      src: '/continents/China.png',
      alt: 'China',
      width: 100,
      height: 125,
    },
    philippines: {
      type: 'image' as const,
      src: '/continents/Philippines.png',
      alt: 'Philippines',
      width: 125,
      height: 100,
    },
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/occupational/NkabindeBook.jpg',
      alt: 'BookCover',
      width: 100,
      height: 125,
    }
  },
  B5: {
    title: 'Physician-Priests (c. 3000–332 BCE)',
    body: 'Ancient Egypt had some of the world\'s earliest documented healers organized into professional hierarchies. Ancient Egyptian medicine developed over more than two thousand years and showed how the civilisation combined practical observation with spiritual belief. From the earliest dynasties to the end of native rule under the Persians and later the Greeks, Egyptians applied a mixture of practical treatments, magical spells, and religious rites to preserve health and treat disease.',
    title2: 'Notable Persons: Hesy-Ra',
    body2: 'The earliest ever record of a male physician was Hesy-Ra in 2700 B.C.E. He was "Chief of Dentists and Doctors" to King Dioser. Hesy-Ra represents the professionalization of healing in the Old Kingdom—not a local healer but a titled court official with specialized rank.',
    title3: 'Notable Persons: Peseshet',
    body3: 'The first record of a female doctor was probably Peseshet in 2400 B.C.E., the supervisor of all female doctors, but there may have been female doctors as early as 3000 B.C.E. Temple clinics functioned as centers for medical practice, drawing upon texts like the Ebers Papyrus (a compilation of herbal knowledge) for guidance. Specialized practitioners, including the swnw (general physicians) and sau (magical healers), exemplified the integration of science and spirituality in ancient Egyptian healthcare.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/occupational/Hesy-Ra.jpg',
      alt: 'Egyptian Relief',
      width: 100,
      height: 125,
    },
    content2: {
      type: 'image' as const,
      src: '/exhibitobjects/occupational/PEbers.jpg',
      alt: 'The Ebers Papyrus',
      width: 100,
      height: 125,
    }
  },
  B6: {
    title: 'Cunning Folk (c. 1300s–1800s)',
    body: 'Within Europe, many names were given to folk-healers and magic-workers, including the Danish kloge folk ("wise folk"), the Dutch toverdokters ("magic-doctors") or duivelbanners ("devil-banners"), the Finnish and Karelian tietäjät ("knowers"), the French devins-guérisseurs ("soothsayer-healers") and leveurs de sorts ("curse-lifters"), the German Hexenmeister ("witch masters") or Kräuterhexen ("herb witches"), and the Irish bean feasa ("woman of knowledge"), banfháidh or fáidhbhean ("seeress"). This diversity of names shows how widespread the practice was across Europe, and how each culture valued these healers enough to give them distinct titles.',
    title2: 'Agnes Sampson (c. 1530–1591), Scotland',
    body2: 'Agnes was a Scottish healer and purported witch. Also known as the "Wise Wife of Keith", Sampson was executed during the North Berwick witch trials in the last decade of the 16th century. She had a wide clientele from all levels of society and was well known locally as the "Wise Wife of Keith." Sampson knew methods for healing wounds, delivering babies safely, healing man and beast, predicting storms, and counteracting the maleficent spells of witches. She was subject to extreme torture during the North Berwick witch trials, and her confessions were likely coerced.',
    title3: 'Marie-Anne Lenormand (1772–1843), France',
    body3: 'Marie-Anne gained fame as a fortune-teller and card reader, offering guidance to influential clients like Empress Josephine and French aristocracy. Today, Lenormand is best remembered for her namesake Lenormand cards, a popular divination tool still used by modern cartomancy practitioners. Lenormand represents the transition toward respectable professionalization. Unlike Agnes, Lenormand was never prosecuted, and lived openly. Her success shows how healing/divination moved from rural practice to urban commerce.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/occupational/Agnes_Sampson_and_witches_with_devil.jpg',
      alt: 'Agnes Sampson',
      width: 100,
      height: 125,
    },
    content2: {
      type: 'image' as const,
      src: '/exhibitobjects/occupational/Portrait_of_Mlle_Lenormand_from_The_Court_of_Napoleon.jpg',
      alt: 'Agnes Sampson',
      width: 100,
      height: 125,
    }
  },
  B8: {
    title: 'Indigenous Shamans & Healers',
    body: 'Indigenous American healers pre-date European contact by millennia and continue today. Unlike European cunning folk, indigenous shamanic healing persists in many communities, though often under pressure from Western medicine and colonialism. Herbs, manipulative therapies, ceremonies, and prayer are used in various combinations to prevent and treat illness. Ceremonies can involve the patient, the family, and the community in the healing process. Spiritual treatments are thus an integral part of health promotion and healing in Native American culture.',
    content: { type: 'placeholder' as const },
  },
  B7: {
    title: 'Stambali: Possession Rite',
    body: 'Stambali (or stambeli) is both a music genre and a music based therapeutic possession rite practiced in parts of Tunisia, primarily by people of slave descent. It combines music, dances and songs. During the music, some participants enter into a trance and embody supernatural entities, as a form of adorcism. Stambali shows how spiritual practices survive diaspora and adapt to new religious contexts. It bridges African, Islamic, and local Tunisian traditions, and shows that these roles transcend single religious frameworks. ',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/occupational/Stambali_au_mouled.jpg',
      alt: 'Stambali',
      width: 200,
      height: 105,
    },
  },
  B3: {
    title: 'Lector Priests: Keepers of Sacred Words',
    body: 'A lector priest was a priest in ancient Egypt who recited spells and hymns during temple rituals and official ceremonies. Such priests also sold their services to laymen, reciting texts during private apotropaic rituals or at funerals. As such, they were some of the most prominent practitioners of "magic" (heku) in ancient Egypt.',
    title2: 'Why they mattered',
    body2: 'Practicing magic in ancient Egypt required reliance on the written word, so magicians had to be literate. Most magicians belonged to the ranks of the priesthood, and bore titles such as "Prophet of Heka," "Chief of Secrets," or "Lector Priest." The manuals necessary for the practice of magic, consisting of compilations of spells and instructions on their use, were composed, compiled, and stored in the temple scriptorium called the "House of Life." The Egyptians believed that hieroglyphs (Medju-Netjer or "Words of God") were inherently magical. Thoth, as their inventor, was the ultimate patron of all ritualists. When a lector priest (Kher-Heb) read from a sacred papyrus, he was acting as Thoth on earth. He wasn\'t just reading; he was speaking creation into effect, using the divine words Thoth had recorded.',
    lectorpriest: {
      type: 'image' as const,
      src: '/exhibitobjects/occupational/Stela_of_the_lector_priest.jpg',
      alt: 'Lector Priest',
      width: 100,
      height: 125,
    },
  },
  B2: {
    title: 'Spirit Mediums & Daoist Priests',
    body: 'Chinese spirit possession is a practice performed by specialists across China and Taiwan, and encompasses a broad category of shamanism called jitong (a type of shaman) in Taiwan, or shentong in Wenzhou, involving the channeling of Chinese deities who are invited to take control of the specialist\'s body, resulting in noticeable changes in body functions and behaviour. The State of Qi had shamans who claimed to be possessed by gods, and they were criticized as heterodox by Confucians. Movements by shamans practicing spiritual possession often led peasant rebellions against the ruling dynasty during Chinese history. The Boxer Rebellion was one of these movements.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/occupational/Daoist_Robe.jpg',
      alt: 'Robe of a Daoist Priest',
      width: 150,
      height: 100,
    },
  },
  B9: {
    title: 'Christian Priests',
    body: 'Christian priests occupied the same social niche as non-Christian spiritual intermediaries, mediating between earthly and divine realms. Yet their role was often positioned as opposed to folk healers and cunning folk. In Christianity, exorcism involves the practice of casting out one or more demons from a person whom they believe to have been possessed by demons. The person performing the exorcism, known as an exorcist, is often a member of the Christian Church, or an individual thought to be graced with special powers or skills. The exorcist may use prayers and religious material, such as set formulas, gestures, symbols, icons, or amulets. The Benedictine formula Vade retro satana has been used since the medieval era. Since at least the third century, the Latin Church has formally ordained men to the minor order of exorcist. Eusebius (3rd century) and Augustine (4th century) provide details of these minor exorcisms.',
  title2: 'Wise Women, and Cunning Folk',
    body2: 'Many cunning folk practices reflected pre-Christian, shamanic traditions that survived Christianization. Their use of charms, protective objects, and spirit communication paralleled (and sometimes incorporated) Christian sacramentals. Women were often more likely to be accused of witchcraft, and many of the most famous and respected cunning folk were women. In many cultures, women were seen as having a closer connection to the natural world and to the spiritual realm.',
  },
  B10: {
    title: 'Filipino Shamans: Babaylan',
    body: 'The babaylan represent another tradition of spirit mediumship independent from both African and European frameworks. Babaylan were believed to have spirit guides, by which they could contact and interact with the spirits and deities (anito or diwata) and the spirit world. Their primary role was to be mediums during pag-anito séance rituals. There were also various subtypes of babaylan specializing in the arts of healing and herbalism, divination, and sorcery.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/occupational/An_Itneg_shaman.jpg',
      alt: 'Image of an Itneg shaman performing a ritual',
      width: 150,
      height: 100,
    },
  },
}

interface RoomProps {
  nearDoor: boolean
  onNavigate: (route: string) => void
}

export function Room({ nearDoor, onNavigate }: RoomProps) {
  const cubeRef2 = useRef<THREE.Mesh>(null)
  const cubeRef = useRef<THREE.Mesh>(null)

  return (
    <group>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#6d0400" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#970500" />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, H / 2, -D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#230200" />
      </mesh>
      {/* Front wall */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, H / 2, D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#230200" />
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#230200" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-16 / 2, H / 2, 12]}>
        <planeGeometry args={[D / 2, H]} />
        <meshStandardMaterial color="#230200" />
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#230200" />
      </mesh>

      {/* Baseboards */}
      <mesh position={[0, 5.48, -D / 2 + 0.04]}>
        <boxGeometry args={[W, 0.16, 0.04]} />
        <meshStandardMaterial color="#ffef94" />
      </mesh>
      <mesh position={[0, 5.48, D / 2 - 0.04]}>
        <boxGeometry args={[W, 0.16, 0.04]} />
        <meshStandardMaterial color="#ffef94" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2 + 0.04, 5.48, 0]}>
        <boxGeometry args={[D, 0.16, 0.04]} />
        <meshStandardMaterial color="#ffef94" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[W / 2 - 0.04, 5.48, 0]}>
        <boxGeometry args={[D, 0.16, 0.04]} />
        <meshStandardMaterial color="#ffef94" />
      </mesh>

      {/* ── LIGHTING ────────────────────────────────────────────── */}

      <ambientLight intensity={0.65} />
      <directionalLight position={[0, H - 0.2, 0]} intensity={0.95} color="#fffef8" />

      <mesh ref={cubeRef2} position={[-6, 2.7, 8]}>
        <boxGeometry args={[6, .5, .5]} />
        <meshStandardMaterial
          color={"#9e0500"}
          roughness={0}
          metalness={0.25}
        />
      </mesh>

      <mesh ref={cubeRef} position={[-6, 0, 8]}>
        <boxGeometry args={[6, 5, .5]} />
        <meshStandardMaterial
          color={"#fff"}
          roughness={0}
          metalness={0.25}
        />
        <group position={[1.9, 1.5, 0]} rotation={[0, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.55, 0.75, 0.015]} />
            <meshStandardMaterial color="#570300" roughness={0.8} />
          </mesh>
          <Html center transform distanceFactor={5}>
            <div
              style={{
                width: '510px',
                padding: '10px 14px',
                fontFamily: 'Times New Roman, serif',
                textAlign: 'left',
                pointerEvents: 'none',
                userSelect: 'none',
                maxWidth: '520px',
                zIndex: 1,
              }}
            >
              <div style={{ fontSize: '20px', color: '#570300', lineHeight: .5 }}>
                {'Magic as an '}
              </div>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '60px',
                  marginBottom: '5px',
                  color: '#0c0c0c',
                  letterSpacing: '0em',
                  fontStyle: 'italic',
                  marginLeft: '20px',
                }}
              >
                {'Occupation'}
              </div>
            </div>
          </Html>
        </group>
      </mesh>

      <CategoryPlaque label="Healers & Diagnoisticians" width={3} position={[10, 5, -17]} rotation={[0, 0, 0]} color="#ffef94" />
      <CategoryPlaque label="Spiritual Intermediaries & Ritual Specialists" width={6} position={[-10, 5, -17]} rotation={[0, 0, 0]} color="#ffef94" />

      <ExhibitFrame
        position={[17, 2.5, -7]}
        rotation={[0, -Math.PI / 2, 0]}
        content={EXHIBITS.B4.europe}
      />

      <ExhibitFrame
        position={[15.97, 2.5, -18]}
        rotation={[0, 0, 0]}
        content={EXHIBITS.B4.egypt}
      />

      <ExhibitFrame
        position={[17.97, 4, 10.5]}
        rotation={[0, -Math.PI / 2, 0]}
        content={EXHIBITS.B4.usa}
      />

      <ExhibitFrame
        position={[4.2, 2.5, -17.5]}
        rotation={[0, 0, 0]}
        content={EXHIBITS.B4.africa}
      />


      <ExhibitFrame
        position={[-7.10, 2.5, 14.5]}
        rotation={[0, Math.PI / 2, 0]}
        width={6}
        height={3}
        content={EXHIBITS.B1.content} />

      <InfoPanel
        position={[7, 2, -17.3]}
        rotation={[0, 0, 0]}
        title={EXHIBITS.B4.title}
        body={EXHIBITS.B4.body}
        color={'#fffddd'} />
      <ExhibitFrame
        position={[9.6, 2.5, -17.3]}
        rotation={[0, 0, 0]}
        width={1.5}
        height={1.8}
        content={EXHIBITS.B4.content}
      />
      <InfoPanel
        position={[12.3, 1, -17.3]}
        rotation={[0, 0, 0]}
        title={EXHIBITS.B4.title2}
        body={EXHIBITS.B4.body2}
        color={'#ffdedd'} />

      <InfoPanel position={[17.97, 2.3, -16.9]}
        rotation={[0, -Math.PI / 2, 0]}
        title={EXHIBITS.B5.title}
        body={EXHIBITS.B5.body}
        color={'#fffddd'} />
      <ExhibitFrame
        position={[17.9, 1, -16.9]}
        rotation={[0, -Math.PI / 2, 0]}
        content={EXHIBITS.B5.content}
        width={1.5}
        height={1.8}
      />
      <InfoPanel position={[17.95, -.3, -14.4]}
        rotation={[0, -Math.PI / 2, 0]}
        title={EXHIBITS.B5.title2}
        body={EXHIBITS.B5.body2}
        color={'#ffdedd'} />
      <ExhibitFrame
        position={[17.96, 3, -13.6]}
        rotation={[0, -Math.PI / 2, 0]}
        content={EXHIBITS.B5.content2}
        width={1.5}
        height={1.8}
      />
      <InfoPanel position={[17.96, 1.3, -11]}
        rotation={[0, -Math.PI / 2, 0]}
        title={EXHIBITS.B5.title3}
        body={EXHIBITS.B5.body3}
        color={'#ffdedd'} />

      <ExhibitFrame
        position={[17.97, 2.3, -1.3]}
        rotation={[0, -Math.PI / 2, 0]}
        content={EXHIBITS.B6.content}
        width={1.5}
        height={1.8}
      />
      <ExhibitFrame
        position={[17.97, 2.3, 3.8]}
        rotation={[0, -Math.PI / 2, 0]}
        content={EXHIBITS.B6.content2}
        width={1.5}
        height={1.8}
      />
      <InfoPanel position={[17.97, 2, -4]}
        rotation={[0, -Math.PI / 2, 0]}
        title={EXHIBITS.B6.title}
        body={EXHIBITS.B6.body}
        color={'#fffddd'} />
      <InfoPanel position={[17.97, 1, 1.2]}
        rotation={[0, -Math.PI / 2, 0]}
        title={EXHIBITS.B6.title2}
        body={EXHIBITS.B6.body2}
        color={'#ffdedd'} />
      <InfoPanel position={[17.97, 1, 6.3]}
        rotation={[0, -Math.PI / 2, 0]}
        title={EXHIBITS.B6.title3}
        body={EXHIBITS.B6.body3}
        color={'#ffdedd'} />
      <InfoPanel position={[17.97, 0.7, 10.5]}
        rotation={[0, -Math.PI / 2, 0]}
        title={EXHIBITS.B8.title}
        body={EXHIBITS.B8.body}
        color={'#fffddd'} />

      <ExhibitFrame
        position={[-17.97, 2.5, -2]}
        rotation={[0, Math.PI / 2, 0]}
        content={EXHIBITS.B4.africa}
      />
      <ExhibitFrame
        position={[-17.969, 1, -5]}
        rotation={[0, Math.PI / 2, 0]}
        width={2.9}
        height={1.5}
        content={EXHIBITS.B7.content}
      />
      <InfoPanel
        position={[-17.97, 2.3, -5]}
        rotation={[0, Math.PI / 2, 0]}
        title={EXHIBITS.B7.title}
        body={EXHIBITS.B7.body}
        color={'#fffddd'} />

      <ExhibitFrame
        position={[-17.97, 2.5, 8]}
        rotation={[0, Math.PI / 2, 0]}
        content={EXHIBITS.B4.egypt}
      />
      <ExhibitFrame
        position={[-17.7, 1.24, 4]}
        rotation={[0, Math.PI / 2, 0]}
        width={1.5}
        height={1.86}
        content={EXHIBITS.B3.lectorpriest}
      />
      <InfoPanel
        position={[-17.97, 2.3, 5]}
        rotation={[0, Math.PI / 2, 0]}
        title={EXHIBITS.B3.title}
        body={EXHIBITS.B3.body}
        color={'#fffddd'} />
      <InfoPanel
        position={[-17.97, 1.5, 1.5]}
        rotation={[0, Math.PI / 2, 0]}
        title={EXHIBITS.B3.title2}
        body={EXHIBITS.B3.body2}
        color={'#fffddd'} />

      <ExhibitFrame
        position={[-17.97, 2.5, -8]}
        rotation={[0, Math.PI / 2, 0]}
        content={EXHIBITS.B4.china}
      />
      <ExhibitFrame
        position={[-17.969, .8, -11]}
        rotation={[0, Math.PI / 2, 0]}
        width={2.2}
        height={1.5}
        content={EXHIBITS.B2.content}
      />
      <InfoPanel
        position={[-17.97, 2.3, -10.9]}
        rotation={[0, Math.PI / 2, 0]}
        title={EXHIBITS.B2.title}
        body={EXHIBITS.B2.body}
        color={'#fffddd'} />

      <ExhibitFrame
        position={[-17.97, 2.5, -14]}
        rotation={[0, Math.PI / 2, 0]}
        content={EXHIBITS.B4.europe}
      />
      <InfoPanel
        position={[-17.97, 2.3, -16.9]}
        rotation={[0, Math.PI / 2, 0]}
        title={EXHIBITS.B9.title}
        body={EXHIBITS.B9.body}
        color={'#fffddd'} />
      <InfoPanel
        position={[-15.97, 2.22, -18.4]}
        rotation={[0, 0, 0]}
        title={EXHIBITS.B9.title2}
        body={EXHIBITS.B9.body2}
        color={'#fffddd'} />

      <ExhibitFrame
        position={[-7, 1, -17]}
        rotation={[0, 0, 0]}
        content={EXHIBITS.B10.content}
        width={2.2}
        height={1.5}
      />
      <ExhibitFrame
        position={[-9.9, 2.5, -17.1]}
        rotation={[0, 0, 0]}
        content={EXHIBITS.B4.philippines}
      />
      <InfoPanel
        position={[-7, 2, -17.1]}
        rotation={[0, 0, 0]}
        title={EXHIBITS.B10.title}
        body={EXHIBITS.B10.body}
        color={'#fffddd'} />

      <group position={[20, 5.5, -4]} rotation={[0, - Math.PI / 2, 0]}>
        <Html center transform distanceFactor={5}>
          <div
            style={{
              width: '510px',
              padding: '10px 14px',
              fontFamily: 'Times New Roman, serif',
              textAlign: 'left',
              pointerEvents: 'none',
              userSelect: 'none',
              maxWidth: '520px',
              fontSize: '50px', color: '#939128', lineHeight: .5
            }}
          >
            {'Origins & Professions'}
          </div>
        </Html>
      </group>

      <Suspense fallback={null}>
        <group position={[5, 0, -17.5]} rotation={[0, Math.PI, 0]}>
          <Curtain />
        </group>
        <group position={[-5, 0, -17.5]} rotation={[0, 0, 0]}>
          <Curtain />
        </group>
        <group position={[-7.5, 0, 12]} rotation={[0, Math.PI / 2, 0]}>
          <Curtain />
        </group>
      </Suspense>

      {/* ── DOORS ───────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <group
          position={[0, 0, FAR_Z - .95]}>
          <Door
            label={"Occupation (2)"}
            isNear={nearDoor}
            onInteract={() => onNavigate('/occupational2')}
          />
        </group>
        <group
          position={[0, 0, BACK_Z + .95]} rotation={[0, Math.PI, 0]}>
          <Door
            isNear={nearDoor}
            onInteract={() => onNavigate('/lobby')}
          />
        </group>
      </Suspense>
    </group>
  )
}

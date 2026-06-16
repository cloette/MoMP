'use client'
import { useMemo, Suspense, useEffect, useRef } from 'react'
import { Html, Stage, useGLTF, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Door } from '../components/Door'
import { ExhibitFrame } from '../components/ExhibitFrame'
import { Curtain } from './curtain'
import { InfoPanel } from '../components/InfoPanel'

const FAR_Z = -18         // far end: one front doors
const BACK_Z = 18         // back end: one rear door

const W = 16
const D = 38
const H = 5.6

const EXHIBITS = {
  B1: {
   content: {
      type: 'image' as const,
      src: '/exhibitobjects/mysteries/moon.jpg',
      alt: 'Playbills',
    },
  },
  B2: {
    title: 'Gender & Social Status',
    body: 'Women were often more likely to be accused of witchcraft, and many of the most famous and respected cunning folk were women. In many cultures, women were seen as having a closer connection to the natural world and to the spiritual realm.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/mysteries/tardigrade.jpg',
      alt: 'Tardigrade',
    },
  },
  B3: {
    title: 'Street & Community Practitioners',
    body: 'Sleep is a fundamental biological process that is essential for maintaining physical and mental health. While the exact mechanisms and purposes of sleep are still being researched, it is known that sleep plays a crucial role in memory consolidation, emotional regulation, immune function, and overall cognitive performance. During sleep, the brain undergoes various processes that help in processing information from the day, clearing out metabolic waste, and restoring neural connections. The need for sleep appears to be universal across species, indicating its importance for survival and well-being. Despite this, newborn orcas and dolphins do not sleep in the first month and it has no ill-effect on their development, and bullfrogs have a lowered metabolic state called brumation, while jellyfish and sea urchins experience cycles of activity and rest without ever truly "slumbering". The specific reasons why sleep evolved and how it functions at a molecular level remain areas of active scientific investigation. Understanding why we sleep is one of the great mysteries in neuroscience and biology.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/mysteries/sleeping-koala.jpg',
      alt: 'Sleeping Koala',
    },
  },
  B4: {
    title: 'Mind-Readers, Hypnotists & Mentalists',
    body: 'Continental drift is the movement of Earth\'s continents relative to each other, which has been occurring for millions of years. The theory of plate tectonics explains that the Earth\'s lithosphere is divided into several large and small plates that float on the semi-fluid asthenosphere beneath them. The movement of these plates is driven by forces such as mantle convection, slab pull, and ridge push. However, the exact mechanisms and forces that initiated continental drift and continue to drive it are still subjects of research and debate among geologists. Understanding the causes of continental drift is crucial for comprehending Earth\'s geological history and the formation of its current landscape.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/mysteries/continents.jpg',
      alt: 'Continental Drift',
    },
  },
  B5: {
    title: 'Spiritual Intermediaries & Ritual Specialists',
    body: 'communicate with spirit worlds, perform protective rituals, or intercede with divine forces.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/mysteries/dinobones.jpg',
      alt: 'Dinosaur Bones',
    },
  },
  B6: {
    title: 'Healers & Diagnosticians',
    body: 'Europe, Africa, Asia, Egypt',
    content: {
      type: 'youtube' as const,
      // Replace with any YouTube video ID, e.g. 'dQw4w9WgXcQ'
      youtubeId: 'UjIdzcxSe3g',
      title: 'Mpemba effect – YouTube',
    },
  },
  B7: {
    title: 'Stage Performers & Entertainment Magicians',
    body: 'Dark matter is a mysterious form of matter that does not emit, absorb, or reflect light, making it invisible to current detection methods. It is believed to make up about 27% of the universe\'s mass-energy content, yet its exact nature remains unknown. Scientists have inferred the existence of dark matter through its gravitational effects on visible matter, such as the rotation of galaxies and the bending of light from distant objects. Despite extensive research and various theoretical models, the composition and properties of dark matter continue to elude scientists, making it one of the most profound mysteries in cosmology and particle physics.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/mysteries/darkmatter.jpg',
      alt: 'Dark Matter',
    },
  },
  B8: {
    title: 'Diviners & Fortune-Tellers',
    body: 'Consciousness is the state of being aware of and able to think about one\'s own existence, thoughts, and surroundings. It is a complex and multifaceted phenomenon that has puzzled philosophers, scientists, and thinkers for centuries. Despite advances in neuroscience and psychology, the nature of consciousness remains elusive, and there is no consensus on how to define or explain it. Some theories propose that consciousness arises from specific neural processes in the brain, while others suggest it may be a fundamental aspect of the universe. The question of what consciousness is and how it emerges continues to be one of the most profound mysteries in science and philosophy.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/mysteries/brain.jpg',
      alt: 'Consciousness',
    },
  },
}



interface RoomProps {
  nearDoor: boolean
  onNavigate: (route: string) => void
}

export function Room({ nearDoor, onNavigate }: RoomProps) {
  return (
    <group>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#780400" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#b30600" />
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

      {/* Middle wall */}
      <mesh position={[5, H / 2, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#230200" />
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#230200" />
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#230200" />
      </mesh>

      {/* ── LIGHTING ────────────────────────────────────────────── */}

      <ambientLight intensity={0.65} />
      <directionalLight position={[0, H - 0.2, 0]} intensity={0.95} color="#fffef8" />
      <spotLight position={[-2.5, H - 0.15, -2.5]} target-position={[-6, 1.8, -2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />
      <spotLight position={[-2.5, H - 0.15, 2.5]} target-position={[-6, 1.8, 2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />
      <spotLight position={[2.5, H - 0.15, -2.5]} target-position={[6, 1.8, -2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />
      <spotLight position={[2.5, H - 0.15, 2.5]} target-position={[6, 1.8, 2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />


      <ExhibitFrame
        position={[-7.50, 2.5, 15]}
        rotation={[0, Math.PI / 2, 0]}
        content={EXHIBITS.B1.content}/>
      <ExhibitFrame
        position={[-7.97, 2.5, -15.5]}
        rotation={[0, Math.PI / 2, 0]}
        content={EXHIBITS.B2.content}
      />
      <InfoPanel
        position={[-7.97, 2, -12]}
        rotation={[0, Math.PI / 2, 0]}
        title={EXHIBITS.B2.title}
        body={EXHIBITS.B2.body}
        color={'#f5ddff'} />
      <ExhibitFrame
        position={[-7.97, 2.5, .5]}
        rotation={[0, Math.PI / 2, 0]}
        content={EXHIBITS.B3.content}
      />
      <InfoPanel
        position={[-7.97, 2, 4]}
        rotation={[0, Math.PI / 2, 0]}
        title={EXHIBITS.B3.title}
        body={EXHIBITS.B3.body} />

      <ExhibitFrame
        position={[7.97, 2.5, -15.5]}
        rotation={[0, -Math.PI / 2, 0]}
        content={EXHIBITS.B4.content}
      />
      <InfoPanel
        position={[7.97, 2, -12]}
        rotation={[0, -Math.PI / 2, 0]}
        title={EXHIBITS.B4.title}
        body={EXHIBITS.B4.body} />
      <ExhibitFrame
        position={[7.97, 2.5, -6]}
        rotation={[0, -Math.PI / 2, 0]}
        content={EXHIBITS.B5.content}
      />
      <InfoPanel position={[7.97, 2, -2]}
        rotation={[0, -Math.PI / 2, 0]}
        title={EXHIBITS.B5.title}
        body={EXHIBITS.B5.body}
        color={'#fff3dd'}
      />
      <ExhibitFrame
        position={[7.97, 2.5, 13]}
        rotation={[0, -Math.PI / 2, 0]}
        content={EXHIBITS.B6.content}
      />
      <InfoPanel position={[7.97, 2, 17]}
        rotation={[0, -Math.PI / 2, 0]}
        title={EXHIBITS.B6.title}
        body={EXHIBITS.B6.body}
      />

      <ExhibitFrame
        position={[-7.97, 2.5, -8.5]}
        rotation={[0, Math.PI / 2, 0]}
        content={EXHIBITS.B7.content}
      />
      <InfoPanel 
        position={[-7.97, 2, -6]}
        rotation={[0, Math.PI / 2, 0]}
        title={EXHIBITS.B7.title}
        body={EXHIBITS.B7.body}
        color={'#ddfaff'}
      />

      <ExhibitFrame
        position={[7.97, 2.5, 4]}
        rotation={[0, -Math.PI / 2, 0]} 
        content={EXHIBITS.B8.content}
      />
      <InfoPanel position={[7.97, 2, 7.5]}
        rotation={[0, -Math.PI / 2, 0]}
        title={EXHIBITS.B8.title}
        body={EXHIBITS.B8.body}
        color={'#ffdde9'}
      />

      <group position={[ 8, 5, 8]} rotation={[0, -Math.PI / 2, 0]}>
        <Html center transform distanceFactor={5}>
            <div
              style={{
                width: '610px',
                padding: '10px 14px',
                fontFamily: 'Times New Roman, serif',
                textAlign: 'left',
                pointerEvents: 'none',
                userSelect: 'none',
                maxWidth: '620px',
                fontSize: '50px', color: '#939128', lineHeight: .5
              }}
            >
                {'Persecution & Witch Hunts'}
              </div>
          </Html>
      </group>

      <group position={[ -8, 5, -8]} rotation={[0, Math.PI / 2, 0]}>
        <Html center transform distanceFactor={5}>
            <div
              style={{
                width: '610px',
                padding: '10px 14px',
                fontFamily: 'Times New Roman, serif',
                textAlign: 'left',
                pointerEvents: 'none',
                userSelect: 'none',
                maxWidth: '620px',
                fontSize: '50px', color: '#939128', lineHeight: .5
              }}
            >
                {'Legacy & Modern Practice'}
              </div>
          </Html>
      </group>

      <Suspense fallback={null}>
        <group position={[ 5, 0, -17.5]} rotation={[0, Math.PI, 0]}>
          <Curtain />
        </group>
        <group position={[ -5, 0, -17.5]} rotation={[0, 0, 0]}>
          <Curtain />
        </group>
      </Suspense>

      {/* ── DOORS ───────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <group
          position={[0, 0, FAR_Z - .95]}>
          <Door
            label={"Echoes Across Cultures"}
            isNear={nearDoor}
            onInteract={() => onNavigate('/echoes-across-cultures')}
          />
        </group>
        <group
          position={[0, 0, BACK_Z + .95]} rotation={[0, Math.PI, 0]}>
          <Door
            isNear={nearDoor}
            onInteract={() => onNavigate('/occupational')}
          />
        </group>
      </Suspense>
    </group>
  )
}

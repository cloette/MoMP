'use client'
import { useMemo, Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Door } from '../components/Door'
import { QuestionCloud } from './questioncloud'
import { ExhibitFrame } from '../components/ExhibitFrame'
import { InfoPanel } from '../components/InfoPanel'

const FAR_Z = -18         
const BACK_Z = 18
const W = 16
const D = 38
const H = 5.6

const EXHIBITS = {
  B1: {
    title: 'When and how did the Moon start orbiting the Earth?',
    body: 'One theory is that the Moon formed from debris after a Mars-sized body collided with the early Earth around 4.5 billion years ago. The resulting debris coalesced into the Moon, which then settled into orbit around Earth. However, the exact details of this process and how the Moon\'s orbit evolved over time remain areas of active research and debate. A second theory, an alternative to a single massive collision, is the Multi-impact theory, which suggests the Moon might have built up over millions of years through a "rain" of smaller asteroid impacts (1 to 100 km in size). Repeatedly hammering the fledgling Earth, these smaller collisions could have blasted enough rocky debris into orbit to form multiple small moonlets that eventually merged into our single large Moon. The oldest known record of the Moon\'s existence, the Ab Blanchard bone in France, dates back roughly 32,000 to 38,000 years.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/mysteries/moon.jpg',
      alt: 'Moon',
    },
  },
  B2: {
    title: 'What are tardigrades?',
    body: 'Tardigrades, also known as water bears, are microscopic animals that are famous for their ability to survive in extreme conditions. They can withstand high levels of radiation, dehydration, and even the vacuum of space. Their resilience has made them a subject of interest in astrobiology and the search for life in extreme environments. Despite their toughness, tardigrades are still a mystery in many ways. Scientists are still trying to understand how they achieve such incredible survival feats and what their evolutionary history is. Tardigrades belong to their own phylum, Tardigrada, and are not closely related to any other known group of animals, which adds to the intrigue surrounding them. While tardigrades can survive for decades in a dehydrated, suspended state (cryptobiosis), the absolute maximum limit of this suspended life is unknown. Tardigrades have a surprising ability to take in foreign DNA from the environment around them when repairing their own genomes after desiccation. Scientists are still investigating exactly how they integrate this foreign genetic material into their own makeup, and what role it plays in their famed resilience.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/mysteries/tardigrade.jpg',
      alt: 'Tardigrade',
    },
  },
  B3: {
    title: 'Why do we sleep?',
    body: 'Sleep is a fundamental biological process that is essential for maintaining physical and mental health. While the exact mechanisms and purposes of sleep are still being researched, it is known that sleep plays a crucial role in memory consolidation, emotional regulation, immune function, and overall cognitive performance. During sleep, the brain undergoes various processes that help in processing information from the day, clearing out metabolic waste, and restoring neural connections. The need for sleep appears to be universal across species, indicating its importance for survival and well-being. Despite this, newborn orcas and dolphins do not sleep in the first month and it has no ill-effect on their development, and bullfrogs have a lowered metabolic state called brumation, while jellyfish and sea urchins experience cycles of activity and rest without ever truly "slumbering". The specific reasons why sleep evolved and how it functions at a molecular level remain areas of active scientific investigation. Understanding why we sleep is one of the great mysteries in neuroscience and biology.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/mysteries/sleeping-koala.jpg',
      alt: 'Sleeping Koala',
    },
  },
  B4: {
    title: 'Do protons decay?',
    body: 'Protons are considered stable particles and have not been observed to decay under normal circumstances. However, some theoretical models in physics predict that protons might be unstable over extremely long timescales, with estimated half-lives much longer than the current age of the universe. The stability of protons is a fundamental aspect of the Standard Model of particle physics, and their stability has important implications for the long-term fate of matter in the universe.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/mysteries/molecule.jpg',
      alt: 'Molecule',
    },
  },
  B5: {
    title: 'Why did many large animal species go extinct around 10,000 years ago?',
    body: 'The disappearance of megafauna around 10,000 years ago is a complex mystery that scientists are still trying to unravel. Several theories have been proposed to explain this mass extinction event, including climate change, human activity, and disease. The exact cause or combination of causes remains uncertain, making it one of the intriguing mysteries in paleontology and evolutionary biology. Some researchers suggest that rapid climate changes at the end of the last Ice Age may have altered habitats and food sources, leading to the decline of large animal species. Others propose that human hunting and habitat disruption played a significant role in the extinction of megafauna. Additionally, some scientists have explored the possibility that diseases introduced by humans or other animals could have contributed to the decline of these large species. Despite ongoing research, there is no definitive answer to why so many megafauna species went extinct during this period.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/mysteries/dinobones.jpg',
      alt: 'Dinosaur Bones',
    },
  },
  B6: {
    title: 'Mpemba effect: Why does hot water sometimes freeze faster than cold water?',
    body: 'The Mpemba effect is a counterintuitive phenomenon where hot water can freeze faster than cold water under certain conditions. The exact reasons behind this effect are still not fully understood, and it remains an area of active research in physics. Several theories have been proposed to explain the Mpemba effect, including differences in evaporation rates, convection currents, and the properties of water at different temperatures. Some researchers suggest that hot water may evaporate more quickly, reducing the volume that needs to freeze. Others propose that the structure of water molecules changes at higher temperatures, affecting how they freeze. Despite various experiments and studies, there is no consensus on a definitive explanation for the Mpemba effect, making it one of the intriguing mysteries in science.',
    content: {
      type: 'youtube' as const,
      // Replace with any YouTube video ID, e.g. 'dQw4w9WgXcQ'
      youtubeId: 'UjIdzcxSe3g',
      title: 'Mpemba effect – YouTube',
    },
  },
  B7: {
    title: 'What is dark matter?',
    body: 'Dark matter is a mysterious form of matter that does not emit, absorb, or reflect light, making it invisible to current detection methods. It is believed to make up about 27% of the universe\'s mass-energy content, yet its exact nature remains unknown. Scientists have inferred the existence of dark matter through its gravitational effects on visible matter, such as the rotation of galaxies and the bending of light from distant objects. Despite extensive research and various theoretical models, the composition and properties of dark matter continue to elude scientists, making it one of the most profound mysteries in cosmology and particle physics.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/mysteries/darkmatter.jpg',
      alt: 'Dark Matter',
    },
  },
  B8: {
    title: 'What is consciousness?',
    body: 'Consciousness is the state of being aware of and able to think about one\'s own existence, thoughts, and surroundings. It is a complex and multifaceted phenomenon that has puzzled philosophers, scientists, and thinkers for centuries. Despite advances in neuroscience and psychology, the nature of consciousness remains elusive, and there is no consensus on how to define or explain it. Some theories propose that consciousness arises from specific neural processes in the brain, while others suggest it may be a fundamental aspect of the universe. The question of what consciousness is and how it emerges continues to be one of the most profound mysteries in science and philosophy.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/mysteries/brain.jpg',
      alt: 'Consciousness',
    },
  },
  B9: {
    title: 'What caused continental drift?',
    body: 'Continental drift is the movement of Earth\'s continents relative to each other, which has been occurring for millions of years. The theory of plate tectonics explains that the Earth\'s lithosphere is divided into several large and small plates that float on the semi-fluid asthenosphere beneath them. The movement of these plates is driven by forces such as mantle convection, slab pull, and ridge push. However, the exact mechanisms and forces that initiated continental drift and continue to drive it are still subjects of research and debate among geologists. Understanding the causes of continental drift is crucial for comprehending Earth\'s geological history and the formation of its current landscape.',
    content: {
      type: 'image' as const,
      src: '/exhibitobjects/mysteries/continents.jpg',
      alt: 'Continental Drift',
    },
  },
}



interface RoomProps {
  nearDoor: boolean
  onNavigate: (route: string) => void
  onSecretDoorInteract: (route: string) => void
}

export function Room({ nearDoor, onNavigate, onSecretDoorInteract }: RoomProps) {
  const cubeRef2 = useRef<THREE.Mesh>(null)
  const cubeRef = useRef<THREE.Mesh>(null)

  const titleTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, 512, 256)
    ctx.textBaseline = 'top'
    ctx.font = '30px "Times New Roman", serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('Persistent', 20, 12)
    ctx.font = 'italic 96px "Times New Roman", serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('Mysteries', 35, 48)
    ctx.font = '26px Arial, sans-serif'
    ctx.fillStyle = '#9f9f9f'
    ctx.fillText("What we don't know may surprise you.", 20, 188)
    return new THREE.CanvasTexture(canvas)
  }, [])

  const questionMarkTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 140
    canvas.height = 200
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, 140, 200)
    ctx.textBaseline = 'top'
    ctx.font = '60px Arial, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('?', 20, 12)
    return new THREE.CanvasTexture(canvas)
  }, [])

  return (
    <group>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#7f7f7f" roughness={0.9} />
      </mesh>

      
      {/* Back wall */}
      <mesh position={[0, H / 2, -D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
      {/* Front wall */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, H / 2, D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#696969" />
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#696969" />
      </mesh>

      {/* ── LIGHTING ────────────────────────────────────────────── */}

      <ambientLight intensity={0.65} />
      <directionalLight position={[0, H - 0.2, 0]} intensity={0.55} color="#fffef8" />
      <spotLight position={[-2.5, H - 0.15, -2.5]} target-position={[-6, 1.8, -2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />
      <spotLight position={[-2.5, H - 0.15, 2.5]} target-position={[-6, 1.8, 2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />
      <spotLight position={[2.5, H - 0.15, -2.5]} target-position={[6, 1.8, -2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />
      <spotLight position={[2.5, H - 0.15, 2.5]} target-position={[6, 1.8, 2.5]} angle={0.45} penumbra={0.6} intensity={1.0} color="#fff9ee" />

      <mesh ref={cubeRef2} position={[-6, 2.7, 8]}>
        <boxGeometry args={[6, .5, .5]} />
        <meshStandardMaterial
          color={"#ececec"}
          roughness={0}
          metalness={0.25}
        />
      </mesh>

      <mesh ref={cubeRef} position={[-6, 0, 8]}>
        <boxGeometry args={[6, 5, .5]} />
        <meshStandardMaterial
          color={"#000000"}
          roughness={0}
          metalness={0.25}
        />
        {/* Title text as canvas texture — sits 0.02 units in front of the panel face */}
        <mesh position={[1.4, 1.5, 0.27]}>
          <planeGeometry args={[3, 1.4]} />
          <meshBasicMaterial map={titleTexture} transparent />
        </mesh>
      </mesh>

      <QuestionCloud />

      <ExhibitFrame
        position={[-7.97, 2.5, 11]}
        rotation={[0, Math.PI / 2, 0]}
        content={EXHIBITS.B1.content}/>
      <InfoPanel
        position={[-7.97, 2.5, 14.5]}
        rotation={[0, Math.PI / 2, 0]}
        title={EXHIBITS.B1.title}
        body={EXHIBITS.B1.body}
        color={'#ddfaff'} />
      <ExhibitFrame
        position={[-7.97, 2.5, -15.5]}
        rotation={[0, Math.PI / 2, 0]}
        content={EXHIBITS.B2.content}
      />
      <InfoPanel
        position={[-7.97, 2.5, -12]}
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
        position={[-7.97, 2.5, 4]}
        rotation={[0, Math.PI / 2, 0]}
        title={EXHIBITS.B3.title}
        body={EXHIBITS.B3.body} />

      <ExhibitFrame
        position={[7.97, 2.5, -15.5]}
        rotation={[0, -Math.PI / 2, 0]}
        content={EXHIBITS.B4.content}
      />
      <InfoPanel
        position={[7.97, 2.5, -12]}
        rotation={[0, -Math.PI / 2, 0]}
        title={EXHIBITS.B4.title}
        body={EXHIBITS.B4.body} />
      <ExhibitFrame
        position={[7.97, 2.5, -6]}
        rotation={[0, -Math.PI / 2, 0]}
        content={EXHIBITS.B5.content}
      />
      <InfoPanel position={[7.97, 2.5, -2]}
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
      <InfoPanel position={[7.97, 2.5, 17]}
        rotation={[0, -Math.PI / 2, 0]}
        title={EXHIBITS.B6.title}
        body={EXHIBITS.B6.body}
      />

      <ExhibitFrame
         position={[2.5, 2.5, -18]}
        rotation={[0, 0, 0]}
        content={EXHIBITS.B7.content}
      />
      <InfoPanel position={[6, 2.5, -18]}
        rotation={[0, 0, 0]}
        title={EXHIBITS.B7.title}
        body={EXHIBITS.B7.body}
        color={'#ddfaff'}
      />

      <ExhibitFrame
        position={[7.97, 2.5, 4]}
        rotation={[0, -Math.PI / 2, 0]} 
        content={EXHIBITS.B8.content}
      />
      <InfoPanel position={[7.97, 2.5, 7.5]}
        rotation={[0, -Math.PI / 2, 0]}
        title={EXHIBITS.B8.title}
        body={EXHIBITS.B8.body}
        color={'#ffdde9'}
      />

      <ExhibitFrame
        position={[-2.5, 2.5, -18]}
        rotation={[0, 0, 0]}
        content={EXHIBITS.B9.content}
      />
      <InfoPanel position={[-6, 2.5, -18]}
        rotation={[0, 0, 0]}
        title={EXHIBITS.B9.title}
        body={EXHIBITS.B9.body}
        color={'#fcffdd'}
      />

      {/* ── DOORS ───────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <group
          position={[0, 0, FAR_Z - .95]}>
          <Door
            label={"Nature"}
            isNear={nearDoor}
            onInteract={() => onNavigate('/nature')}
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

      {/* ── SECRET DOOR ─ */}
      <group position={[0, 5.2, 12.27]} rotation={[Math.PI/2,0,0]}>
      <mesh>
          <planeGeometry args={[2, 3]} />
          <meshBasicMaterial map={questionMarkTexture} transparent />
        </mesh>
      <mesh
        onClick={onSecretDoorInteract}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'auto' }}
      >
        <boxGeometry args={[1.4, 2.5, 0.08]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      </group>
    </group>
  )
}

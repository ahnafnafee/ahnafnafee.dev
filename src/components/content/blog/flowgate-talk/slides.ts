import type { Slide } from '@/components/content/interactive'

/** Slides and narration from the delivered talk (official-talk-content.json, notes revision r11). */
export const FLOWGATE_SLIDES: readonly Slide[] = [
  {
    src: '/images/blog/flowgate-lightning-talk/slide-1.webp',
    alt: 'Title slide on George Mason green: FlowGate, Can a Cycling Game Learn How Absorbed You Feel? Ahnaf An Nafee, advisor Lap-Fai Yu.',
    title: 'FlowGate: Can a Cycling Game Learn How Absorbed You Feel?',
    start: '0:00',
    end: '0:30',
    notes: [
      "Imagine two rides that take the same effort. One pulls you into the game, while the other leaves you watching the clock. Can the game learn that difference? I'm Ahnaf An Nafee, and FlowGate asks whether brain sensing can help train a model that later estimates absorption from ordinary cycling data."
    ]
  },
  {
    src: '/images/blog/flowgate-lightning-talk/slide-2.webp',
    alt: 'Problem Statement slide: a race in the cycling game with a smart trainer inset, beside an example prompt asking how absorbed the rider felt. Earlier trainer and game data lead up to the question and the rider report.',
    title: 'Problem Statement',
    start: '0:30',
    end: '1:15',
    notes: [
      "Absorption is how fully a rider feels caught up in the activity, one dimension relevant to flow. A game records pedaling power and interaction; the rider's report tells us how absorbed they felt. For each report, we use only the trainer and game data recorded before the question appears. The report describes the moment just before the question. We want to estimate that experience as a first step toward games that could respond to it."
    ]
  },
  {
    src: '/images/blog/flowgate-lightning-talk/slide-3.webp',
    alt: 'Proposed Solution slide: in laboratory training, a teacher model receives brain oxygenation from a sensing cap plus trainer and game data and guides a student. During intended play, the student uses trainer and game data only to produce an absorption estimate.',
    title: 'Proposed Solution',
    start: '1:15',
    end: '2:15',
    notes: [
      'We want to use brain measurements during training without asking every rider to wear the cap. The cap uses near-infrared light to estimate changes in blood oxygenation. Our proposed teacher receives those measurements alongside trainer and game data and learns to predict rider reports.',
      "A student would learn from the same reports, with the teacher's predictions providing extra guidance. During play, the student would use trainer and game data alone. We would judge the approach by whether it improves the student, even if the teacher predicts well. That test starts with reliable report collection."
    ]
  },
  {
    src: '/images/blog/flowgate-lightning-talk/slide-4.webp',
    alt: 'Key Findings slide: a reconstructed report interaction where a question was shown and a response recorded 10.99 seconds later, and a workload table where the grade-gain setting fell from 51 to 34 while mean power fell from 158.11 to 136.85 watts.',
    title: 'Key Findings',
    start: '2:15',
    end: '3:15',
    notes: [
      'Our evidence so far comes from prototype and pre-pilot work on the DCXR and GVL cycling platform. The left diagram reconstructs logged events from one incomplete rehearsal: a question appeared, and a response was recorded about eleven seconds later.',
      'The grade-gain setting scales the hill steepness simulated by the bike trainer. In one preliminary ride, that setting decreased by a third, while average pedaling power decreased by about thirteen percent. This is why we measure actual power alongside the setting. These observations do not establish absorption prediction; we still need to test accuracy and teaching benefit against rider reports.'
    ]
  },
  {
    src: '/images/blog/flowgate-lightning-talk/slide-5.webp',
    alt: 'Future Work slide: the same student trained with and without a teacher, both using cycling data during play, evaluated by comparing predictions with reports from entirely new riders.',
    title: 'Future Work',
    start: '3:15',
    end: '4:10',
    notes: [
      'We propose training the same student architecture on the same examples, with and without teacher guidance. Both versions would use the same inputs during play and predict reports from riders excluded from training and model selection. We would also compare them with a simple cycling-data baseline.',
      'This tests teaching as a whole. To find out what brain sensing adds, we would also compare teachers with and without those measurements. If guidance adds no useful benefit, we would judge the simpler model on its own performance. If estimation proves useful, we can then test whether adapting the game improves the riding experience.'
    ]
  },
  {
    src: '/images/blog/flowgate-lightning-talk/slide-6.webp',
    alt: 'Closing slide reading Questions?',
    title: 'Questions?',
    start: '4:10',
    end: '4:30',
    notes: [
      "Return to those two rides. We want a game to respond to the rider's experience as well as their effort. FlowGate asks whether brain sensing can help it learn, while the cap stays in the lab. Thank you."
    ]
  }
]

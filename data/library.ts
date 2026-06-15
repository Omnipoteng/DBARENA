export type LibraryEvidence = {
  label: string;
  image: string;
  caption: string;
};

export type LibraryDetail = {
  title: string;
  value: string;
  explanation: string;
  evidence?: LibraryEvidence[];
};

export type LibraryCharacter = {
  id: string;
  name: string;
  franchise: string;
  tier: string;
  image: string;
  summary: string;
  details: LibraryDetail[];
  abilities: string[];
  weakness: string;
};

export const libraryCharacters: LibraryCharacter[] = [
  {
    id: "naruto-uzumaki",
    name: "Naruto Uzumaki",
    franchise: "Naruto",
    tier: "High Tier",
    image: "/images/Naruto%20vs%20Ichigo.jpg",
    summary:
      "Versatile shinobi with layered forms, wide chakra control, and a massive late-series scaling chain.",
    details: [
      {
        title: "Attack Potency",
        value: "Multi-Continental to Planetary",
        explanation:
          "Naruto scales into the upper war-arc and Six Paths tiers through clashes with top-end threats like Kaguya-level scaling and later god-tier opponents. His destructive output comes from concentrated chakra amplification, massive reserves, and stronger transformations that let him trade blows with characters far above standard ninja-level durability.",
        evidence: [
          {
            label: "Scaling Panel",
            image: "/images/Naruto%20vs%20Ichigo.jpg",
            caption: "Reference battleframe for late-series scaling discussion.",
          },
          {
            label: "Thread Slot",
            image: "/images/news%20banner.jpg",
            caption: "Placeholder evidence panel for the AP thread.",
          },
        ],
      },
      {
        title: "Speed",
        value: "Massively Hypersonic+ / FTL arguments",
        explanation:
          "A common FTL argument for Naruto comes from his ability to react to and avoid Light Fang, an attack framed as light-speed by Madara. In debate, that is used to argue Naruto kept pace in the same combat environment and evaded a light-based strike, pushing his reaction speed beyond conventional hypersonic scaling.",
        evidence: [
          {
            label: "Speed Reference",
            image: "/images/Naruto%20vs%20Ichigo.jpg",
            caption: "Visual placeholder for the speed scaling section.",
          },
          {
            label: "Debate Scan",
            image: "/images/2.jpg",
            caption: "Secondary evidence slot for speed notes.",
          },
        ],
      },
      {
        title: "Durability",
        value: "Very High",
        explanation:
          "Naruto's durability is bolstered by chakra cloaks, Six Paths power, and long-fight endurance from Kurama-era scaling. He can keep fighting after heavy damage, which matters in battleboarding because durability is about surviving repeated exchanges, not just one hit.",
        evidence: [
          {
            label: "Durability Frame",
            image: "/images/1.jpg",
            caption: "Placeholder image for the durability section.",
          },
        ],
      },
      {
        title: "Stamina",
        value: "Extremely High",
        explanation:
          "His chakra pools are enormous, especially in late-series forms. That lets him keep using clones, transformations, and high-cost techniques without dropping off too early.",
      },
      {
        title: "Range",
        value: "Close to Long Range",
        explanation:
          "Naruto can fight in close quarters with taijutsu, but he also has huge ranged pressure through Rasengan variants, chakra arms, clones, and large-scale attacks.",
      },
      {
        title: "Intelligence",
        value: "Battle smart, adaptive",
        explanation:
          "Naruto is not a genius strategist like Kakashi or Shikamaru, but he is very adaptive in combat. He reads opponents quickly, uses clones for information, and adjusts tactics mid-fight.",
      },
    ],
    abilities: [
      "Six Paths Sage Mode",
      "Shadow Clones",
      "Truth-Seeking Orbs",
      "Chakra sensing",
    ],
    weakness:
      "Can be pressured if chakra resources are restricted or if the opponent has stronger hax or sealing tools.",
  },
  {
    id: "ichigo-kurosaki",
    name: "Ichigo Kurosaki",
    franchise: "Bleach",
    tier: "Top Tier",
    image: "/images/karakter%20bleach%20.png",
    summary:
      "Explosive pressure fighter with layered transformations and strong spiritual scaling across the verse.",
    details: [
      {
        title: "Attack Potency",
        value: "Planetary+ to Higher with scaling",
        explanation:
          "Ichigo's AP is argued through scaling to top Bleach entities and the gap between ordinary captains and the verse's highest threats. His attacks are compact but extremely dense, which makes them dangerous even when they do not look huge on the page.",
        evidence: [
          {
            label: "Bleach Reference",
            image: "/images/karakter%20bleach%20.png",
            caption: "Character reference used as a proof placeholder.",
          },
        ],
      },
      {
        title: "Speed",
        value: "Massively Hypersonic+",
        explanation:
          "Bleach scaling often treats high-tier characters as extremely fast due to reactions, blitzes, and combat pacing far beyond ordinary human perception. Ichigo consistently sits inside that upper combat bracket.",
        evidence: [
          {
            label: "Speed Panel",
            image: "/images/Naruto%20vs%20Ichigo.jpg",
            caption: "Shared combat frame used as a visual evidence slot.",
          },
        ],
      },
      {
        title: "Durability",
        value: "Very High",
        explanation:
          "Spiritual pressure and raw combat scaling let Ichigo absorb punishment while still staying active. His durability works together with his aggression, because he is usually not a passive defender.",
        evidence: [
          {
            label: "Durability Scan",
            image: "/images/karakter%20bleach%20.png",
            caption: "Placeholder durability evidence image.",
          },
        ],
      },
      {
        title: "Stamina",
        value: "High",
        explanation:
          "Ichigo can fight hard for long stretches, but his biggest edge is usually burst pressure rather than endless prolonged attrition.",
      },
      {
        title: "Range",
        value: "Close to Mid Range",
        explanation:
          "His blade style keeps him strongest at close range, but Getsuga Tensho and related attacks extend his effective threat radius.",
      },
      {
        title: "Intelligence",
        value: "Instinctive combat talent",
        explanation:
          "Ichigo is a natural fighter. He learns through contact, adapts under pressure, and often performs best when forced into direct battle conditions.",
      },
    ],
    abilities: [
      "Bankai",
      "Hollowfication",
      "Getsuga Tensho",
      "Spiritual pressure crushing",
    ],
    weakness:
      "If the fight denies tempo or heavily favors hax, his direct style can be forced into bad exchanges.",
  },
  {
    id: "saitama",
    name: "Saitama",
    franchise: "One Punch Man",
    tier: "Extreme Tier",
    image: "/images/1.jpg",
    summary:
      "Scaling-dependent benchmark character whose ceiling is intentionally vague and debate-heavy.",
    details: [
      {
        title: "Attack Potency",
        value: "Scaling-dependent, rapidly increasing",
        explanation:
          "Saitama's AP is intentionally written as a moving target. The character's function in debate is that he grows during the fight, so fixed tier placement is always partly interpretive and story-dependent.",
        evidence: [
          {
            label: "Growth Reference",
            image: "/images/1.jpg",
            caption: "Placeholder evidence for scaling growth discussion.",
          },
        ],
      },
      {
        title: "Speed",
        value: "Scaling Dependent",
        explanation:
          "Speed arguments for Saitama depend on which feats and timing windows are used. His reaction and movement scaling are usually discussed alongside his growth rather than as a rigid one-time value.",
        evidence: [
          {
            label: "Speed Frame",
            image: "/images/4.jpg",
            caption: "Placeholder image for speed discussion.",
          },
        ],
      },
      {
        title: "Durability",
        value: "Exceptional",
        explanation:
          "He tends to ignore punishment that would normally end a fight instantly. That durability matters because it gives the character time to scale upward during combat.",
      },
      {
        title: "Stamina",
        value: "Effectively limitless in-story portrayal",
        explanation:
          "Within the story's portrayal, Saitama keeps going without the kind of fatigue that would affect most fighters. This makes attrition-based wins unreliable unless the matchup is unusual.",
      },
      {
        title: "Range",
        value: "Close Range",
        explanation:
          "He is mostly a direct boxer-type combatant, relying on overwhelming physical presence rather than a broad ranged toolkit.",
      },
      {
        title: "Intelligence",
        value: "Basic but combat-effective",
        explanation:
          "Saitama is not usually portrayed as a strategic mastermind, but he is efficient and understands fights quickly enough to exploit openings.",
      },
    ],
    abilities: [
      "Limitless Growth",
      "Serious Series",
      "One Hit Finish",
      "Adaptation through escalation",
    ],
    weakness:
      "The biggest debate weakness is ambiguity. His exact cap depends heavily on how much story context is accepted.",
  },
  {
    id: "goku",
    name: "Son Goku",
    franchise: "Dragon Ball",
    tier: "Extreme Tier",
    image: "/images/dragon%20ball.jpg",
    summary:
      "One of the most analyzed battleboarding characters because of layered transformations and massive scaling depth.",
    details: [
      {
        title: "Attack Potency",
        value: "Universal+ to Far Higher depending on scaling",
        explanation:
          "Goku's AP arguments usually come from Dragon Ball cosmology and the chain of opponents he scales to. Because the verse keeps raising the ceiling, his exact tier can shift depending on which era and guide interpretations are used.",
        evidence: [
          {
            label: "Dragon Ball Scale",
            image: "/images/dragon%20ball.jpg",
            caption: "Primary evidence placeholder for Goku scaling.",
          },
        ],
      },
      {
        title: "Speed",
        value: "Immeasurable or beyond conventional scaling arguments",
        explanation:
          "Speed debates around Goku often combine raw movement, instantaneous techniques, and high-end reaction scaling. The result is a character whose speed arguments can become very large very quickly depending on which feats are accepted.",
        evidence: [
          {
            label: "Speed Reference",
            image: "/images/dragon%20ball.jpg",
            caption: "Placeholder speed evidence panel.",
          },
        ],
      },
      {
        title: "Durability",
        value: "Extreme combat durability",
        explanation:
          "He survives and adapts through absurdly high-damage exchanges, especially because he keeps training and returning stronger after each major conflict.",
      },
      {
        title: "Stamina",
        value: "Very High",
        explanation:
          "Goku can sustain prolonged high-intensity fights, though some forms and states can be more energy-efficient than others.",
      },
      {
        title: "Range",
        value: "Close to Long Range",
        explanation:
          "His kit includes close melee, beam clashes, and distance pressure through ki projection, which lets him fight in multiple range bands.",
      },
      {
        title: "Intelligence",
        value: "Elite combat genius",
        explanation:
          "Goku is one of the cleanest examples of combat IQ in shonen battleboarding. He reads patterns fast, learns through contact, and continuously optimizes mid-fight.",
      },
    ],
    abilities: [
      "Ultra Instinct",
      "Ki control",
      "Instant Transmission",
      "Energy projection",
    ],
    weakness:
      "High-level hax, sealing, or specialist counters can be problematic if they bypass direct stat competition.",
  },
  {
    id: "madara-uchiha",
    name: "Madara Uchiha",
    franchise: "Naruto",
    tier: "High Tier",
    image: "/images/2.jpg",
    summary:
      "Battlefield controller with elite pressure tools, huge area denial, and strong tactical presence.",
    details: [
      {
        title: "Attack Potency",
        value: "Multi-Continental to Planetary",
        explanation:
          "Madara sits in a very high Naruto scaling bracket because his attacks and forms scale to late-verse devastation. His offense is usually discussed in terms of large-scale battlefield control and overwhelming top-end exchanges.",
        evidence: [
          {
            label: "Battlefield Scale",
            image: "/images/2.jpg",
            caption: "Placeholder battleframe for Madara AP section.",
          },
        ],
      },
      {
        title: "Speed",
        value: "Massively Hypersonic+",
        explanation:
          "Madara keeps pace with top-end Naruto combat speed, and his threat level comes from combining speed with technique density rather than from movement alone.",
        evidence: [
          {
            label: "Speed Panel",
            image: "/images/2.jpg",
            caption: "Placeholder visual for speed comparison.",
          },
        ],
      },
      {
        title: "Durability",
        value: "High with Susanoo reinforcement",
        explanation:
          "Susanoo and layered defenses make him difficult to crack cleanly, especially when he can keep pressure up and prevent free engagement.",
      },
      {
        title: "Stamina",
        value: "Very High",
        explanation:
          "Madara can maintain extended combat pressure thanks to enormous reserves and battle experience.",
      },
      {
        title: "Range",
        value: "Mid to Long Range",
        explanation:
          "His kit is famous for broad field control, from clones and projectiles to giant-scale techniques that dominate an area.",
      },
      {
        title: "Intelligence",
        value: "Strategic mastermind",
        explanation:
          "Madara is one of the most tactical characters in the roster. He understands leverage, psychological pressure, and how to force bad matchups.",
      },
    ],
    abilities: ["Rinnegan", "Susanoo", "Limbo Clones", "Meteor Summon"],
    weakness:
      "Characters with stronger speed control, sealing, or anti-hax can force him into awkward exchanges.",
  },
  {
    id: "aizen-sosuke",
    name: "Sosuke Aizen",
    franchise: "Bleach",
    tier: "Extreme Tier",
    image: "/images/karakter%20bleach%20.png",
    summary:
      "Manipulation-centric opponent whose win conditions often rely on deception, control, and layered hax.",
    details: [
      {
        title: "Attack Potency",
        value: "Planetary+ with scaling",
        explanation:
          "Aizen's AP is usually treated as extremely high because of where he sits in Bleach scaling and because his presence persists even after huge power jumps in the verse.",
        evidence: [
          {
            label: "Bleach Power Scale",
            image: "/images/karakter%20bleach%20.png",
            caption: "Primary evidence placeholder for Aizen AP.",
          },
        ],
      },
      {
        title: "Speed",
        value: "Massively Hypersonic+",
        explanation:
          "He scales alongside the top Bleach combat tier where speed is not just about movement, but about reacting inside dense, high-pressure exchanges.",
        evidence: [
          {
            label: "Speed Reference",
            image: "/images/karakter%20bleach%20.png",
            caption: "Placeholder image for speed section.",
          },
        ],
      },
      {
        title: "Durability",
        value: "Very High with regeneration",
        explanation:
          "Aizen is notoriously difficult to remove because his defensive profile is not only about enduring damage, but also surviving and continuing after damage.",
      },
      {
        title: "Stamina",
        value: "High",
        explanation:
          "He can keep playing the long game, which matters because his kit often rewards patience and battlefield control.",
      },
      {
        title: "Range",
        value: "Mid to Long Range",
        explanation:
          "His illusions and spiritual pressure let him influence fights beyond basic melee range.",
      },
      {
        title: "Intelligence",
        value: "Genius-level manipulator",
        explanation:
          "Aizen is one of the sharpest manipulators in shonen. He fights by controlling information, not only by trading hits.",
      },
    ],
    abilities: [
      "Kyoka Suigetsu",
      "Regeneration",
      "Reiatsu suppression",
      "High-level illusions",
    ],
    weakness:
      "If an opponent has direct counters to perception games or strong anti-hax, his advantage can shrink.",
  },
];

export type TerminologyItem = {
  id: string;
  term: string;
  definition: string;
  debateUse: string;
  commonCharacters: string[];
};

export const terminologyItems: TerminologyItem[] = [
  {
    id: "gravity-manipulation",
    term: "Gravity Manipulation",
    definition:
      "Ability to control gravitational force, usually to crush, pin, pull, or alter the movement of an opponent or object in battle.",
    debateUse:
      "In battleboarding, this matters because gravity can restrict mobility, break defenses, create battlefield control, or amplify area pressure. Characters with gravity hax often become dangerous even if their raw AP is not the highest in the verse.",
    commonCharacters: ["Pain/Nagato", "Madara Uchiha", "Sukuna", "Aizen"],
  },
  {
    id: "conceptual-manipulation",
    term: "Conceptual Manipulation",
    definition:
      "A higher-order ability that affects an idea, principle, or concept instead of only the physical body or environment.",
    debateUse:
      "This is treated as serious hax because it can bypass normal durability checks. If a character can attack the concept of life, death, identity, or existence, then standard physical defenses may not matter the same way anymore.",
    commonCharacters: ["Gojo Satoru", "Sailor Moon", "Aizen", "Goku (debated)"],
  },
  {
    id: "existence-erasure",
    term: "Existence Erasure",
    definition:
      "An attack or ability that removes a target from existence rather than simply injuring or killing them.",
    debateUse:
      "Existence erasure is important because it can ignore conventional durability if the effect is accepted as total. In debates, the key question is often whether the erasure is absolute, resisted, or only partial.",
    commonCharacters: ["Naruto", "Gojo Satoru", "Saitama (debated)", "Zeno"],
  },
  {
    id: "time-manipulation",
    term: "Time Manipulation",
    definition:
      "The ability to slow, stop, loop, rewind, accelerate, or otherwise alter the flow of time.",
    debateUse:
      "This can create unfair win conditions because it can freeze the opponent before a direct exchange even begins. The most common debate question is whether the target has resistance or speed enough to move before the time effect lands.",
    commonCharacters: ["DIO", "Hit", "Aizen", "Jotaro Kujo"],
  },
  {
    id: "spatial-manipulation",
    term: "Spatial Manipulation",
    definition:
      "Control over space itself, including teleportation, distance bending, portals, or dimensional displacement.",
    debateUse:
      "This is useful for repositioning, trapping, or bypassing range advantage. Spatial hax often changes the fight from a pure stat contest into a positioning and control battle.",
    commonCharacters: ["Gojo Satoru", "Obito Uchiha", "Naruto", "Doctor Strange"],
  },
  {
    id: "reality-warping",
    term: "Reality Warping",
    definition:
      "A broad term for abilities that rewrite the rules of reality, physics, causality, or the state of the world around the user.",
    debateUse:
      "Reality warping can be extremely broad, so debate usually focuses on scope and limits. A small local warp is not the same as full-scale universal rewriting.",
    commonCharacters: ["Bill Cipher", "Yhwach", "Sailor Moon", "Madoka Kaname"],
  },
  {
    id: "law-manipulation",
    term: "Law Manipulation",
    definition:
      "The power to alter or enforce metaphysical, cosmic, or narrative laws governing how the verse works.",
    debateUse:
      "This is often framed as a control ability that can override normal interaction rules. In versus debates, it can be stronger than simple elemental power because it changes the terms of the fight itself.",
    commonCharacters: ["Aizen", "Yhwach", "Featherine", "Sailor Moon"],
  },
  {
    id: "soul-manipulation",
    term: "Soul Manipulation",
    definition:
      "The ability to affect, damage, steal, control, or destroy the soul rather than the physical body.",
    debateUse:
      "Soul-based attacks matter when physical durability alone is not enough. If the verse treats souls as separate from bodies, this can bypass standard toughness and create a separate defensive layer to debate.",
    commonCharacters: ["Bleach cast", "Naruto (certain forms debated)", "Aizen", "Ichigo Kurosaki"],
  },
];

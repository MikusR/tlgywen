export interface Resources {
  coins: number;
  wood: number;
  food: number;
  knowledge: number;
  iron: number;
  rock: number;
}

export interface Stats {
  level: number;
  totalClicks: number;
}

export interface Generator {
  level: number;
  cost: number;
  image: string;
}

export interface Generators {
  coinMiner: Generator;
  knowledgeMiner: Generator;
  foodMiner: Generator;
  woodMiner: Generator;
  rockMiner: Generator;
  ironMiner: Generator;
}

export interface Upgrade {
  level: number;
  cost: number;
  image: string;
}

export interface Upgrades {
  autoClickers: Upgrade;
}

export type ResourceType = keyof Resources;

export interface GameState {
  resources: Resources;
  upgrades: Upgrades;
  generators: Generators;
  stats: Stats;
}

export interface GeneratorCardProps {
  name: string;
  level: number;
  cost: number;
  onUpgrade: () => void;
  backgroundImage: string;
}

export interface PersistentSidebarProps {
  stats: Stats;
  resources: Resources;
}

export interface ResourceCardProps {
  name: ResourceType;
  amount: number;
  image: string;
  description: string;
}
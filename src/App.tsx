import React, {useState, useEffect} from 'react';
import {Plus, ArrowUp, User} from 'lucide-react';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Progress} from '@/components/ui/progress';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {HoverCard, HoverCardContent, HoverCardTrigger} from '@/components/ui/hover-card';
import {useToast} from "@/components/ui/use-toast"
import {Toaster} from "@/components/ui/toaster"
import {ThemeProvider} from "@/components/theme-provider"
import {ModeToggle} from "@/components/mode-toggle.tsx";

import backgroundSvg from "@/assets/leaves-6975462.svg"

type ResourceType = 'coins' | 'energy' | 'data';

interface Resources {
    coins: number;
    energy: number;
    data: number;
}

interface Stats {
    level: number;
    totalClicks: number;
    totalResources: number;
    generatorsOwned: number;
}

interface Generator {
    level: number;
    cost: number;
    image: string;
}

interface Generators {
    coinMiner: Generator;
    energyPlant: Generator;
    dataCenter: Generator;
}

// Props for components

interface ResourceCardProps {
    name: string;
    amount: number;
    image: string;
    description: string;
}

interface GeneratorCardProps {
    name: string;
    level: number;
    cost: number;
    onUpgrade: () => void;
    backgroundImage: string;
}

interface PersistentSidebarProps {
    stats: Stats;
    resources: Resources;
}

const coinImage = "src/assets/generators/coins.jpg";
const energyImage = "src/assets/generators/energy.jpg";
const dataImage = "src/assets/generators/data.jpg";


const ResourceCard: React.FC<ResourceCardProps> = ({name, amount, image, description}) => {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div
                    className="flex justify-between items-center mb-2 p-2 bg-muted/90 rounded cursor-pointer hover:bg-secondary">
                    <div className="flex items-center">
                        <img src={image} alt={name} className="h-6 w-6 mr-2 object-cover rounded"/>
                        <span className="text-sm text-foreground">{name}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{amount.toLocaleString()}</span>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                    <Avatar>
                        <AvatarFallback>
                            <img src={image} alt={name} className="h-full w-full object-cover"/>
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{name}</h4>
                        <p className="text-sm">
                            {description}
                        </p>
                        <div className="flex items-center pt-2">
                            <span className="text-xs text-muted-foreground">
                              Current amount: {amount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

const GeneratorCard: React.FC<GeneratorCardProps> = ({name, level, cost, onUpgrade, backgroundImage}) => (
    <Card className="mb-2 overflow-hidden">
        <div className="flex h-24">
            <div
                className="w-24 h-24 bg-cover bg-center flex-shrink-0"
                style={{backgroundImage: `url(${backgroundImage})`}}
            />
            <div className="flex-grow p-2 relative">
                <div className="flex justify-between items-start h-full">
                    <div>
                        <h3 className="font-bold text-foreground">{name}</h3>
                        <p className="text-sm text-muted-foreground">Level: {level}</p>
                    </div>
                    <Button
                        onClick={onUpgrade}
                        size="sm"
                        variant="secondary"
                    >
                        <ArrowUp className="h-4 w-4 mr-1"/>
                        {cost}
                    </Button>
                </div>
                <Progress value={level % 10 * 10} className="absolute bottom-0 left-0 right-0"/>
            </div>
        </div>
    </Card>
);

const PersistentSidebar: React.FC<PersistentSidebarProps> = ({stats, resources}) => (
    <div className="w-64 bg-card/90 p-4 text-card-foreground flex flex-col rounded-lg">
        <div className="flex items-center space-x-4 mb-6">
            <Avatar>
                <AvatarImage src="src/assets/owl.svg" alt="Avatar"/>
                <AvatarFallback><User/></AvatarFallback>
            </Avatar>
            <div>
                <h2 className="text-lg font-bold">Owl</h2>
                <p className="text-sm text-muted-foreground">Level {stats.level}</p>
            </div>
        </div>
        <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Resources</h3>
            <ResourceCard
                name="Coins"
                amount={resources.coins}
                image={coinImage}
                description="The primary currency used for upgrades and purchases."
            />
            <ResourceCard
                name="Energy"
                amount={resources.energy}
                image={energyImage}
                description="Powers your operations and unlocks advanced features."
            />
            <ResourceCard
                name="Data"
                amount={resources.data}
                image={dataImage}
                description="Collected information used for research and progression."
            />
        </div>
        <div className="space-y-2 mt-auto text-muted-foreground">
            <p>Total Clicks: {stats.totalClicks}</p>
            <p>Total Resources: {stats.totalResources}</p>
            <p>Generators Owned: {stats.generatorsOwned}</p>
        </div>
    </div>
);


const ClickerGameDashboard: React.FC = () => {
    const [resources, setResources] = useState<Resources>({
        coins: 0,
        energy: 0,
        data: 0,
    });

    const [generators, setGenerators] = useState<Generators>({
        coinMiner: {
            level: 1,
            cost: 10,
            image: coinImage
        },
        energyPlant: {
            level: 1,
            cost: 20,
            image: energyImage
        },
        dataCenter: {
            level: 1,
            cost: 30,
            image: dataImage
        },
    });

    const [stats, setStats] = useState<Stats>({
        level: 1,
        totalClicks: 0,
        totalResources: 0,
        generatorsOwned: 3,
    });

    const {toast} = useToast();

    useEffect(() => {
        const timer = setInterval(() => {
            setResources(prev => ({
                coins: prev.coins + generators.coinMiner.level,
                energy: prev.energy + generators.energyPlant.level,
                data: prev.data + generators.dataCenter.level,
            }));
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [generators]);

    const upgradeGenerator = (type: keyof Generators) => {
        const cost = generators[type].cost;
        if (resources.coins >= cost) {
            setGenerators(prev => ({
                ...prev,
                [type]: {
                    ...prev[type],
                    level: prev[type].level + 1,
                    cost: Math.floor(prev[type].cost * 1.15),
                },
            }));
            setResources(prev => ({...prev, coins: prev.coins - cost}));
            setStats(prev => ({...prev, generatorsOwned: prev.generatorsOwned + 1}));
        }
    };

    const handleClick = () => {
        setResources(prev => ({...prev, coins: prev.coins + 1}));
        setStats(prev => ({
            ...prev,
            totalClicks: prev.totalClicks + 1,
            totalResources: prev.totalResources + 1
        }));

        if (Math.random() < 0.005) {
            const dropPool: ResourceType[] = ['energy', 'data'];
            const droppedResource = dropPool[Math.floor(Math.random() * dropPool.length)];
            const dropAmount = Math.floor(Math.random() * 10) + 1;

            setResources(prev => ({
                ...prev,
                [droppedResource]: prev[droppedResource] + dropAmount
            }));

            toast({
                title: "Resource Drop!",
                description: `You found ${dropAmount.toString()} ${droppedResource}!`,
                duration: 3000,
            });
        }
    };

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="relative min-h-screen bg-transparent">
                <img src={backgroundSvg} alt="Background" className="fixed inset-0 w-full h-full object-cover -z-10"/>
                <div className="absolute inset-0 bg-background/90">
                    <div className="h-full flex">
                        <PersistentSidebar stats={stats} resources={resources}/>
                        <div className="flex-grow flex flex-col p-4 overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-3xl font-bold">Clicker Game Dashboard</h1>
                                <ModeToggle/>
                            </div>

                            <Tabs defaultValue="main" className="flex-grow flex flex-col">
                                <TabsList className="mb-4 bg-background/90">
                                    <TabsTrigger value="main">Main</TabsTrigger>
                                    <TabsTrigger value="generators">Generators</TabsTrigger>
                                    <TabsTrigger value="research">Research</TabsTrigger>
                                    <TabsTrigger value="quests">Quests</TabsTrigger>
                                    <TabsTrigger value="shop">Shop</TabsTrigger>
                                </TabsList>

                                <TabsContent value="main" className="flex-grow bg-card/90 rounded-lg p-4">
                                    <Tabs defaultValue="clicker">
                                        <TabsList>
                                            <TabsTrigger value="clicker">Clicker</TabsTrigger>
                                            <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="clicker">
                                            <div className="flex justify-center items-center h-full">
                                                <Button onClick={handleClick} size="lg" className="p-8">
                                                    <Plus className="mr-2 h-6 w-6"/> Click for Coin
                                                </Button>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="upgrades">
                                            <p>Upgrades content (to be implemented)</p>
                                        </TabsContent>
                                    </Tabs>
                                </TabsContent>

                                <TabsContent value="generators"
                                             className="flex-grow overflow-auto bg-card/90 rounded-lg p-4">
                                    <ScrollArea className="h-full">
                                        <GeneratorCard
                                            name="Coin Miner"
                                            level={generators.coinMiner.level}
                                            cost={generators.coinMiner.cost}
                                            onUpgrade={() => {
                                                upgradeGenerator('coinMiner');
                                            }}
                                            backgroundImage={generators.coinMiner.image}
                                        />
                                        <GeneratorCard
                                            name="Energy Plant"
                                            level={generators.energyPlant.level}
                                            cost={generators.energyPlant.cost}
                                            onUpgrade={() => {
                                                upgradeGenerator('energyPlant');
                                            }}
                                            backgroundImage={generators.energyPlant.image}
                                        />
                                        <GeneratorCard
                                            name="Data Center"
                                            level={generators.dataCenter.level}
                                            cost={generators.dataCenter.cost}
                                            onUpgrade={() => {
                                                upgradeGenerator('dataCenter');
                                            }}
                                            backgroundImage={generators.dataCenter.image}
                                        />
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent value="research">
                                    <p>Research content (to be implemented)</p>
                                </TabsContent>

                                <TabsContent value="quests">
                                    <p>Quests content (to be implemented)</p>
                                </TabsContent>

                                <TabsContent value="shop">
                                    <p>Shop content (to be implemented)</p>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
                <Toaster/>
            </div>
        </ThemeProvider>
    );
};

export default ClickerGameDashboard;
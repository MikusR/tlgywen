import React, { useState, useEffect } from 'react';
import { UserRoundSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import PersistentSidebar from './PersistentSidebar';
import GeneratorCard from './GeneratorCard';
import coinImage from "@/assets/coins.svg";
import foodImage from "@/assets/food.svg";
import knowledgeImage from "@/assets/knowledge.svg";
import woodImage from "@/assets/wood.svg";
import ironImage from "@/assets/iron.svg";
import rockImage from "@/assets/rock.svg";
import backgroundSvg from "@/assets/leaves-6975462.svg";
import { Resources, Stats, Generators, ResourceType } from '../types';


const ClickerGameDashboard: React.FC = () => {
    const [resources, setResources] = useState<Resources>({
        coins: 0,
        wood: 0,
        food: 0,
        knowledge: 0,
        iron: 0,
        rock: 0,
    });

    const [generators, setGenerators] = useState<Generators>({
        coinMiner: {
            level: 0,
            cost: 10,
            image: coinImage
        },
        knowledgeMiner: {
            level: 0,
            cost: 20,
            image: knowledgeImage
        },
        foodMiner: {
            level: 0,
            cost: 30,
            image: foodImage
        },
        woodMiner: {
            level: 0,
            cost: 30,
            image: woodImage
        },
        ironMiner: {
            level: 0,
            cost: 30,
            image: ironImage
        },
        rockMiner: {
            level: 0,
            cost: 30,
            image: rockImage
        },
    });

    const [stats, setStats] = useState<Stats>({
        level: 1,
        totalClicks: 0,
    });

    const {toast} = useToast();

    useEffect(() => {
        const timer = setInterval(() => {
            setResources(prev => ({
                coins: prev.coins + generators.coinMiner.level,
                knowledge: prev.knowledge + generators.knowledgeMiner.level,
                food: prev.food + generators.foodMiner.level,
                iron: prev.iron + generators.ironMiner.level,
                wood: prev.wood + generators.woodMiner.level,
                rock: prev.rock + generators.rockMiner.level,
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
        }
    };

    const handleClick = () => {
        setResources(prev => ({...prev, coins: prev.coins + 1}));
        setStats(prev => ({
            ...prev,
            totalClicks: prev.totalClicks + 1,
           
        }));

        if (Math.random() < .1) {
            const dropPool: ResourceType[] = ['coins', 'wood', 'food', 'knowledge', 'iron', 'rock'];
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
                <img src={backgroundSvg} alt="Background" className="fixed inset-0 object-cover w-full h-full -z-10"/>
                <div className="absolute inset-0 bg-background/90">
                    <div className="flex h-full">
                        <PersistentSidebar stats={stats} resources={resources}/>
                        <div className="flex flex-col flex-grow p-4 overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-3xl font-bold">Clicker Game Dashboard</h1>
                                <ModeToggle/>
                            </div>

                            <Tabs defaultValue="generators" className="flex flex-col flex-grow">
                                <TabsList className="mb-4 bg-background/90">
                                    <TabsTrigger value="main">Main</TabsTrigger>
                                    <TabsTrigger value="generators">Generators</TabsTrigger>
                                    <TabsTrigger value="research">Research</TabsTrigger>
                                    <TabsTrigger value="quests">Quests</TabsTrigger>
                                    <TabsTrigger value="shop">Shop</TabsTrigger>
                                </TabsList>

                                <TabsContent value="main" className="flex-grow p-4 rounded-lg bg-card/90">
                                    <Tabs defaultValue="clicker">
                                        <TabsList>
                                            <TabsTrigger value="clicker">Clicker</TabsTrigger>
                                            <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="clicker">
                                            <div className="flex items-center justify-center h-full">
                                                <Button onClick={handleClick} size="lg" className="p-8">
                                                    <UserRoundSearch className="w-6 h-6 mr-2"/> Gather
                                                </Button>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="upgrades">
                                            <p>Upgrades content (to be implemented)</p>
                                        </TabsContent>
                                    </Tabs>
                                </TabsContent>

                                <TabsContent value="generators"
                                             className="flex-grow p-4 overflow-auto rounded-lg bg-card/90">
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
                                            name="Food Miner"
                                            level={generators.foodMiner.level}
                                            cost={generators.foodMiner.cost}
                                            onUpgrade={() => {
                                                upgradeGenerator('foodMiner');
                                            }}
                                            backgroundImage={generators.foodMiner.image}
                                        />
                                        <GeneratorCard
                                            name="Knowledge Miner"
                                            level={generators.knowledgeMiner.level}
                                            cost={generators.knowledgeMiner.cost}
                                            onUpgrade={() => {
                                                upgradeGenerator('knowledgeMiner');
                                            }}
                                            backgroundImage={generators.knowledgeMiner.image}
                                        />
                                         <GeneratorCard
                                            name="Wood Miner"
                                            level={generators.woodMiner.level}
                                            cost={generators.woodMiner.cost}
                                            onUpgrade={() => {
                                                upgradeGenerator('woodMiner');
                                            }}
                                            backgroundImage={generators.woodMiner.image}
                                        />
                                            <GeneratorCard
                                            name="Rock Miner"
                                            level={generators.rockMiner.level}
                                            cost={generators.rockMiner.cost}
                                            onUpgrade={() => {
                                                upgradeGenerator('rockMiner');
                                            }}
                                            backgroundImage={generators.rockMiner.image}
                                        />
                                            <GeneratorCard
                                            name="Iron Miner"
                                            level={generators.ironMiner.level}
                                            cost={generators.ironMiner.cost}
                                            onUpgrade={() => {
                                                upgradeGenerator('ironMiner');
                                            }}
                                            backgroundImage={generators.ironMiner.image}
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
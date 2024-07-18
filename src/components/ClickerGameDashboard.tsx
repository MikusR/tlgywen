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
import coinImage from "@/assets/generators/coins.jpg";
import energyImage from "@/assets/generators/energy.jpg";
import dataImage from "@/assets/generators/data.jpg";
import backgroundSvg from "@/assets/leaves-6975462.svg";
import { Resources, Stats, Generators, ResourceType } from '../types';


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
        setResources(prev => ({...prev, clicks: prev.clicks + 1}));
        setStats(prev => ({
            ...prev,
            totalClicks: prev.totalClicks + 1,
            // totalResources: prev.totalResources + 1
        }));

        if (Math.random() < .1) {
            const dropPool: ResourceType[] = ['wood', 'food', 'knowledge', 'iron', 'rock'];
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
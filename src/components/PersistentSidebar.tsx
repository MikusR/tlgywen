import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import ResourceCard from './ResourceCard';
import { Resources, Stats } from '../types.ts';
import owlImage from "@/assets/owl.svg";
import coinImage from "@/assets/generators/coins.jpg";
import energyImage from "@/assets/generators/energy.jpg";
import dataImage from "@/assets/generators/data.jpg";

interface PersistentSidebarProps {
    stats: Stats;
    resources: Resources;
}

const PersistentSidebar: React.FC<PersistentSidebarProps> = ({stats, resources}) => (
    <div className="flex flex-col w-64 p-4 rounded-lg bg-card/90 text-card-foreground">
        <div className="flex items-center mb-6 space-x-4">
            <Avatar>
                <AvatarImage src={owlImage} alt="Avatar"/>
                <AvatarFallback><User/></AvatarFallback>
            </Avatar>
            <div>
                <h2 className="text-lg font-bold">Owl</h2>
                <p className="text-sm text-muted-foreground">Level {stats.level}</p>
            </div>
        </div>
        <div className="mb-6">
            <h3 className="mb-2 text-lg font-bold">Resources</h3>
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
        <div className="mt-auto space-y-2 text-muted-foreground">
            <p>Total Clicks: {stats.totalClicks}</p>
            <p>Total Resources: {stats.totalResources}</p>
            <p>Generators Owned: {stats.generatorsOwned}</p>
        </div>
    </div>
);

export default PersistentSidebar;
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import ResourceCard from './ResourceCard';
import { Resources, Stats } from '../types.ts';
import owlImage from "@/assets/owl.svg";
import coinImage from "@/assets/coins.svg";
import foodImage from "@/assets/food.svg";
import knowledgeImage from "@/assets/knowledge.svg";
import woodImage from "@/assets/wood.svg";
import ironImage from "@/assets/iron.svg";
import rockImage from "@/assets/rock.svg";

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
                name="Food"
                amount={resources.food}
                image={foodImage}
                description="Food for eating."
            />
            <ResourceCard
                name="Knowledge"
                amount={resources.knowledge}
                image={knowledgeImage}
                description="Knowledge of the world around you"
            />
             <ResourceCard
                name="Wood"
                amount={resources.wood}
                image={woodImage}
                description="Wood for building"
            />
             <ResourceCard
                name="Rock"
                amount={resources.rock}
                image={rockImage}
                description="Rock for building"
            />
             <ResourceCard
                name="Iron"
                amount={resources.iron}
                image={ironImage}
                description="Iron for building"
            />
        </div>
        <div className="mt-auto space-y-2 text-muted-foreground">
            <p>Total Clicks: {stats.totalClicks}</p>
        </div>
    </div>
);

export default PersistentSidebar;
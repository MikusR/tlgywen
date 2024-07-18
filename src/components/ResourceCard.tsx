import React from 'react';
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";

interface ResourceCardProps {
    name: string;
    amount: number;
    image: string;
    description: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({name, amount, image, description}) => {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div
                    className="flex items-center justify-between p-2 mb-2 rounded cursor-pointer bg-muted/90 hover:bg-secondary">
                    <div className="flex items-center">
                        <img src={image} alt={name} className="object-cover w-6 h-6 mr-2 rounded"/>
                        <span className="text-sm text-foreground">{name}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{amount.toLocaleString()}</span>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                    <Avatar>
                        <AvatarFallback>
                            <img src={image} alt={name} className="object-cover w-full h-full"/>
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

export default ResourceCard;
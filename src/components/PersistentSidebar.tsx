import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import ResourceCard from "@/components/ResourceCard";
import { PersistentSidebarProps, ResourceType } from "../types";
import { images, ImageKey } from "@/assets/imageAssets";

export interface ResourceCardProps {
  name: ResourceType;
  amount: number;
  image: ImageKey;
}

const resourceDescriptions: Record<ResourceType, string> = {
  coins: "The primary currency used for upgrades and purchases.",
  food: "Food for sustenance and population growth.",
  knowledge: "Accumulated wisdom and scientific progress.",
  wood: "Basic building material for structures.",
  rock: "Sturdy material for advanced constructions.",
  iron: "Essential for tools and advanced technology.",
};

const PersistentSidebar: React.FC<PersistentSidebarProps> = ({
  stats,
  resources,
}) => (
  <div className="flex flex-col w-64 p-4 rounded-lg bg-card/90 text-card-foreground">
    <div className="flex items-center mb-6 space-x-4">
      <Avatar>
        <AvatarImage src={images["owl"]} alt="Avatar" />
        <AvatarFallback>
          <User />
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-lg font-bold">Owl</h2>
        <p className="text-sm text-muted-foreground">Level {stats.level}</p>
      </div>
    </div>
    <div className="mb-6">
      <h3 className="mb-2 text-lg font-bold">Resources</h3>
      {(Object.keys(resources) as ResourceType[]).map((resourceType) => (
        <ResourceCard
          key={resourceType}
          name={resourceType}
          amount={resources[resourceType]}
          image={images[resourceType]}
          description={resourceDescriptions[resourceType]}
        />
      ))}
    </div>
    <div className="mt-auto space-y-2 text-muted-foreground">
      <p>Total Clicks: {stats.totalClicks}</p>
    </div>
  </div>
);

export default PersistentSidebar;

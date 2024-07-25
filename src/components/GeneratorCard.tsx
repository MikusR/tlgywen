import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowUp } from 'lucide-react';

interface GeneratorCardProps {
    name: string;
    level: number;
    cost: number;
    onUpgrade: () => void;
    backgroundImage: string;
}

const GeneratorCard: React.FC<GeneratorCardProps> = ({name, level, cost, onUpgrade, backgroundImage}) => (
    <Card className="mb-2 overflow-hidden">
        <div className="flex h-24">
            <div
                className="flex-shrink-0 w-24 h-24 bg-center bg-cover"
                style={{backgroundImage: `url(${[backgroundImage]})`}}
            />
            <div className="relative flex-grow p-2">
                <div className="flex items-start justify-between h-full">
                    <div>
                        <h3 className="font-bold text-foreground">{name}</h3>
                        <p className="text-sm text-muted-foreground">Level: {level}</p>
                    </div>
                    <Button
                        onClick={onUpgrade}
                        size="sm"
                        variant="secondary"
                    >
                        <ArrowUp className="w-4 h-4 mr-1"/>
                        {cost}
                    </Button>
                </div>
                <Progress value={level % 10 * 10} className="absolute bottom-0 left-0 right-0"/>
            </div>
        </div>
    </Card>
);

export default GeneratorCard;
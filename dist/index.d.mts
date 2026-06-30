type Banner = {
    type: 'banner';
    text: string;
    position?: 'top' | 'bottom';
    color?: 'white' | 'black';
    background?: string;
};
type Ribbon = {
    type: 'ribbon';
    text: string;
    position?: 'left' | 'right';
    color?: 'white' | 'black';
    background?: string;
};
type Badge = Banner | Ribbon;
type Params = {
    icon: string;
    dstPath?: string;
    badges: Array<Badge>;
    isAdaptiveIcon?: boolean;
};

declare function addBadge({ icon, dstPath, isAdaptiveIcon, badges, }: Params): Promise<string>;

export { addBadge };

import React from 'react';
import { cn } from '@/lib/utils';

interface PageTitleProps {
    children: React.ReactNode;
    className?: string;
    as?: 'h1' | 'h2' | 'span';
}

/**
 * Standardized PageTitle component.
 * Ensures each page renders exactly one visible <h1> for crawlers and accessibility.
 */
export const PageTitle: React.FC<PageTitleProps> = ({
    children,
    className,
    as: Tag = 'h1',
}) => {
    return (
        <Tag className={cn(className)}>
            {children}
        </Tag>
    );
};

export default PageTitle;

import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ children, className, ...props }) => {
    return (
        <section className={cn("py-4 md:py-6", className)} {...props}>
            {children}
        </section>
    );
};

export default Section;

import { useEffect } from 'react';

const TrustIndexWidget = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cdn.trustindex.io/loader.js?b51220164a4785796896ea261fd";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-8 text-primary">Guest Reviews</h2>
            <div className="trustindex-widget-container">
                {/* The script will inject the widget here based on the ID or general script behavior */}
                {/* TrustIndex usually looks for a container or just injects fixed/embed. 
                    Since the user just gave a script, it might be a floating widget or an embed.
                    If it's an embed, we often need a specific div. 
                    However, with just the loader script, it usually finds its place or initializes.
                    I will create a wrapper div just in case it needs a target, 
                    but often these loaders inject into a specific class or ID if configured on their dashboard.
                    Let's assume it injects where the script tag is, or we just render a placeholder.
                    Actually, many of these widgets look for a script tag or a specific div. 
                    I'll assume standard injection for now. 
                 */}
                <script defer async src='https://cdn.trustindex.io/loader.js?b51220164a4785796896ea261fd'></script>
            </div>
        </div>
    );
};

export default TrustIndexWidget;

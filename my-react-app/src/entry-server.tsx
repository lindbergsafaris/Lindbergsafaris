import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SWRConfig } from 'swr';
import './i18n';
import AppRoutes from './AppRoutes';

export function render(url: string, swrFallback: Record<string, any> = {}) {
    const helmetContext: any = {};

    const html = renderToString(
        <HelmetProvider context={helmetContext}>
            <SWRConfig value={{ fallback: swrFallback, provider: () => new Map() }}>
                <MemoryRouter initialEntries={[url]}>
                    <AppRoutes />
                </MemoryRouter>
            </SWRConfig>
        </HelmetProvider>
    );

    return {
        html,
        helmet: helmetContext.helmet
    };
}

import { requireCmsSession } from '@/lib/supabase/auth';
import { CONTENT_TYPE_CONFIGS } from '@/lib/cms/registry';
import AdminShell from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireCmsSession();

  const navConfigs = CONTENT_TYPE_CONFIGS.map((c) => ({
    slug: c.slug,
    plural: c.plural,
    icon: c.icon,
  }));

  return (
    <AdminShell
      profile={session.profile}
      configs={navConfigs}
      showUsersLink={true}
    >
      {children}
    </AdminShell>
  );
}

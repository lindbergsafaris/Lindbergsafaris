import { redirect } from 'next/navigation';
import { requireCmsSession } from '@/lib/supabase/auth';
import UsersManager, { type UserProfileRow } from '@/components/admin/UsersManager';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const session = await requireCmsSession();

  if (session.profile.role !== 'admin') {
    redirect('/admin');
  }

  const { data } = await session.supabase
    .from('profiles')
    .select('id, email, full_name, role, created_at')
    .order('created_at', { ascending: true });

  return (
    <UsersManager
      currentUserId={session.userId}
      initialUsers={(data ?? []) as UserProfileRow[]}
    />
  );
}

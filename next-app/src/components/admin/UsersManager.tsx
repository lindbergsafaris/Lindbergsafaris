'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Check,
  Loader2,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import type { CmsRole } from '@/lib/supabase/auth';

export interface UserProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: CmsRole;
  created_at: string;
}

export default function UsersManager({
  currentUserId,
  initialUsers,
}: {
  currentUserId: string;
  initialUsers: UserProfileRow[];
}) {
  const [users, setUsers] = useState<UserProfileRow[]>(initialUsers);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<CmsRole>('editor');
  const [inviting, setInviting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserProfileRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const reloadUsers = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (res.ok && Array.isArray(data.users)) {
      setUsers(data.users);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          full_name: fullName.trim() || undefined,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invite failed');
      }

      setEmail('');
      setFullName('');
      setRole('editor');
      setSuccess(`Invited ${data.profile?.email || email} as ${role}.`);
      await reloadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invite failed');
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (userId: string, nextRole: CmsRole) => {
    setBusyId(userId);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not update role');
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
      );
      setSuccess('User role updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update role');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not remove user');
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setSuccess(`Removed ${deleteTarget.email} from CMS access.`);
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove user');
      setDeleteTarget(null);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Users & Roles
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Invite CMS staff and manage administrator or editor permissions.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Invite Form */}
      <div className="bg-surface rounded-lg border border-stone-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-primary" />
          <h2 className="font-serif font-bold text-lg text-gray-900">
            Invite Staff Member
          </h2>
        </div>

        <form
          onSubmit={handleInvite}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
        >
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Email Address <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@lindbergsafaris.com"
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Full Name (optional)
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as CmsRole)}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="editor">Editor (create & edit)</option>
              <option value="admin">Admin (full access + delete + users)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={inviting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50"
          >
            {inviting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            <span>{inviting ? 'Sending...' : 'Send Invite'}</span>
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-surface rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h2 className="font-serif font-bold text-lg text-gray-900">
            CMS Profiles ({users.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-600">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-stone-500">
                    No user profiles found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSelf = u.id === currentUserId;
                  const isBusy = busyId === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-stone-50/70">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {u.full_name || u.email}
                          {isSelf && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[11px] font-medium">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-500">{u.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        {isSelf ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 text-primary-dark text-xs font-semibold capitalize">
                            <Shield className="w-3 h-3" />
                            {u.role}
                          </span>
                        ) : (
                          <select
                            value={u.role}
                            disabled={isBusy}
                            onChange={(e) =>
                              handleRoleChange(u.id, e.target.value as CmsRole)
                            }
                            aria-label={`Change role for ${u.email}`}
                            className="rounded border border-stone-300 bg-white px-2.5 py-1 text-xs font-medium capitalize focus:border-primary focus:outline-none"
                          >
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-500">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isSelf ? (
                          <span className="text-xs text-stone-400">Protected</span>
                        ) : (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => setDeleteTarget(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-lg max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-serif font-bold text-gray-900">
              Remove CMS User?
            </h2>
            <p className="text-sm text-stone-600">
              Removing <strong>{deleteTarget.email}</strong> revokes their access to the CMS immediately.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-md border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={busyId === deleteTarget.id}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {busyId === deleteTarget.id && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Remove User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

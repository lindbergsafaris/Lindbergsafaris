import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isValidCmsRole } from '@/lib/supabase/auth';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid credentials format' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || 'Invalid email or password' },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, role')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError || !profile || !isValidCmsRole(profile.role)) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: 'No access' }, { status: 403 });
    }

    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

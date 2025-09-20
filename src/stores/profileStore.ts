import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'owner' | 'user';
  cnpj: string | null;
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  fetchProfile: (session: Session | null) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: true,
  fetchProfile: async (session: Session | null) => {
    if (!session) {
      set({ profile: null, loading: false });
      return;
    }

    set({ loading: true });
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      set({ profile: null, loading: false });
    } else {
      set({ profile: data, loading: false });
    }
  },
}));
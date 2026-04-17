/* ========================================
   BUG BROS — DATABASE TYPES
   ======================================== */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: 'admin' | 'member';
          short_bio: string | null;
          bio: string | null;
          avatar_url: string | null;
          skills: string[];
          resume_url: string | null;
          github_url: string | null;
          linkedin_url: string | null;
          website_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role?: 'admin' | 'member';
          short_bio?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          skills?: string[];
          resume_url?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          website_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: 'admin' | 'member';
          short_bio?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          skills?: string[];
          resume_url?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          website_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          full_description: string | null;
          tech_stack: string[];
          live_url: string | null;
          github_url: string | null;
          screenshots: string[];
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          full_description?: string | null;
          tech_stack?: string[];
          live_url?: string | null;
          github_url?: string | null;
          screenshots?: string[];
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          full_description?: string | null;
          tech_stack?: string[];
          live_url?: string | null;
          github_url?: string | null;
          screenshots?: string[];
          is_featured?: boolean;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          type: 'hackathon' | 'ctf' | 'other';
          badge_url: string | null;
          date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          type: 'hackathon' | 'ctf' | 'other';
          badge_url?: string | null;
          date?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          type?: 'hackathon' | 'ctf' | 'other';
          badge_url?: string | null;
          date?: string | null;
        };
      };
      experiences: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          company: string;
          description: string | null;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          company: string;
          description?: string | null;
          start_date: string;
          end_date?: string | null;
          is_current?: boolean;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          title?: string;
          company?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string | null;
          is_current?: boolean;
        };
      };
      contributors: {
        Row: {
          project_id: string;
          user_id: string;
        };
        Insert: {
          project_id: string;
          user_id: string;
        };
        Update: {
          project_id?: string;
          user_id?: string;
        };
      };
      participants: {
        Row: {
          achievement_id: string;
          user_id: string;
        };
        Insert: {
          achievement_id: string;
          user_id: string;
        };
        Update: {
          achievement_id?: string;
          user_id?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          email?: string;
          message?: string;
          is_read?: boolean;
        };
      };
      about_content: {
        Row: {
          id: string;
          section: 'story' | 'mission' | 'vision' | 'timeline';
          title: string | null;
          content: string | null;
          date: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section: 'story' | 'mission' | 'vision' | 'timeline';
          title?: string | null;
          content?: string | null;
          date?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          section?: 'story' | 'mission' | 'vision' | 'timeline';
          title?: string | null;
          content?: string | null;
          date?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
}

// Convenience type aliases
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type Achievement = Database['public']['Tables']['achievements']['Row'];
export type AchievementInsert = Database['public']['Tables']['achievements']['Insert'];
export type AchievementUpdate = Database['public']['Tables']['achievements']['Update'];

export type Experience = Database['public']['Tables']['experiences']['Row'];
export type ExperienceInsert = Database['public']['Tables']['experiences']['Insert'];
export type ExperienceUpdate = Database['public']['Tables']['experiences']['Update'];

export type Contributor = Database['public']['Tables']['contributors']['Row'];
export type Participant = Database['public']['Tables']['participants']['Row'];

export type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
export type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert'];

export type AboutContent = Database['public']['Tables']['about_content']['Row'];
export type AboutContentInsert = Database['public']['Tables']['about_content']['Insert'];
export type AboutContentUpdate = Database['public']['Tables']['about_content']['Update'];

// Extended types with relations
export type ProjectWithContributors = Project & {
  contributors: { users: User }[];
};

export type AchievementWithParticipants = Achievement & {
  participants: { users: User }[];
};

export type UserWithRelations = User & {
  experiences: Experience[];
  contributors: { projects: Project }[];
  participants: { achievements: Achievement }[];
};

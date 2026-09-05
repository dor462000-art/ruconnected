import { supabase } from '@/integrations/supabase/client';
import { UserProfile, SchoolType, DegreeLevel, LookingForType } from '@/types/social';

/**
 * Loads the signed-in student's full profile (basic info + academic details +
 * campus involvement). Returns null when onboarding hasn't been completed yet.
 */
export const loadProfile = async (userId: string): Promise<UserProfile | null> => {
  const [{ data: profile }, { data: academic }, { data: involvement }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('academic_details').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('campus_involvement').select('*').eq('user_id', userId).maybeSingle(),
  ]);

  if (!profile || !profile.onboarding_complete) return null;

  return {
    id: userId,
    studentId: profile.student_id || (profile.email || '').split('@')[0],
    name: profile.full_name || 'Anonymous',
    age: profile.age || 20,
    school: (academic?.school as SchoolType) || 'Israeli',
    degreeLevel: (academic?.degree_level as DegreeLevel) || 'Undergraduate',
    degree: academic?.degree || 'General',
    year: academic?.year || 1,
    interests: involvement?.interests || [],
    lookingFor: (involvement?.looking_for as LookingForType[]) || ['Friendship'],
    specialPrograms: involvement?.special_programs || [],
    clubs: involvement?.clubs || [],
    volunteering: involvement?.volunteering || [],
    bio: profile.bio || '',
    avatarColor: profile.avatar_color || 'bg-primary',
    skills: involvement?.skills || [],
    availability: involvement?.availability || '',
  };
};

/** Persists a full profile across the three tables. */
export const saveProfile = async (userId: string, email: string, p: UserProfile) => {
  const results = await Promise.all([
    supabase.from('profiles').upsert({
      id: userId,
      email,
      student_id: p.studentId,
      full_name: p.name,
      age: p.age,
      bio: p.bio,
      avatar_color: p.avatarColor,
      school: p.school,
      degree: p.degree,
      year: String(p.year),
      programs: p.specialPrograms,
      clubs: p.clubs,
      volunteering: p.volunteering,
      skills: p.skills || [],
      availability: p.availability ? [p.availability] : [],
      interests: p.interests,
      looking_for: p.lookingFor,
      onboarding_complete: true,
    }),
    supabase.from('academic_details').upsert({
      user_id: userId,
      school: p.school,
      degree_level: p.degreeLevel,
      degree: p.degree,
      year: p.year,
    }),
    supabase.from('campus_involvement').upsert({
      user_id: userId,
      special_programs: p.specialPrograms,
      clubs: p.clubs,
      volunteering: p.volunteering,
      skills: p.skills || [],
      interests: p.interests,
      looking_for: p.lookingFor,
      availability: p.availability || null,
    }),
  ]);

  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);
};

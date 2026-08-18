import { supabase } from '@/integrations/supabase/client';

type MfaFactor = {
  id: string;
  factor_type: 'totp' | 'phone';
  status: 'verified' | 'unverified';
};

export const getVerifiedTotpFactors = async (): Promise<MfaFactor[]> => {
  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error) {
    throw error;
  }

  return (data?.all ?? []).filter(
    (factor): factor is MfaFactor => factor.factor_type === 'totp' && factor.status === 'verified',
  );
};

export const getUnverifiedTotpFactors = async (): Promise<MfaFactor[]> => {
  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error) {
    throw error;
  }

  return (data?.all ?? []).filter(
    (factor): factor is MfaFactor => factor.factor_type === 'totp' && factor.status === 'unverified',
  );
};

export const cleanupUnverifiedTotpFactors = async () => {
  const unverifiedFactors = await getUnverifiedTotpFactors();

  await Promise.all(unverifiedFactors.map((factor) => supabase.auth.mfa.unenroll({ factorId: factor.id })));
};

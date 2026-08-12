import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JoinNetworkButtonProps {
  loading?: boolean;
  label?: string;
}

export const JoinNetworkButton: React.FC<JoinNetworkButtonProps> = ({
  loading,
  label = 'Join the network',
}) => (
  <Button
    type="submit"
    disabled={loading}
    className="group h-14 w-full rounded-2xl text-base font-semibold shadow-lg shadow-primary/25 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0"
  >
    {loading ? 'Sending code...' : label}
    {!loading && (
      <ArrowRight
        size={20}
        className="ml-1 transition-transform duration-200 group-hover:translate-x-1"
      />
    )}
  </Button>
);

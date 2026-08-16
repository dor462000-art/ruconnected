import React from 'react';

/**
 * Full-bleed background artwork layer.
 * No student illustration — just a clean white base with a few subtle,
 * soft-edged blue organic shapes for depth. Anchored toward the top so the
 * headline / email / button area stays crisp. pointer-events disabled so it
 * can never block the interactive UI.
 */
export const BackgroundArtwork: React.FC = () => (
  <div className="absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden bg-background">
    {/* soft blue blobs — low opacity, blurred, anchored top */}
    <div
      className="absolute -top-24 -left-20 h-[42vh] w-[42vh] rounded-full blur-3xl"
      style={{ background: 'radial-gradient(circle at center, rgba(52,97,214,0.16), rgba(52,97,214,0) 70%)' }}
    />
    <div
      className="absolute -top-16 right-[-10%] h-[38vh] w-[38vh] rounded-full blur-3xl"
      style={{ background: 'radial-gradient(circle at center, rgba(52,97,214,0.12), rgba(52,97,214,0) 70%)' }}
    />
    {/* faint accent lower-right, never crowding the bottom UI */}
    <div
      className="absolute bottom-[6%] right-[-12%] h-[30vh] w-[30vh] rounded-full blur-3xl"
      style={{ background: 'radial-gradient(circle at center, rgba(52,97,214,0.08), rgba(52,97,214,0) 70%)' }}
    />

    {/* crisp white wash over the content column for readability */}
    <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/85" />
  </div>
);

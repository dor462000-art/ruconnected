import React from 'react';
import bgAsset from '@/assets/login-bg.png.asset.json';

/**
 * Full-bleed background artwork layer.
 * - never distorted (cover), anchored to the bottom so the networking
 *   illustration stays visible on any aspect ratio
 * - pointer-events disabled so it can never block the interactive UI
 */
export const BackgroundArtwork: React.FC = () => (
  <div className="absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden">
    <img
      src={bgAsset.url}
      alt=""
      aria-hidden="true"
      width={1088}
      height={1920}
      className="absolute inset-0 h-full w-full object-cover object-bottom md:object-[center_85%]"
      draggable={false}
    />
    {/* readability overlay — top fades to white-ish, bottom untouched */}
    <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/45 to-transparent" />
  </div>
);

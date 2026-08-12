import React from 'react';
import bgImage from '@/assets/login-bg.webp';


/**
 * Full-bleed background artwork layer.
 * - never distorted (cover), anchored to the bottom so the networking
 *   illustration stays visible on any aspect ratio
 * - pointer-events disabled so it can never block the interactive UI
 */
export const BackgroundArtwork: React.FC = () => (
  <div className="absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden">
    <img
      src={bgImage}
      alt=""
      aria-hidden="true"
      width={1088}
      height={1920}
      className="absolute inset-0 h-full w-full object-cover object-bottom"
      draggable={false}
    />
    {/* readability overlay — stronger on wide/short screens where the art sits higher */}
    <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/55 to-transparent md:from-background md:via-background/92 md:to-background/50" />

  </div>
);

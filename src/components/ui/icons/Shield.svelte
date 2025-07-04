<script>
  export let size = 90;
  export let animated = false;
</script>

{#if animated}
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" class="shield-animated">
    <!-- Outer ring with segments -->
    <circle cx="60" cy="60" r="50" 
            stroke="currentColor" 
            stroke-width="2" 
            fill="none" 
            opacity="0.3"
            stroke-dasharray="8,4"/>
    
    <!-- Middle ring -->
    <circle cx="60" cy="60" r="35" 
            stroke="currentColor" 
            stroke-width="1.5" 
            fill="none" 
            opacity="0.6"
            stroke-dasharray="12,3"/>
    
    <!-- Shield shape -->
    <path d="M60 25 L75 35 L75 55 L70 70 L60 75 L50 70 L45 55 L45 35 Z" 
          stroke="currentColor" 
          stroke-width="2" 
          fill="rgba(99, 102, 241, 0.1)" 
          opacity="0.8"/>
    
    <!-- Key symbol in center -->
    <circle cx="60" cy="45" r="6" 
            stroke="currentColor" 
            stroke-width="2" 
            fill="none" 
            opacity="0.9"/>
    <rect x="58" y="51" width="4" height="15" 
          fill="currentColor" 
          opacity="0.9"/>
    <rect x="62" y="58" width="6" height="3" 
          fill="currentColor" 
          opacity="0.9"/>
    <rect x="62" y="62" width="4" height="3" 
          fill="currentColor" 
          opacity="0.9"/>
    
    <!-- Corner accent dots -->
    <circle cx="25" cy="25" r="2" fill="currentColor" opacity="0.4"/>
    <circle cx="95" cy="25" r="2" fill="currentColor" opacity="0.4"/>
    <circle cx="25" cy="95" r="2" fill="currentColor" opacity="0.4"/>
    <circle cx="95" cy="95" r="2" fill="currentColor" opacity="0.4"/>
    
    <!-- Data flow lines -->
    <path d="M30 60 Q45 45 60 60 Q75 75 90 60" 
          stroke="currentColor" 
          stroke-width="1" 
          fill="none" 
          opacity="0.5"
          stroke-dasharray="3,2"/>
    <path d="M60 30 Q75 45 60 60 Q45 75 60 90" 
          stroke="currentColor" 
          stroke-width="1" 
          fill="none" 
          opacity="0.5"
          stroke-dasharray="3,2"/>
  </svg>
{:else}
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <circle cx="12" cy="7" r="4" />
    <path d="M12 1v6" />
  </svg>
{/if}

<style>
  .shield-animated {
    animation: secretPulse 4s ease-in-out infinite;
    filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.5));
    transform-origin: center;
  }

  .shield-animated circle:first-child {
    animation: outerRing 15s linear infinite;
    filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
  }

  .shield-animated circle:nth-child(2) {
    animation: innerRing 10s linear infinite reverse;
    filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.4));
  }

  .shield-animated path:first-of-type {
    animation: shieldGlow 3s ease-in-out infinite alternate;
    filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.4));
  }

  .shield-animated path:last-child,
  .shield-animated path:nth-last-child(2) {
    animation: dataFlow 4s ease-in-out infinite;
    filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.3));
  }

  /* Enhanced corner dots with pulsing */
  .shield-animated circle:nth-child(6),
  .shield-animated circle:nth-child(7),
  .shield-animated circle:nth-child(8),
  .shield-animated circle:nth-child(9) {
    animation: cornerPulse 2s ease-in-out infinite;
  }

  /* Staggered delays for corner dots */
  .shield-animated circle:nth-child(6) { animation-delay: 0s; }
  .shield-animated circle:nth-child(7) { animation-delay: 0.5s; }
  .shield-animated circle:nth-child(8) { animation-delay: 1s; }
  .shield-animated circle:nth-child(9) { animation-delay: 1.5s; }

  @keyframes secretPulse {
    0%, 100% { 
      transform: scale(1) rotate(0deg);
      filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.5));
    }
    25% {
      transform: scale(1.02) rotate(0.5deg);
      filter: drop-shadow(0 0 25px rgba(99, 102, 241, 0.6));
    }
    50% { 
      transform: scale(1.05) rotate(0deg);
      filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.7));
    }
    75% {
      transform: scale(1.02) rotate(-0.5deg);
      filter: drop-shadow(0 0 25px rgba(99, 102, 241, 0.6));
    }
  }

  @keyframes outerRing {
    0% { 
      stroke-dashoffset: 0; 
      opacity: 0.3;
    }
    50% {
      opacity: 0.6;
    }
    100% { 
      stroke-dashoffset: 75; 
      opacity: 0.3;
    }
  }

  @keyframes innerRing {
    0% { 
      stroke-dashoffset: 0; 
      opacity: 0.6;
    }
    50% {
      opacity: 0.9;
    }
    100% { 
      stroke-dashoffset: -90; 
      opacity: 0.6;
    }
  }

  @keyframes shieldGlow {
    0% { 
      opacity: 0.8; 
      filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4));
      fill: rgba(99, 102, 241, 0.1);
    }
    50% {
      opacity: 0.9;
      filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.6));
      fill: rgba(139, 92, 246, 0.15);
    }
    100% { 
      opacity: 1; 
      filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.8));
      fill: rgba(99, 102, 241, 0.2);
    }
  }

  @keyframes dataFlow {
    0% { 
      opacity: 0.3; 
      stroke-dashoffset: 0;
    }
    25% {
      opacity: 0.6;
      stroke-dashoffset: 5;
    }
    50% { 
      opacity: 0.9; 
      stroke-dashoffset: 10;
    }
    75% {
      opacity: 0.6;
      stroke-dashoffset: 15;
    }
    100% { 
      opacity: 0.3; 
      stroke-dashoffset: 20;
    }
  }

  @keyframes cornerPulse {
    0%, 100% {
      opacity: 0.4;
      transform: scale(1);
      filter: drop-shadow(0 0 2px rgba(99, 102, 241, 0.3));
    }
    50% {
      opacity: 0.8;
      transform: scale(1.5);
      filter: drop-shadow(0 0 6px rgba(99, 102, 241, 0.6));
    }
  }

  /* Enhanced non-animated shield */
  svg:not(.shield-animated) {
    transition: all 0.3s ease;
    filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
  }

  svg:not(.shield-animated):hover {
    transform: scale(1.1);
    filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.5));
  }
</style> 
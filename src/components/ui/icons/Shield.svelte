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
    filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.4));
  }

  .shield-animated circle:first-child {
    animation: outerRing 15s linear infinite;
  }

  .shield-animated circle:nth-child(2) {
    animation: innerRing 10s linear infinite reverse;
  }

  .shield-animated path:first-of-type {
    animation: shieldGlow 3s ease-in-out infinite alternate;
  }

  .shield-animated path:last-child,
  .shield-animated path:nth-last-child(2) {
    animation: dataFlow 4s ease-in-out infinite;
  }

  @keyframes secretPulse {
    0%, 100% { 
      transform: scale(1);
      filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.4));
    }
    50% { 
      transform: scale(1.03);
      filter: drop-shadow(0 0 25px rgba(99, 102, 241, 0.6));
    }
  }

  @keyframes outerRing {
    from { stroke-dashoffset: 0; }
    to { stroke-dashoffset: 75; }
  }

  @keyframes innerRing {
    from { stroke-dashoffset: 0; }
    to { stroke-dashoffset: -90; }
  }

  @keyframes shieldGlow {
    from { 
      opacity: 0.8; 
      filter: drop-shadow(0 0 5px rgba(99, 102, 241, 0.3));
    }
    to { 
      opacity: 1; 
      filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.6));
    }
  }

  @keyframes dataFlow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
  }
</style> 
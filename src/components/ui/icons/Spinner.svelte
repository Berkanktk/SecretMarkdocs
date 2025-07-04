<script>
  export let size = 16;
</script>

<div class="spinner" style="width: {size}px; height: {size}px;">
  <div class="spinner-inner"></div>
</div>

<style>
  .spinner {
    position: relative;
    border-radius: 50%;
    animation: spin 1.2s linear infinite;
    filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4));
  }

  .spinner::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(99, 102, 241, 0.2) 90deg,
      rgba(139, 92, 246, 0.6) 180deg,
      rgba(99, 102, 241, 0.9) 270deg,
      currentColor 360deg
    );
    animation: spinGradient 1.2s linear infinite;
  }

  .spinner::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    border-radius: 50%;
    background: rgba(15, 15, 35, 0.9);
    backdrop-filter: blur(10px);
  }

  .spinner-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20%;
    height: 20%;
    background: currentColor;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 6px currentColor;
    animation: pulse 1.2s ease-in-out infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spinGradient {
    0% {
      transform: rotate(0deg);
      filter: hue-rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
      filter: hue-rotate(90deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.8;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.2);
    }
  }

  /* Enhanced spinner for larger sizes */
  .spinner[style*="24px"], 
  .spinner[style*="32px"] {
    filter: drop-shadow(0 0 12px rgba(99, 102, 241, 0.5));
  }

  .spinner[style*="24px"]::before,
  .spinner[style*="32px"]::before {
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(99, 102, 241, 0.3) 60deg,
      rgba(139, 92, 246, 0.7) 120deg,
      rgba(99, 102, 241, 0.9) 240deg,
      currentColor 360deg
    );
  }
</style> 
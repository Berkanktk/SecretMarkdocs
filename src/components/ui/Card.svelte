<script>
  export let hover = false;
  export let padding = 'normal'; // 'small', 'normal', 'large'
  export let variant = 'default'; // 'default', 'note', 'secret'
  
  $: classes = [
    'card',
    `card-${variant}`,
    `card-${padding}`,
    hover && 'card-hover'
  ].filter(Boolean).join(' ');
</script>

<div class={classes} {...$$restProps}>
  <slot />
</div>

<style>
  .card {
    background: rgba(15, 15, 35, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 20px;
    transition: all 0.3s ease;
    box-shadow: 
      0 10px 25px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
  }

  .card-small {
    padding: 1rem;
    border-radius: 16px;
  }

  .card-normal {
    padding: 1.5rem;
    border-radius: 20px;
  }

  .card-large {
    padding: 2rem;
    border-radius: 24px;
  }

  .card-hover:hover {
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(99, 102, 241, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    border-color: rgba(99, 102, 241, 0.4);
  }

  .card-note {
    box-shadow: 
      0 8px 20px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .card-secret {
    background: rgba(15, 15, 35, 0.95);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(99, 102, 241, 0.3);
    color: #f1f5f9;
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(99, 102, 241, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .card-secret::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }

  .card-secret > :global(*) {
    position: relative;
    z-index: 2;
  }

  /* Subtle glow effect for cards */
  .card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 0;
  }

  .card-hover:hover::after {
    opacity: 1;
  }

  /* Ensure card content is above the glow */
  .card > :global(*) {
    position: relative;
    z-index: 1;
  }

  /* Special animation for card appearance */
  .card {
    animation: cardSlideIn 0.6s ease-out;
  }

  @keyframes cardSlideIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Enhanced focus styles for interactive cards */
  .card:focus-within {
    outline: none;
    box-shadow: 
      0 0 0 3px rgba(99, 102, 241, 0.2),
      0 15px 35px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(99, 102, 241, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
</style> 
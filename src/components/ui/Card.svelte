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
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    transition: var(--transition);
    box-shadow: var(--shadow);
  }

  .card-small {
    padding: 1rem;
  }

  .card-normal {
    padding: 1.5rem;
  }

  .card-large {
    padding: 2rem;
  }

  .card-hover:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }

  .card-note {
    box-shadow: var(--shadow);
  }

  .card-secret {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2d3748 100%);
    border: 1px solid rgba(148, 163, 184, 0.1);
    color: #f1f5f9;
  }

  .card-secret::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
</style> 
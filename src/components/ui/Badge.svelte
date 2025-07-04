<script>
  export let variant = 'default'; // 'default', 'success', 'danger', 'warning', 'info'
  export let size = 'medium'; // 'small', 'medium', 'large'
  
  $: classes = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`
  ].filter(Boolean).join(' ');
</script>

<span class={classes} {...$$restProps}>
  <slot />
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 1rem;
    font-weight: 500;
    white-space: nowrap;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    letter-spacing: 0.02em;
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .badge-small {
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 0.75rem;
  }

  .badge-medium {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border-radius: 1rem;
  }

  .badge-large {
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    border-radius: 1.25rem;
  }

  .badge-default {
    background: rgba(15, 15, 35, 0.8);
    color: #94a3b8;
    border: 1px solid rgba(99, 102, 241, 0.2);
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .badge-secondary {
    background: rgba(15, 15, 35, 0.8);
    color: #94a3b8;
    border: 1px solid rgba(99, 102, 241, 0.2);
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .badge-success {
    background: rgba(34, 197, 94, 0.15);
    color: #10b981;
    border: 1px solid rgba(34, 197, 94, 0.3);
    box-shadow: 
      0 2px 8px rgba(34, 197, 94, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .badge-danger {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
    box-shadow: 
      0 2px 8px rgba(239, 68, 68, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .badge-warning {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.3);
    box-shadow: 
      0 2px 8px rgba(245, 158, 11, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .badge-info {
    background: rgba(99, 102, 241, 0.15);
    color: #6366f1;
    border: 1px solid rgba(99, 102, 241, 0.3);
    box-shadow: 
      0 2px 8px rgba(99, 102, 241, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  /* Hover effects */
  .badge:hover {
    transform: translateY(-1px);
  }

  .badge-default:hover {
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .badge-success:hover {
    border-color: rgba(34, 197, 94, 0.5);
    box-shadow: 
      0 4px 12px rgba(34, 197, 94, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  .badge-danger:hover {
    border-color: rgba(239, 68, 68, 0.5);
    box-shadow: 
      0 4px 12px rgba(239, 68, 68, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  .badge-warning:hover {
    border-color: rgba(245, 158, 11, 0.5);
    box-shadow: 
      0 4px 12px rgba(245, 158, 11, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  .badge-info:hover {
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 
      0 4px 12px rgba(99, 102, 241, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  /* Subtle pulse animation for badges */
  .badge {
    animation: badgeAppear 0.4s ease-out;
  }

  @keyframes badgeAppear {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
</style> 
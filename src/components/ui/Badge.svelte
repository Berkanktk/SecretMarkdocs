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
  }

  .badge-small {
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
  }

  .badge-medium {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .badge-large {
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
  }

  .badge-default {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
  }

  .badge-success {
    background: rgba(34, 197, 94, 0.1);
    color: #16a34a;
    border: 1px solid rgba(34, 197, 94, 0.2);
  }

  .badge-danger {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  .badge-warning {
    background: rgba(245, 158, 11, 0.1);
    color: #d97706;
    border: 1px solid rgba(245, 158, 11, 0.2);
  }

  .badge-info {
    background: rgba(99, 102, 241, 0.1);
    color: var(--primary-color);
    border: 1px solid rgba(99, 102, 241, 0.2);
  }
</style> 
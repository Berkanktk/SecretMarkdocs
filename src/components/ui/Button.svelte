<script>
// @ts-nocheck

  export let variant = 'primary'; // 'primary', 'secondary', 'danger'
  export let size = 'medium'; // 'small', 'medium', 'large'
  export let disabled = false;
  export let loading = false;
  export let type = 'button';
  export let fullWidth = false;
  export let href = undefined;
  
  $: tag = href ? 'a' : 'button';
  $: classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    disabled && 'disabled',
    loading && 'loading',
    fullWidth && 'full-width'
  ].filter(Boolean).join(' ');
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element this={tag} 
  {type}
  {href}
  {disabled}
  class={classes}
  on:click
  {...$$restProps}
>
  <slot />
</svelte:element>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: none;
    border-radius: var(--border-radius);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    text-decoration: none;
    font-family: inherit;
    position: relative;
    overflow: hidden;
  }

  .btn-small {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }

  .btn-medium {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }

  .btn-large {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }

  .btn-primary {
    background: var(--primary-color);
    color: white;
  }

  .btn-primary:hover:not(.disabled) {
    background: var(--primary-hover);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: var(--secondary-color);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }

  .btn-secondary:hover:not(.disabled) {
    background: rgba(148, 163, 184, 0.1);
    border-color: rgba(148, 163, 184, 0.3);
    transform: translateY(-1px);
  }

  .btn-danger {
    background: #ef4444;
    color: white;
  }

  .btn-danger:hover:not(.disabled) {
    background: #dc2626;
    transform: translateY(-1px);
  }

  .btn.disabled,
  .btn.loading {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .btn.full-width {
    width: 100%;
  }

  .btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
</style> 
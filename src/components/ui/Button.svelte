<script>
// @ts-nocheck
  import Spinner from './icons/Spinner.svelte';

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
  {#if loading}
    <Spinner size={size === 'small' ? 12 : size === 'large' ? 18 : 16} />
  {/if}
  <slot />
  <div class="button-glow"></div>
</svelte:element>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: none;
    border-radius: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    font-family: inherit;
    position: relative;
    overflow: hidden;
    letter-spacing: 0.02em;
    backdrop-filter: blur(20px);
  }

  .btn-small {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    border-radius: 8px;
  }

  .btn-medium {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    border-radius: 10px;
  }

  .btn-large {
    padding: 0.875rem 2rem;
    font-size: 1rem;
    border-radius: 12px;
  }

  .btn-primary {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    box-shadow: 
      0 4px 15px rgba(99, 102, 241, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .btn-primary:hover:not(.disabled) {
    background: linear-gradient(135deg, #5855eb 0%, #7c3aed 100%);
    transform: translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(99, 102, 241, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .btn-secondary {
    background: rgba(15, 15, 35, 0.9);
    color: #f1f5f9;
    border: 1px solid rgba(99, 102, 241, 0.2);
    box-shadow: 
      0 4px 15px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .btn-secondary:hover:not(.disabled) {
    background: rgba(15, 15, 35, 0.95);
    border-color: rgba(99, 102, 241, 0.4);
    transform: translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(99, 102, 241, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .btn-danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: 
      0 4px 15px rgba(239, 68, 68, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .btn-danger:hover:not(.disabled) {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(239, 68, 68, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
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
    box-shadow: 
      0 0 0 3px rgba(99, 102, 241, 0.2),
      0 4px 15px rgba(99, 102, 241, 0.3);
  }

  .button-glow {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
    pointer-events: none;
  }

  .btn:hover .button-glow {
    left: 100%;
  }

  .btn.disabled .button-glow,
  .btn.loading .button-glow {
    display: none;
  }

  /* Special focus styles for primary buttons */
  .btn-primary:focus {
    box-shadow: 
      0 0 0 3px rgba(99, 102, 241, 0.3),
      0 4px 15px rgba(99, 102, 241, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  /* Special focus styles for secondary buttons */
  .btn-secondary:focus {
    box-shadow: 
      0 0 0 3px rgba(99, 102, 241, 0.2),
      0 4px 15px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  /* Special focus styles for danger buttons */
  .btn-danger:focus {
    box-shadow: 
      0 0 0 3px rgba(239, 68, 68, 0.3),
      0 4px 15px rgba(239, 68, 68, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
</style> 
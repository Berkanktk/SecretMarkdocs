<script>
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let error = '';
  export let disabled = false;
  export let required = false;
  export let fullWidth = false;
  export let id = null;
  export let options = []; // Array of {value, label} objects
  
  $: inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  $: classes = [
    'select',
    error && 'select-error',
    disabled && 'select-disabled',
    fullWidth && 'select-full-width'
  ].filter(Boolean).join(' ');
</script>

<div class="select-group" class:full-width={fullWidth}>
  {#if label}
    <label for={inputId} class="select-label">
      {label}
      {#if required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}
  
  <select
    {id}
    {disabled}
    {required}
    bind:value
    class={classes}
    on:change
    on:focus
    on:blur
    {...$$restProps}
  >
    {#if placeholder}
      <option value="" disabled selected={!value}>{placeholder}</option>
    {/if}
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
    <slot />
  </select>
  
  {#if error}
    <div class="select-error-message">{error}</div>
  {/if}
</div>

<style>
  .select-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .select-group.full-width {
    width: 100%;
  }

  .select-label {
    font-weight: 500;
    color: #f1f5f9;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    letter-spacing: 0.02em;
  }

  .required {
    color: #ef4444;
  }

  .select {
    padding: 0.75rem 1rem;
    border: 2px solid rgba(99, 102, 241, 0.2);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    color: #f1f5f9;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    letter-spacing: 0.02em;
    box-shadow: 
      0 4px 15px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1rem;
    padding-right: 3rem;
  }

  .select:hover:not(.select-disabled) {
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }

  .select:focus {
    outline: none;
    border-color: #6366f1;
    background: rgba(0, 0, 0, 0.6);
    box-shadow: 
      0 0 0 3px rgba(99, 102, 241, 0.1),
      0 4px 20px rgba(99, 102, 241, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
    animation: focusGlow 0.3s ease-out;
  }

  .select-error {
    border-color: #ef4444;
    box-shadow: 
      0 4px 15px rgba(239, 68, 68, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .select-error:focus {
    border-color: #ef4444;
    box-shadow: 
      0 0 0 3px rgba(239, 68, 68, 0.1),
      0 4px 20px rgba(239, 68, 68, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .select-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba(0, 0, 0, 0.2);
    border-color: rgba(99, 102, 241, 0.1);
  }

  .select-disabled:focus {
    transform: none;
    box-shadow: 
      0 4px 15px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .select-full-width {
    width: 100%;
  }

  .select option {
    background: rgba(15, 15, 35, 0.95);
    color: #f1f5f9;
    padding: 0.75rem;
    border: none;
    font-size: 0.875rem;
  }

  .select option:hover,
  .select option:checked {
    background: rgba(99, 102, 241, 0.2);
    color: #f1f5f9;
  }

  .select-error-message {
    color: #ef4444;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .select-error-message::before {
    content: '⚠️';
    font-size: 0.75rem;
  }

  @keyframes focusGlow {
    0% {
      box-shadow: 
        0 0 0 0px rgba(99, 102, 241, 0.1),
        0 4px 15px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }
    100% {
      box-shadow: 
        0 0 0 3px rgba(99, 102, 241, 0.1),
        0 4px 20px rgba(99, 102, 241, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
  }
</style> 
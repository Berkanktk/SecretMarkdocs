<script>
  export let type = 'text';
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let error = '';
  export let disabled = false;
  export let required = false;
  export let fullWidth = false;
  export let id = null;
  
  $: inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  $: classes = [
    'input',
    error && 'input-error',
    disabled && 'input-disabled',
    fullWidth && 'input-full-width'
  ].filter(Boolean).join(' ');
</script>

<div class="input-group" class:full-width={fullWidth}>
  {#if label}
    <label for={inputId} class="input-label">
      {label}
      {#if required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}
  
  {#if type === 'text'}
    <input
      {id}
      type="text"
      {placeholder}
      {disabled}
      {required}
      bind:value
      class={classes}
      on:input
      on:change
      on:focus
      on:blur
      on:keypress
      {...$$restProps}
    />
  {:else if type === 'password'}
    <input
      {id}
      type="password"
      {placeholder}
      {disabled}
      {required}
      bind:value
      class={classes}
      on:input
      on:change
      on:focus
      on:blur
      on:keypress
      {...$$restProps}
    />
  {:else if type === 'email'}
    <input
      {id}
      type="email"
      {placeholder}
      {disabled}
      {required}
      bind:value
      class={classes}
      on:input
      on:change
      on:focus
      on:blur
      on:keypress
      {...$$restProps}
    />
  {:else}
    <input
      {id}
      type="text"
      {placeholder}
      {disabled}
      {required}
      bind:value
      class={classes}
      on:input
      on:change
      on:focus
      on:blur
      on:keypress
      {...$$restProps}
    />
  {/if}
  
  {#if error}
    <div class="input-error-message">{error}</div>
  {/if}
</div>

<style>
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-group.full-width {
    width: 100%;
  }

  .input-label {
    font-weight: 500;
    color: var(--text-primary);
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .required {
    color: #ef4444;
  }

  .input {
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 1rem;
    transition: var(--transition);
    font-family: inherit;
  }

  .input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .input-error {
    border-color: #ef4444;
  }

  .input-error:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .input-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--secondary-color);
  }

  .input-full-width {
    width: 100%;
  }

  .input-error-message {
    color: #ef4444;
    font-size: 0.875rem;
  }
</style> 
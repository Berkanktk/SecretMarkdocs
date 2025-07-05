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

  .input {
    padding: 0.75rem 1rem;
    border: 2px solid rgba(99, 102, 241, 0.2);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    color: #f1f5f9;
    font-size: 1rem;
    transition: all 0.3s ease;
    font-family: inherit;
    letter-spacing: 0.02em;
    box-shadow: 
      0 4px 15px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .input::placeholder {
    color: #64748b;
    opacity: 0.8;
  }

  .input:focus {
    outline: none;
    border-color: #6366f1;
    background: rgba(0, 0, 0, 0.6);
    box-shadow: 
      0 0 0 3px rgba(99, 102, 241, 0.1),
      0 4px 20px rgba(99, 102, 241, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  .input-error {
    border-color: #ef4444;
    box-shadow: 
      0 4px 15px rgba(239, 68, 68, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .input-error:focus {
    border-color: #ef4444;
    box-shadow: 
      0 0 0 3px rgba(239, 68, 68, 0.1),
      0 4px 20px rgba(239, 68, 68, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .input-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba(0, 0, 0, 0.2);
    border-color: rgba(99, 102, 241, 0.1);
  }

  .input-disabled:focus {
    transform: none;
    box-shadow: 
      0 4px 15px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .input-full-width {
    width: 100%;
  }

  .input-error-message {
    color: #ef4444;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .input-error-message::before {
    content: '⚠️';
    font-size: 0.75rem;
  }

  /* Hover effects for non-disabled inputs */
  .input:not(.input-disabled):hover {
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  /* Enhanced focus ring animation */
  .input:focus {
    animation: focusGlow 0.3s ease-out;
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
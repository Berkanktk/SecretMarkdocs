<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { Button, Input, Card } from '../../../components/ui';
  
  export let form;
  
  let mounted = false;
  let username = '';
  let password = '';
  
  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Login - Secret Notes</title>
  <meta name="description" content="Sign in to access your secret notes">
</svelte:head>

<div class="auth-container">
  <div class="auth-content" class:fade-in={mounted}>
    <Card padding="large">
      <div class="auth-header">
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-subtitle">Sign in to access your vault</p>
      </div>
      
      <form method="POST" action="?/login" use:enhance={() => {
        return async ({ result, update }) => {
          if (result.type === 'redirect') {
            // Handle successful login redirect
            goto(result.location);
          } else {
            // Handle errors or other result types
            await update();
          }
        };
      }} class="auth-form">
        <Input
          label="Username or Email"
          type="text"
          name="username"
          bind:value={username}
          placeholder="Enter username or email"
          required
          autocomplete="username"
        />
        
        <Input
          label="Password"
          type="password"
          name="password"
          bind:value={password}
          placeholder="Enter your password"
          required
          autocomplete="current-password"
        />
        
        {#if form?.error}
          <div class="error-message">
            {form.error}
          </div>
        {/if}
        
        <Button type="submit" fullWidth>
          Sign In
        </Button>
      </form>
      
      <div class="auth-footer">
        <p>Did Berkan invite you? <a href="/auth/register">Sign up</a></p>
      </div>
    </Card>
  </div>
</div>

<style>
  /* Page-specific styles only - common auth styles moved to global CSS */
  @media (max-width: 768px) {
    .auth-content {
      margin: 0 1rem;
    }
    
    .auth-title {
      font-size: 1.75rem;
    }
  }
</style> 
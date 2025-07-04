<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { Button, Input, Card } from '../../../components/ui';
  
  export let form;
  
  let mounted = false;
  let username = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let inviteCode = '';
  
  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Register - Secret Notes</title>
  <meta name="description" content="Create an account to manage your secret notes">
</svelte:head>

<div class="auth-container">
  <div class="auth-content" class:fade-in={mounted}>
    <Card padding="large">
      <div class="auth-header">
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Sign up to start managing your secret notes</p>
      </div>
      
      <form method="POST" action="?/auth/register" use:enhance={() => {
        return async ({ result, update }) => {
          if (result.type === 'redirect') {
            // Handle successful registration redirect
            goto(result.location);
          } else {
            // Handle errors or other result types
            await update();
          }
        };
      }} class="auth-form">
        <Input
          label="Username"
          type="text"
          name="username"
          bind:value={username}
          placeholder="Choose a username"
          required
          autocomplete="username"
        />
        
        <Input
          label="Email"
          type="email"
          name="email"
          bind:value={email}
          placeholder="Enter your email"
          required
          autocomplete="email"
        />
        
        <Input
          label="Password"
          type="password"
          name="password"
          bind:value={password}
          placeholder="Create a password"
          required
          autocomplete="new-password"
        />
        
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          bind:value={confirmPassword}
          placeholder="Confirm your password"
          required
          autocomplete="new-password"
        />
        
        <div class="form-group">
          <Input
            label="Invite Code"
            type="text"
            name="inviteCode"
            bind:value={inviteCode}
            placeholder="Enter your invite code"
            required
            maxlength="8"
          />
          <small class="form-hint">You need an invite code to register</small>
        </div>
        
        {#if form?.error}
          <div class="error-message">
            {form.error}
          </div>
        {/if}
        
        <Button type="submit" fullWidth>
          Create Account
        </Button>
      </form>
      
      <div class="auth-footer">
        <p>Already have an account? <a href="/auth/login">Login</a></p>
      </div>
    </Card>
  </div>
</div>

<style>
  /* Page-specific styles only - common auth styles moved to global CSS */
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  @media (max-width: 768px) {
    .auth-content {
      margin: 0 1rem;
    }
    
    .auth-title {
      font-size: 1.75rem;
    }
  }
</style> 
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
  <div class="background-overlay"></div>
  <div class="particles"></div>
  
  <div class="auth-content" class:fade-in={mounted}>
    <Card padding="large">
      <div class="auth-header">
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Sign up to start managing your secret notes</p>
      </div>
      
      <form method="POST" action="?/register" use:enhance={() => {
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
  .auth-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

  .background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  .particles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.3) 1px, transparent 1px),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 1px, transparent 1px),
      radial-gradient(circle at 40% 40%, rgba(99, 102, 241, 0.2) 1px, transparent 1px);
    background-size: 100px 100px, 150px 150px, 200px 200px;
    animation: particleFloat 20s linear infinite;
    pointer-events: none;
    opacity: 0.5;
  }

  @keyframes particleFloat {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-100px); }
  }

  .auth-content {
    max-width: 420px;
    width: 100%;
    position: relative;
    z-index: 10;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
  }

  .auth-content.fade-in {
    opacity: 1;
    transform: translateY(0);
  }

  :global(.auth-content .card) {
    background: rgba(15, 15, 35, 0.9) !important;
    backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(99, 102, 241, 0.2) !important;
    border-radius: 24px !important;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  }

  .auth-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .auth-title {
    font-size: 2rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.02em;
  }

  .auth-subtitle {
    color: #94a3b8;
    font-size: 1rem;
    margin: 0;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-hint {
    color: #94a3b8;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }

  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .error-message::before {
    content: '⚠️';
    font-size: 0.75rem;
  }

  .auth-footer {
    text-align: center;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(99, 102, 241, 0.1);
  }

  .auth-footer p {
    color: #94a3b8;
    font-size: 0.875rem;
    margin: 0;
  }

  .auth-footer a {
    color: #6366f1;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .auth-footer a:hover {
    color: #8b5cf6;
  }

  @media (max-width: 768px) {
    .auth-content {
      margin: 0 1rem;
      max-width: 100%;
    }
    
    .auth-title {
      font-size: 1.75rem;
    }
  }
</style> 
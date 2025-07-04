<script lang="ts">
  export let data: {
    post: { title: string; description: string; secret_hash: string; content: string; slug: string; isOwner: boolean; isSecret: boolean };
    user: any;
  };

  import { marked } from "marked";
  import hljs from "highlight.js";
  import "highlight.js/styles/github-dark-dimmed.css";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { Button, Input, Card, Badge, ArrowLeft, Shield } from '../../components/ui';

  // Correctly define renderer with proper code function and heading IDs
  marked.use({
    renderer: {
      code({ text, lang }) {
        if (lang && hljs.getLanguage(lang)) {
          return `<pre><code class="hljs language-${lang}">${hljs.highlight(text, { language: lang }).value}</code></pre>`;
        }
        return `<pre><code class="hljs">${hljs.highlightAuto(text).value}</code></pre>`;
      },
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        return `<h${depth} id="${id}">${text}</h${depth}>`;
      },
    },
  });

  let entered = "";
  let show = false;
  let error = "";
  let loading = false;
  let mounted = false;

  onMount(() => {
    mounted = true;
    
    // If the user owns the note OR the note has content (public note), show it immediately
    if (data.post.isOwner || (data.post.content && data.post.content.trim())) {
      show = true;
    }
    
    // Add smooth scrolling to fragment links
    setupFragmentScrolling();
  });

  function setupFragmentScrolling() {
    // Add smooth scrolling behavior to all internal links
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const fragment = target.getAttribute('href')?.slice(1);
        if (fragment) {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }
        }
      }
    });
  }

  async function check() {
    if (!entered.trim()) {
      error = "Please enter your secret";
      return;
    }

    loading = true;
    error = "";
    
    try {
      const res = await fetch(`/${data.post.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: entered }),
      });
      const result = await res.json();
      
      if (result.success) {
        // Update the content with the decrypted content
        data.post.content = result.content || data.post.content;
        show = true;
        error = "";
      } else {
        error = "Wrong secret. Try again!";
      }
    } catch (err) {
      error = "Something went wrong. Please try again.";
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      check();
    }
  }

  function goBack() {
    goto('/');
  }
</script>

<svelte:head>
  <title>{data.post.title} - Secret Notes</title>
  <meta name="description" content="Enter your secret to unlock this note">
</svelte:head>

{#if !show && data.post.secret_hash && !data.post.isOwner}
  <div class="secret-page">
    <div class="container">
      <div class="secret-content" class:fade-in={mounted}>
        <!-- Back Button (only show for authenticated users) -->
        {#if data.user}
          <Button variant="secondary" on:click={goBack}>
            <ArrowLeft />
            Back to Notes
          </Button>
        {/if}

        <!-- Secret Entry Card -->
        <div class="secret-card">
          <div class="card-header">
            <div class="secret-icon">
              <Shield animated={true} />
            </div>
            <h1 class="note-title">{data.post.title}</h1>
            <p class="note-description">
              This note is protected by a secret. Enter it below to unlock the note.
            </p>
          </div>

          <div class="card-content">
            <div class="secret-form">
              <Input
                label="Secret"
                type="password"
                bind:value={entered}
                on:keypress={handleKeyPress}
                placeholder="Enter secret"
                error={error}
                disabled={loading}
                autocomplete="off"
              />

              <Button
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading || !entered.trim()}
                on:click={check}
              >
                {#if loading}
                  Unlocking...
                {:else}
                  Unlock Note
                {/if}
              </Button>
            </div>
          </div>

          <div class="card-footer">
            <p class="privacy-note">
              💡 The secret stays private and is never stored anywhere
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="article-page">
    <div class="container">
      <div class="article-header">
        {#if data.user}
          <Button variant="secondary" on:click={goBack}>
            <ArrowLeft />
            Back to Notes
          </Button>
        {/if}
        <div style="margin-left: auto;">
          <Badge variant={data.post.isOwner ? 'info' : data.post.isSecret ? 'warning' : 'success'}>
            {#if data.post.isOwner}
              👤 Your Note
            {:else if data.post.isSecret}
              🔓 Unlocked
            {:else}
              🌐 Public
            {/if}
          </Badge>
        </div>
      </div>

      <article class="prose fade-in">
        <h1>{data.post.title}</h1>
        {#if data.post.description}
          <p class="article-description">{data.post.description}</p>
        {/if}
        {@html marked.parse(data.post.content)}
      </article>
    </div>
  </div>
{/if}

<style>
  /* Secret page styles moved to global CSS */

  .secret-content {
    max-width: 450px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  /* Back button styles now handled by Button component */

  .secret-card {
    background: rgba(30, 41, 59, 0.95);
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 1rem;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.8),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    overflow: hidden;
    margin-top: 20px;
    backdrop-filter: blur(10px);
    animation: cardFloat 6s ease-in-out infinite;
    position: relative;
  }

  .secret-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.6), transparent);
    animation: shimmer 3s ease-in-out infinite;
  }

  .secret-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  @keyframes cardFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .card-header {
    padding: 2rem 2rem 1rem 2rem;
    text-align: center;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    position: relative;
  }

  .secret-icon {
    margin-bottom: 1.5rem;
    color: #e2e8f0;
  }
  
  /* Shield animations now handled by Shield component */

  .note-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .note-description {
    color: rgba(226, 232, 240, 0.8);
    line-height: 1.6;
    margin: 0;
    font-size: 0.95rem;
  }

  .card-content {
    padding: 2rem;
  }

  .input-group {
    margin-bottom: 1.5rem;
  }

  .input-label {
    display: block;
    font-weight: 600;
    color: #e2e8f0;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .secret-input {
    width: 100%;
    padding: 1rem;
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 0.75rem;
    background: rgba(15, 23, 42, 0.8);
    color: #f8fafc;
    font-size: 1rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: inherit;
    backdrop-filter: blur(10px);
    position: relative;
  }

  .secret-input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 
      0 0 0 3px rgba(99, 102, 241, 0.1),
      0 0 15px rgba(99, 102, 241, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    background: rgba(15, 23, 42, 0.9);
    transform: translateY(-1px);
  }

  .secret-input.error {
    border-color: #ef4444;
    box-shadow: 
      0 0 0 3px rgba(239, 68, 68, 0.1),
      0 0 20px rgba(239, 68, 68, 0.3);
    animation: shake 0.5s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  .error-message {
    color: #fca5a5;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    animation: fadeInUp 0.3s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .unlock-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: inherit;
    position: relative;
    overflow: hidden;
    box-shadow: 
      0 4px 15px rgba(79, 70, 229, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .unlock-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .unlock-btn:hover::before {
    left: 100%;
  }

  .unlock-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #4338ca, #5b21b6);
    transform: translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(79, 70, 229, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  .unlock-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .unlock-btn.loading {
    cursor: not-allowed;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .card-footer {
    padding: 1rem 2rem 2rem 2rem;
    text-align: center;
  }

  .privacy-note {
    font-size: 0.875rem;
    color: rgba(226, 232, 240, 0.7);
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .article-page {
    min-height: 100vh;
    background: var(--bg-primary);
    padding: 2rem 0;
  }

  .article-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .unlocked-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    color: var(--accent-color);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .unlock-icon {
    font-size: 1rem;
  }

  .prose {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 2.5rem;
    box-shadow: var(--shadow);
  }

  .prose h1 {
    margin-top: 0;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.75rem;
  }

  .article-description {
    color: var(--text-secondary);
    font-size: 1.125rem;
    font-style: italic;
    margin: 1rem 0 2rem 0;
    line-height: 1.6;
    border-left: 4px solid var(--primary-color);
    padding-left: 1rem;
  }

  /* Enhanced code styling */
  :global(pre) {
    background: var(--bg-primary) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: var(--border-radius) !important;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  :global(pre code.hljs) {
    padding: 1.25rem;
    display: block;
    background: transparent !important;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  :global(p code) {
    background: var(--secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    padding: 0.125rem 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    .secret-content {
      max-width: 100%;
      padding: 0 1rem;
    }

    .card-content {
      padding: 1.5rem;
    }

    .card-header {
      padding: 1.5rem 1.5rem 1rem 1.5rem;
    }

    .card-footer {
      padding: 1rem 1.5rem 1.5rem 1.5rem;
    }

    .note-title {
      font-size: 1.375rem;
    }

    .prose {
      padding: 2rem;
    }

    .article-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
  }
</style>

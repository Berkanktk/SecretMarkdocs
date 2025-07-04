<script lang="ts">
  export let data: {
    post: { title: string; description: string; secret_hash: string; content: string; slug: string; isOwner: boolean; isSecret: boolean; creator: { username: string } | null };
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
    <div class="background-overlay"></div>
    <div class="particles"></div>
    
    <div class="container">
      <div class="secret-content" class:fade-in={mounted}>
        <!-- Back Button -->
        {#if data.user}
          <div class="back-button">
            <Button variant="secondary" on:click={goBack}>
              <ArrowLeft />
              Back to Notes
            </Button>
          </div>
        {/if}

        <!-- Main Secret Entry -->
        <div class="vault-container">
          <div class="vault-header">
            <div class="lock-icon">
              <div class="lock-outer">
                <div class="lock-inner">
                  <Shield animated={true} />
                </div>
              </div>
            </div>
            <h1 class="vault-title">{data.post.title}</h1>
            <p class="vault-subtitle">Protected Document</p>
          </div>

          <div class="access-panel">
            <div class="panel-header">
              <div class="status-light"></div>
              <span class="access-text">RESTRICTED ACCESS</span>
            </div>
            
            <div class="input-section">
              <label class="input-label">Enter Secret</label>
              <div class="input-container">
                <input
                  type="password"
                  bind:value={entered}
                  on:keypress={handleKeyPress}
                  placeholder="********"
                  class="security-input"
                  class:error={error}
                  disabled={loading}
                  autocomplete="off"
                />
                <div class="input-border"></div>
              </div>
              {#if error}
                <div class="error-message">{error}</div>
              {/if}
            </div>

            <button
              class="unlock-button"
              class:loading={loading}
              disabled={loading || !entered.trim()}
              on:click={check}
            >
              <span class="button-text">
                {#if loading}
                  <div class="spinner"></div>
                  Unlocking...
                {:else}
                  <div class="unlock-icon">🔓</div>
                  Unlock Document
                {/if}
              </span>
              <div class="button-glow"></div>
            </button>
          </div>

          <div class="security-notice">
            <span>The secret stays private and is never stored anywhere</span>
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
        <div style="display: flex; flex: auto;align-items: center; gap: 1rem; justify-content: flex-end;">
          {#if !data.post.isOwner}
          <Badge variant={data.post.isOwner ? 'info' : data.post.isSecret ? 'warning' : 'success'}>
            {#if data.post.isSecret && !data.post.isOwner}
              🔓 Unlocked
            {:else if !data.post.isSecret && !data.post.isOwner}
              🌐 Public
            {/if}
          </Badge>
          {/if}
        </div>
      </div>

       <!-- Add post creator name -->
      

      <article class="prose fade-in">
        <h1>{data.post.title}</h1>
        {#if data.post.description}
          <p class="article-description">{data.post.description}</p>
        {/if}
        {@html marked.parse(data.post.content)}
      </article>

      {#if data.post.creator && data.post.isOwner}
        <div style="display: flex; flex: auto;align-items: center; gap: 1rem; justify-content: center; margin-top: 2rem;">
          <Badge variant="secondary">
            👤 by {data.post.creator.username} (You)
          </Badge>
        </div>
      {:else if data.post.creator}
        <div style="display: flex; flex: auto;align-items: center; gap: 1rem; justify-content: center; margin-top: 2rem;">
          <Badge variant="secondary">
            👤 by {data.post.creator.username}
          </Badge>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Modern secret page with elegant design */
  .secret-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
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

  .secret-content {
    max-width: 420px;
    width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 10;
    padding: 2rem 1rem;
  }

  .back-button {
    margin-bottom: 2rem;
    opacity: 0.8;
  }

  .vault-container {
    background: rgba(15, 15, 35, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 24px;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    overflow: hidden;
    position: relative;
  }

  .vault-header {
    text-align: center;
    padding: 3rem 2rem 2rem;
    border-bottom: 1px solid rgba(99, 102, 241, 0.1);
  }

  .lock-icon {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
  }

  .lock-outer {
    width: 80px;
    height: 80px;
    border: 2px solid rgba(99, 102, 241, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    animation: lockPulse 3s ease-in-out infinite;
  }

  .lock-inner {
    width: 50px;
    height: 50px;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6366f1;
  }

  @keyframes lockPulse {
    0%, 100% { 
      box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
      transform: scale(1);
    }
    50% { 
      box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
      transform: scale(1.05);
    }
  }

  .vault-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.02em;
  }

  .vault-subtitle {
    color: #94a3b8;
    font-size: 0.9rem;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 500;
  }

  .access-panel {
    padding: 2rem;
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba(99, 102, 241, 0.05);
    border: 1px solid rgba(99, 102, 241, 0.1);
    border-radius: 12px;
  }

  .status-light {
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
    animation: statusBlink 2s ease-in-out infinite;
  }

  @keyframes statusBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .access-text {
    font-size: 0.75rem;
    color: #ef4444;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .input-section {
    margin-bottom: 2rem;
  }

  .input-label {
    display: block;
    color: #e2e8f0;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    letter-spacing: 0.02em;
  }

  .input-container {
    position: relative;
  }

  .security-input {
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    border: 2px solid rgba(99, 102, 241, 0.2);
    border-radius: 12px;
    color: #f1f5f9;
    font-size: 1rem;
    padding: 1rem 1.25rem;
    transition: all 0.3s ease;
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
    letter-spacing: 0.02em;
  }

  .security-input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    background: rgba(0, 0, 0, 0.6);
  }

  .security-input.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .security-input::placeholder {
    color: #64748b;
  }

  .input-border {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid transparent;
    border-radius: 12px;
    pointer-events: none;
    background: linear-gradient(45deg, #6366f1, #8b5cf6) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .security-input:focus + .input-border {
    opacity: 1;
  }

  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .error-message::before {
    content: '⚠️';
    font-size: 0.75rem;
  }

  .unlock-button {
    width: 100%;
    background: #6366f1;
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    padding: 1rem 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    letter-spacing: 0.02em;
  }

  .unlock-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
  }

  .unlock-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .button-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    position: relative;
    z-index: 2;
  }

  .unlock-icon {
    font-size: 1.1rem;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .button-glow {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
  }

  .unlock-button:hover .button-glow {
    left: 100%;
  }

  .security-notice {
    text-align: center;
    padding: 1.5rem 2rem 2rem;
    color: #64748b;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-top: 1px solid rgba(99, 102, 241, 0.1);
  }

  /* Responsive design */
  @media (max-width: 600px) {
    .secret-content {
      max-width: 95vw;
      padding: 1rem 0.5rem;
    }
    
    .vault-header {
      padding: 2rem 1.5rem 1.5rem;
    }
    
    .access-panel {
      padding: 1.5rem;
    }
    
    .vault-title {
      font-size: 1.5rem;
    }
  }

  .article-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    padding: 2rem 0;
    position: relative;
    overflow: hidden;
  }

  .article-page::before {
    content: '';
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

  .article-page::after {
    content: '';
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

  .article-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    position: relative;
    z-index: 10;
  }

  .prose {
    background: rgba(15, 15, 35, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 24px;
    padding: 2.5rem;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    position: relative;
    z-index: 10;
  }

  .prose h1 {
    margin-top: 0;
    color: #f1f5f9;
    border-bottom: 1px solid rgba(99, 102, 241, 0.2);
    padding-bottom: 0.75rem;
  }

  .article-description {
    color: #94a3b8;
    font-size: 1.125rem;
    font-style: italic;
    margin: 1rem 0 2rem 0;
    line-height: 1.6;
    border-left: 4px solid #6366f1;
    padding-left: 1rem;
  }

  /* Enhanced code styling */
  :global(pre) {
    background: rgba(0, 0, 0, 0.4) !important;
    border: 1px solid rgba(99, 102, 241, 0.3) !important;
    border-radius: 12px !important;
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
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 0.25rem;
    padding: 0.125rem 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6366f1;
  }

  @media (max-width: 768px) {
    .secret-content {
      max-width: 100%;
      padding: 0 1rem;
    }

    .prose {
      padding: 2rem;
    }

    .article-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .article-header > div:last-child {
      width: 100%;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
  }
</style>

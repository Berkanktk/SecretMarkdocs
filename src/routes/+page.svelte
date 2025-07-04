<script lang="ts">
  export let data: { posts: { title: string; slug: string }[] };
  
  import { onMount } from 'svelte';
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Secret Notes - Your Private Markdown</title>
  <meta name="description" content="Simple, secret-protected markdown notes for your personal use">
</svelte:head>

<div class="hero-section">
  <div class="container">
    <div class="hero-content" class:fade-in={mounted}>
      <div class="hero-badge">
        <span class="badge-icon">📝</span>
        <span>Personal • Private • Simple</span>
      </div>
      <h1 class="hero-title">
        Your <span class="gradient-text">Secret</span> Notes
      </h1>
      <p class="hero-subtitle">
        Keep your personal markdown notes behind a simple secret. 
        Perfect for storing sensitive information, passwords, or just private thoughts.
      </p>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">{data.posts.length}</span>
          <span class="stat-label">Secret Notes</span>
        </div>
        <div class="stat">
          <span class="stat-number">📝</span>
          <span class="stat-label">Markdown</span>
        </div>
        <div class="stat">
          <span class="stat-number">🔒</span>
          <span class="stat-label">Secret Protected</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="notes-section">
  <div class="container">
    <div class="section-header">
      <h2>Your Secret Notes</h2>
      <p>Click on any note to unlock it with your secret</p>
    </div>
    
    <div class="notes-grid">
      {#each data.posts as post, i}
        <div 
          class="note-card slide-in"
          style="animation-delay: {i * 0.1}s"
        >
          <div class="card-header">
            <div class="card-icon">📄</div>
            <div class="card-status">
              <span class="status-dot"></span>
              <span>Protected</span>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">{post.title}</h3>
            <p class="card-description">
              This note is protected by your secret. Only you can access it.
            </p>
          </div>
          <div class="card-footer">
            <a href="/{post.slug}" class="btn btn-primary">
              <span>Open Note</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      {/each}
    </div>
    
    {#if data.posts.length === 0}
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No Secret Notes Yet</h3>
        <p>Add some markdown files to your content folder to get started.</p>
      </div>
    {/if}
  </div>
</div>

<div class="info-section">
  <div class="container">
    <div class="info-content">
      <h2>How it works</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>Add your markdown files</h3>
            <p>Put your `.md` files in the content folder</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>Set a secret</h3>
            <p>Each note can have its own secret password</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>Access privately</h3>
            <p>Only you know the secret to unlock your notes</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .hero-section {
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
    padding: 3rem 0 4rem;
    position: relative;
    overflow: hidden;
  }
  
  .hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%);
    pointer-events: none;
  }
  
  .hero-content {
    text-align: center;
    position: relative;
    z-index: 1;
  }
  
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }
  
  .badge-icon {
    font-size: 1rem;
  }
  
  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin: 0 0 1.5rem 0;
    line-height: 1.1;
    color: var(--text-primary);
  }
  
  .gradient-text {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto 2.5rem;
    line-height: 1.6;
  }
  
  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
  }
  
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-color);
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .notes-section {
    padding: 3rem 0;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
  }
  
  .section-header p {
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0;
  }
  
  .notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .note-card {
    background: #111827;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    transition: var(--transition);
    position: relative;
    padding: 20px !important;
    border-radius: 15px !important;
  }
  
  .note-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .card-icon {
    font-size: 1.5rem;
    opacity: 0.8;
  }
  
  .card-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent-color);
  }
  
  .card-content {
    margin-bottom: 1.5rem;
  }
  
  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
  }
  
  .card-description {
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
    font-size: 0.875rem;
  }
  
  .card-footer {
    display: flex;
    justify-content: flex-end;
  }
  
  .btn svg {
    margin-left: 0.5rem;
    transition: var(--transition);
  }
  
  .btn:hover svg {
    transform: translateX(2px);
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem 2rem;
    color: var(--text-secondary);
  }
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .empty-state h3 {
    font-size: 1.25rem;
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
  }
  
  .info-section {
    background: var(--bg-secondary);
    padding: 3rem 0;
  }
  
  .info-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  
  .info-content h2 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0 0 2rem 0;
    color: var(--text-primary);
  }
  
  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .step-number {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .step-content h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
  }
  
  .step-content p {
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
  }
  
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.25rem;
    }
    
    .hero-subtitle {
      font-size: 1rem;
    }
    
    .hero-stats {
      gap: 1.5rem;
    }
    
    .section-header h2 {
      font-size: 1.75rem;
    }
    
    .notes-grid {
      grid-template-columns: 1fr;
    }
    
    .steps {
      grid-template-columns: 1fr;
    }
  }
</style>

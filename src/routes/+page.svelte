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
  <div class="background-overlay"></div>
  <div class="particles"></div>
  
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
  <div class="background-overlay"></div>
  <div class="particles"></div>
  
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
  <div class="background-overlay"></div>
  <div class="particles"></div>
  
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
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    padding: 3rem 0 4rem;
    position: relative;
    overflow: hidden;
  }

  .notes-section {
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    padding: 4rem 0;
    position: relative;
    overflow: hidden;
  }

  .info-section {
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    padding: 4rem 0;
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
  
  .hero-content {
    text-align: center;
    position: relative;
    z-index: 10;
  }
  
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(15, 15, 35, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(99, 102, 241, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #94a3b8;
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
    color: #f1f5f9;
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
    color: #94a3b8;
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
    color: #6366f1;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: #94a3b8;
  }
  
  .notes-section {
    padding: 3rem 0;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 2.5rem;
    position: relative;
    z-index: 10;
  }
  
  .section-header h2 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: #f1f5f9;
  }
  
  .section-header p {
    font-size: 1rem;
    color: #94a3b8;
    margin: 0;
  }
  
  .notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .note-card {
    background: rgba(15, 15, 35, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 20px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    position: relative;
    z-index: 10;
    box-shadow: 
      0 10px 25px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  .note-card:hover {
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(99, 102, 241, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    border-color: rgba(99, 102, 241, 0.4);
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
    color: #94a3b8;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #8b5cf6;
  }
  
  .card-content {
    margin-bottom: 1.5rem;
  }
  
  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: #f1f5f9;
  }
  
  .card-description {
    color: #94a3b8;
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
    transition: transform 0.3s ease;
  }
  
  .btn:hover svg {
    transform: translateX(2px);
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem 2rem;
    color: #94a3b8;
    position: relative;
    z-index: 10;
  }
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .empty-state h3 {
    font-size: 1.25rem;
    margin: 0 0 0.5rem 0;
    color: #f1f5f9;
  }
  
  .info-section {
    background: var(--bg-secondary);
    padding: 3rem 0;
  }
  
  .info-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 10;
  }
  
  .info-content h2 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0 0 2rem 0;
    color: #f1f5f9;
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
    background: #6366f1;
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
    color: #f1f5f9;
  }
  
  .step-content p {
    color: #94a3b8;
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

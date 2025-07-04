<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button, Card, Badge, Plus, Copy, Delete } from '../../components/ui';
  
  export let data: { user: any; notes: any[] };
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
  
  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    goto('/auth/login');
  }

  let invites: any[] = [];
  let showInviteSection = false;
  let generatingInvite = false;

  async function loadInvites() {
    try {
      const response = await fetch('/api/invites');
      if (response.ok) {
        const data = await response.json();
        invites = data.invites;
      }
    } catch (error) {
      
    }
  }

  async function generateInvite() {
    if (generatingInvite) return;
    
    generatingInvite = true;
    try {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresInDays: 30 })
      });
      
      if (response.ok) {
        await loadInvites();
      }
    } catch (error) {
      
    } finally {
      generatingInvite = false;
    }
  }

  async function toggleInviteSection() {
    showInviteSection = !showInviteSection;
    if (showInviteSection && invites.length === 0) {
      await loadInvites();
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  async function deleteInvite(inviteId: string) {
    try {
      const response = await fetch('/api/invites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId })
      });
      
      if (response.ok) {
        await loadInvites();
      } else {

      }
    } catch (error) {
      
    }
  }
</script>

<svelte:head>
  <title>Dashboard - Secret Notes</title>
  <meta name="description" content="Manage your secret notes">
</svelte:head>

<div class="dashboard">
  <div class="container">
    <div class="dashboard-header" class:fade-in={mounted}>
      <div class="header-content">
        <h1>Welcome back, {data.user.username}!</h1>
        <p>Manage your secret notes from here</p>
      </div>
      <div class="header-actions">
        <!-- @ts-ignore -->
        <Button href="/editor">
          <Plus />
          New Note
        </Button>
        <Button variant="secondary" on:click={logout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </Button>
      </div>
    </div>
    
    <div class="dashboard-content">
      <div class="notes-section">
        <div class="section-header">
          <h2>Your Notes</h2>
          <p>You have {data.notes.length} notes</p>
        </div>
        
        {#if data.notes.length > 0}
          <div class="notes-grid">
            {#each data.notes as note, i}
              <Card 
                hover={true}
                class="note-card slide-in"
                style="animation-delay: {i * 0.1}s"
              >
                <div class="card-header">
                  <div class="note-type">
                    <Badge variant={note.isSecret ? 'danger' : 'success'}>
                      {note.isSecret ? '🔒 Secret' : '🌍 Public'}
                    </Badge>
                  </div>
                  <div class="note-date">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div class="card-content">
                  <h3 class="note-title">{note.title}</h3>
                  {#if note.description}
                    <p class="note-description">{note.description}</p>
                  {/if}
                  <p class="note-preview">
                    {note.content.substring(0, 75)}...
                  </p>
                </div>
                
                <div class="card-actions">
                  <!-- @ts-ignore -->
                  <Button variant="secondary" href="/{note.slug}">
                    View
                  </Button>
                  <!-- @ts-ignore -->
                  <Button href="/editor?edit={note.slug}">
                    Edit
                  </Button>
                </div>
              </Card>
            {/each}
          </div>
        {:else}
          <div class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>No notes yet</h3>
            <p>Create your first note to get started!</p>
            <!-- @ts-ignore -->
            <Button href="/editor">
              <Plus />
              Create Note
            </Button>
          </div>
        {/if}
      </div>
      
      {#if data.user.isAdmin}
        <div class="invites-section">
          <div class="section-header">
            <h2>Invite Management</h2>
            <Button variant="secondary" on:click={toggleInviteSection}>
              {showInviteSection ? 'Hide' : 'Show'} Invites
            </Button>
          </div>
          
          {#if showInviteSection}
            <div class="invite-controls">
              <Button on:click={generateInvite} disabled={generatingInvite}>
                {generatingInvite ? 'Generating...' : 'Generate New Invite (24h)'}
              </Button>
            </div>
            
            {#if invites.length > 0}
              <div class="invites-list">
                {#each invites as invite}
                  <div class="invite-card">
                    <div class="invite-code">
                      <code>{invite.code}</code>
                      <Button 
                        size="small"
                        variant="secondary"
                        on:click={() => copyToClipboard(invite.code)} 
                        title="Copy to clipboard"
                      >
                        <Copy />
                      </Button>
                    </div>
                    <div class="invite-details">
                      <span class="invite-status {invite.isUsed ? 'used' : 'unused'}">
                        {invite.isUsed ? '✅ Used' : '🔓 Available'}
                      </span>
                      <span class="invite-date">
                        Created: {new Date(invite.createdAt).toLocaleDateString()}
                      </span>
                      {#if invite.usedAt}
                        <span class="invite-used-date">
                          Used: {new Date(invite.usedAt).toLocaleDateString()}
                        </span>
                      {/if}
                      {#if invite.expiresAt}
                        <span class="invite-expires">
                          Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                        </span>
                      {/if}
                    </div>
                    <div class="invite-actions">
                      <Button 
                        variant="danger"
                        size="small"
                        on:click={() => deleteInvite(invite._id)} 
                        title="Delete invite"
                      >
                        <Delete />
                        Delete
                      </Button>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="empty-invites">
                <p>No invites generated yet. Create your first invite to share with others!</p>
              </div>
            {/if}
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .dashboard {
    min-height: 100vh;
    background: var(--bg-primary);
    padding: 2rem 0;
  }
  
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
  }
  
  .header-content h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
  }
  
  .header-content p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 1rem;
  }
  
  .header-actions {
    display: flex;
    gap: 1rem;
  }
  

  
  .section-header {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
  }
  
  .section-header p {
    color: var(--text-secondary);
    margin: 0;
  }
  
  .notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.5rem;
  }

  /* Ensure cards have proper background and flex layout */
  :global(.note-card) {
    background: var(--bg-secondary) !important;
    padding: 20px !important;
    border-radius: 15px !important;
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
  }

  :global(.note-card:hover) {
    box-shadow: var(--shadow-lg);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .note-date {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
  
  .card-content {
    margin-bottom: 1.5rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .note-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .note-description {
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-style: italic;
    margin: 0 0 0.75rem 0;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .note-preview {
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
    font-size: 0.875rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
  }
  
  .card-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: auto;
    align-self: flex-start;
  }
  
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-secondary);
  }
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .empty-state h3 {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    color: var(--text-primary);
  }
  
  .empty-state p {
    margin: 0 0 2rem 0;
    font-size: 1rem;
  }

  .invites-section {
    margin-top: 3rem;
  }

  .invite-controls {
    margin-bottom: 2rem;
  }

  .invites-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .invite-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    box-shadow: var(--shadow);
  }

  .invite-code {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .invite-code code {
    background: var(--bg-primary);
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--primary-color);
    border: 1px solid var(--border-color);
  }



  .invite-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.875rem;
  }

  .invite-status {
    font-weight: 500;
  }

  .invite-status.used {
    color: #10b981;
  }

  .invite-status.unused {
    color: var(--primary-color);
  }

  .invite-date,
  .invite-used-date,
  .invite-expires {
    color: var(--text-secondary);
  }

  .empty-invites {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
  }
  
  .invite-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  @media (max-width: 768px) {
    .dashboard-header {
      flex-direction: column;
      gap: 1.5rem;
      align-items: stretch;
    }
    
    .header-actions {
      justify-content: center;
    }
    
    .notes-grid {
      grid-template-columns: 1fr;
    }

    .invite-card {
      flex-direction: column;
      align-items: flex-start;
    }

    .invite-details {
      width: 100%;
    }
  }
</style> 
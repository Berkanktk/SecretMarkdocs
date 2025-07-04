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
  let deletingInvite = false;
  let copiedStates: Record<string, boolean> = {}; // Track copied state for each invite

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

  function copyToClipboard(text: string, inviteId: string) {
    navigator.clipboard.writeText(text);
    
    // Show copied state
    copiedStates[inviteId] = true;
    copiedStates = { ...copiedStates }; // Trigger reactivity
    
    // Hide after 2 seconds
    setTimeout(() => {
      copiedStates[inviteId] = false;
      copiedStates = { ...copiedStates };
    }, 2000);
  }

  async function deleteInvite(inviteId: string) {
    if (deletingInvite) return;
    
    deletingInvite = true;
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
      
    } finally {
      deletingInvite = false;
    }
  }
</script>

<svelte:head>
  <title>Dashboard - Secret Notes</title>
  <meta name="description" content="Manage your secret notes">
</svelte:head>

<div class="dashboard">
  <div class="background-overlay"></div>
  <div class="particles"></div>
  
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
            <div>You have {data.notes.length} {data.notes.length === 1 ? 'note' : 'notes'}</div>
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
            <h2>Manage Invites</h2>
            <Button variant="secondary" on:click={toggleInviteSection}>
              {showInviteSection ? 'Hide' : 'Show'} Invites
            </Button>
          </div>
          
          {#if showInviteSection}
            <div class="invite-controls">
              <Button on:click={generateInvite} loading={generatingInvite} disabled={generatingInvite}>
                {generatingInvite ? 'Generating...' : 'Generate New Invite (24h)'}
              </Button>
            </div>
            
            {#if invites.length > 0}
              <div class="invites-list">
                {#each invites as invite}
                  <div class="invite-card">
                    <div class="invite-code">
                      <code>{invite.code}</code>
                      <div class="copy-button-container">
                        <Button 
                          size="small"
                          variant="secondary"
                          on:click={() => copyToClipboard(invite.code, invite._id)} 
                          title="Copy to clipboard"
                        >
                          <Copy />
                        </Button>
                        {#if copiedStates[invite._id]}
                          <div class="copied-notification">
                            Copied!
                          </div>
                        {/if}
                      </div>
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
                        loading={deletingInvite}
                        disabled={deletingInvite}
                        on:click={() => deleteInvite(invite._id)} 
                        title="Delete invite"
                      >
                        <Delete />
                        {deletingInvite ? 'Deleting...' : 'Delete'}
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
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    padding: 2rem 0;
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
  
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: rgba(15, 15, 35, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 24px;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    position: relative;
    z-index: 10;
  }
  
  .header-content h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: #f1f5f9;
  }
  
  .header-content p {
    color: #94a3b8;
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
    color: #f1f5f9;
  }
  
  .notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.5rem;
  }

  /* Ensure cards have proper background and flex layout */
  :global(.note-card) {
    background: rgba(15, 15, 35, 0.9) !important;
    backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(99, 102, 241, 0.2) !important;
    padding: 20px !important;
    border-radius: 20px !important;
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
    box-shadow: 
      0 10px 25px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  }

  :global(.note-card:hover) {
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(99, 102, 241, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
    transform: translateY(-2px);
    border-color: rgba(99, 102, 241, 0.4) !important;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .note-date {
    color: #94a3b8;
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
    color: #f1f5f9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .note-description {
    color: #94a3b8;
    font-size: 0.875rem;
    font-style: italic;
    margin: 0 0 0.75rem 0;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .note-preview {
    color: #94a3b8;
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
    color: #94a3b8;
  }
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .empty-state h3 {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    color: #f1f5f9;
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
    background: rgba(15, 15, 35, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 20px;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    box-shadow: 
      0 10px 25px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .invite-code {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .copy-button-container {
    position: relative;
    display: inline-block;
  }

  .copied-notification {
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(99, 102, 241, 0.9);
    color: white;
    padding: 0.375rem 0.75rem;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    z-index: 1000;
    animation: fadeInOut 2s ease-in-out;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .copied-notification::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: rgba(99, 102, 241, 0.9);
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translateX(-50%) translateY(-5px);
    }
    15% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    85% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateX(-50%) translateY(-5px);
    }
  }

  .invite-code code {
    background: rgba(0, 0, 0, 0.4);
    padding: 0.5rem 1rem;
    border-radius: 12px;
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    font-weight: bold;
    color: #6366f1;
    border: 1px solid rgba(99, 102, 241, 0.3);
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
    color: #6366f1;
  }

  .invite-date,
  .invite-used-date,
  .invite-expires {
    color: #94a3b8;
  }

  .empty-invites {
    text-align: center;
    padding: 2rem;
    color: #94a3b8;
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
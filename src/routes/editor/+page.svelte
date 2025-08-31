<script lang="ts">
// @ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { marked } from "marked";
  import hljs from "highlight.js";
  import "highlight.js/styles/github-dark-dimmed.css";
  import { Button, Input, Badge, Save, Delete, Eye, Bold, Italic, Code, List, NumberedList, Link, Image, File, Plus } from "../../components/ui";

  export let data: { user: any; note?: any };

  let title = "";
  let description = "";
  let content = "";
  let isSecret = false;
  let secret = "";
  let showSecretPrompt = false;
  let isEditing = false;
  let saving = false;
  let deleting = false;
  let mounted = false;
  let originalIsSecret = false; // Track original state for editing

  let editorContainer: HTMLElement;
  let previewContainer: HTMLElement;
  let editorTextarea: HTMLTextAreaElement;

  // Configure marked for syntax highlighting and heading IDs
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
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        return `<h${depth} id="${id}">${text}</h${depth}>`;
      },
    },
  });

  onMount(() => {
    mounted = true;

    // Add editor-body class to prevent page scrolling
    document.body.classList.add('editor-body');

    // Check if we're editing an existing note
    const editSlug = $page.url.searchParams.get("edit");
    if (editSlug && data.note) {
      isEditing = true;
      title = data.note.title;
      description = data.note.description || "";
      content = data.note.content;
      isSecret = data.note.isSecret;
      originalIsSecret = data.note.isSecret; // Store original state
      showSecretPrompt = isSecret;
    }

    // Initialize editor after mount
    setTimeout(() => {
      initializeEditor();
      setupFragmentScrolling();
    }, 100);

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('editor-body');
    };
  });

  function initializeEditor() {
    if (editorTextarea) {
      editorTextarea.addEventListener("input", updatePreview);
      editorTextarea.addEventListener("scroll", syncScroll);
    }
  }

  function setupFragmentScrolling() {
    // Add smooth scrolling behavior to all internal links in the preview
    if (previewContainer) {
      previewContainer.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (
          target.tagName === "A" &&
          target.getAttribute("href")?.startsWith("#")
        ) {
          e.preventDefault();
          const fragment = target.getAttribute("href")?.slice(1);
          if (fragment) {
            const element = previewContainer.querySelector(`#${fragment}`);
            if (element) {
              element.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
              });
            }
          }
        }
      });
    }
  }

  async function updatePreview() {
    if (previewContainer && content) {
      const html = await marked.parse(content);
      previewContainer.innerHTML = html;
    } else if (previewContainer) {
      previewContainer.innerHTML = `
        <div class="preview-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <p>Start typing to see your markdown come to life...</p>
        </div>
      `;
    }
  }

  function syncScroll() {
    if (editorTextarea && previewContainer) {
      const scrollPercent =
        editorTextarea.scrollTop /
        (editorTextarea.scrollHeight - editorTextarea.clientHeight);
      previewContainer.scrollTop =
        scrollPercent *
        (previewContainer.scrollHeight - previewContainer.clientHeight);
    }
  }

  function handleVisibilityChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newIsSecret = target.value === "secret";



    if (newIsSecret !== isSecret) {
      isSecret = newIsSecret;
      showSecretPrompt = isSecret;

      // Clear secret if switching to public
      if (!isSecret) {
        secret = "";
      }


    }
  }

  async function saveNote() {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a description");
      return;
    }

    if (!content.trim()) {
      alert("Please enter some content");
      return;
    }

    if (isSecret && !secret.trim() && (!isEditing || !originalIsSecret)) {
      alert("Please enter a secret for this note");
      return;
    }

    saving = true;

    try {
      // Create a proper form element and submit it
      const form = document.createElement("form");
      form.method = "POST";

      // For updates, preserve the edit slug in the URL
      if (isEditing) {
        const editSlug = $page.url.searchParams.get("edit");
        form.action = `?/update&edit=${encodeURIComponent(editSlug || "")}`;
      } else {
        form.action = "?/create";
      }

      form.style.display = "none";

      // Add all form fields
      const fields = [
        { name: "title", value: title },
        { name: "description", value: description },
        { name: "content", value: content },
        { name: "isSecret", value: String(isSecret) },
        { name: "secret", value: isSecret ? secret : "" },
      ];

      fields.forEach((field) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = field.name;
        input.value = field.value;
        form.appendChild(input);
      });



      // Add to DOM and submit the form
      document.body.appendChild(form);
      form.submit();

      // Clean up
      document.body.removeChild(form);
    } catch (error) {

      alert("Failed to save note");
    } finally {
      saving = false;
    }
  }

  async function deleteNote() {
    if (!isEditing) return;

    if (
      !confirm(
        "Are you sure you want to delete this note? This action cannot be undone."
      )
    ) {
      return;
    }

    deleting = true;

    try {
      // Include the edit parameter in the URL so the server knows which note to delete
      const editSlug = $page.url.searchParams.get("edit");
      const response = await fetch(`?/delete&edit=${encodeURIComponent(editSlug || "")}`, {
        method: "POST",
        body: new FormData(),
        redirect: "follow",
      });

      // Handle redirect responses
      if (response.redirected) {
        goto(response.url);
        return;
      }

      if (response.ok) {
        goto("/dashboard");
      } else {
        try {
          const result = await response.json();
          alert(result.error || "Failed to delete note");
        } catch {
          alert("Failed to delete note");
        }
      }
    } catch (error) {
      // Don't treat redirects as errors
      if (error instanceof TypeError && error.message.includes("Redirect")) {
        goto("/dashboard");
      } else {

        alert("Failed to delete note");
      }
    } finally {
      deleting = false;
    }
  }

  function cancel() {
    goto("/dashboard");
  }

  function insertMarkdown(syntax: string) {
    if (!editorTextarea) return;

    const start = editorTextarea.selectionStart;
    const end = editorTextarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let replacement = "";
    switch (syntax) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        break;
      case "code":
        replacement = `\`${selectedText || "code"}\``;
        break;
      case "codeblock":
        replacement = `\`\`\`\n${selectedText || "code block"}\n\`\`\``;
        break;
      case "link":
        replacement = `[${selectedText || "link text"}](url)`;
        break;
      case "image":
        replacement = `![${selectedText || "alt text"}](image-url)`;
        break;
      case "h1":
        replacement = `# ${selectedText || "Heading 1"}`;
        break;
      case "h2":
        replacement = `## ${selectedText || "Heading 2"}`;
        break;
      case "h3":
        replacement = `### ${selectedText || "Heading 3"}`;
        break;
      case "ul":
        replacement = `- ${selectedText || "list item"}`;
        break;
      case "ol":
        replacement = `1. ${selectedText || "numbered item"}`;
        break;
    }

    content =
      content.substring(0, start) + replacement + content.substring(end);

    // Update cursor position
    setTimeout(() => {
      editorTextarea.focus();
      editorTextarea.setSelectionRange(
        start + replacement.length,
        start + replacement.length
      );
    }, 0);
  }

  // Update preview when content changes
  $: if (mounted && content !== undefined) {
    updatePreview();
  }
</script>

<svelte:head>
  <title>{isEditing ? "Edit Note" : "New Note"} - Secret Notes</title>
  <meta name="description" content="Create and edit your markdown notes" />
</svelte:head>

<div class="editor-page" class:fade-in={mounted}>
  <!-- Header -->
  <header class="editor-header">
    <div class="header-left">
      <Button variant="secondary" on:click={cancel}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </Button>
      <div class="title-section">
        <h1>{isEditing ? "Edit Note" : "New Note"}</h1>
        <div class="status-indicators">
          <div
            class="visibility-indicator"
            class:public={!isSecret}
            class:secret={isSecret}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              {#if isSecret}
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <circle cx="12" cy="7" r="4" />
                <path d="M12 1v6" />
              {:else}
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              {/if}
            </svg>
            <span>{isSecret ? "Private" : "Public"}</span>
          </div>
          <div class="save-indicator" class:saving>
            {#if saving}
              <div class="spinner"></div>
              <span>Saving...</span>
            {:else}
              <span>Saved</span>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <div class="header-right">
      {#if isEditing}
        <Button variant="danger" on:click={deleteNote} loading={deleting} disabled={deleting}>
          <Delete />
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      {/if}
      <Button
        on:click={saveNote}
        loading={saving}
        disabled={saving || (isSecret && !secret.trim() && (!isEditing || !originalIsSecret))}
      >
        <Save />
        {saving ? (isEditing ? "Updating..." : "Saving...") : (isEditing ? "Update" : "Save")}
      </Button>
    </div>
  </header>

  <!-- Settings Bar -->
  <div class="settings-bar">
    <div class="settings-left">
      <div class="input-group">
        <Input
          id="title"
          type="text"
          bind:value={title}
          placeholder="Untitled note"
          label="Title"
        />
      </div>

      <div class="input-group">
        <Input
          id="description"
          type="text"
          bind:value={description}
          placeholder="Brief description of your note"
          label="Description"
        />
      </div>

      <div class="visibility-group">
        <label for="visibility">Visibility</label>
        <select
          id="visibility"
          on:change={handleVisibilityChange}
          value={isSecret ? "secret" : "public"}
          class="visibility-select"
        >
          <option value="public"
            >🌐 Public - Anyone with the link can view</option
          >
          <option value="secret">🔒 Private - Requires secret to view</option>
        </select>
      </div>

      {#if showSecretPrompt}
        <div class="secret-input-group">
          <Input
            id="secret"
            type="password"
            bind:value={secret}
            placeholder={isEditing && data.note?.isSecret
              ? "Enter new secret (or leave empty to keep existing)"
              : "Enter secret key for this note"}
            label="Secret Key"
          />
        </div>
      {/if}
    </div>
  </div>

  <!-- Toolbar -->
  <div class="toolbar">
    <div class="toolbar-group">
      <Button
        size="small"
        variant="secondary"
        on:click={() => insertMarkdown("bold")}
        title="Bold"
      >
        <Bold />
      </Button>
      <Button
        size="small"
        variant="secondary"
        on:click={() => insertMarkdown("italic")}
        title="Italic"
      >
        <Italic />
      </Button>
      <Button
        size="small"
        variant="secondary"
        on:click={() => insertMarkdown("code")}
        title="Inline Code"
      >
        <Code />
      </Button>
    </div>

    <div class="toolbar-group">
      <Button
        size="small"
        variant="secondary"
        on:click={() => insertMarkdown("h1")}
        title="Heading 1">H1</Button>
      <Button
        size="small"
        variant="secondary"
        on:click={() => insertMarkdown("h2")}
        title="Heading 2">H2</Button>
      <Button
        size="small"
        variant="secondary"
        on:click={() => insertMarkdown("h3")}
        title="Heading 3">H3</Button>
    </div>

    <div class="toolbar-group">
      <Button
        size="small"
        variant="secondary"
        on:click={() => insertMarkdown("ul")}
        title="Bullet List"
      >
        <List />
      </Button>
      <Button
        size="small"
        variant="secondary"
        on:click={() => insertMarkdown("ol")}
        title="Numbered List"
      >
        <NumberedList />
      </Button>
    </div>

    <div class="toolbar-group">
      <Button
        size="small"
        variant="secondary"
        on:click={() => insertMarkdown("link")}
        title="Link"
      >
        <Link />
      </Button>
      <Button
        size="small"
        variant="secondary"
        on:click={() => insertMarkdown("image")}
        title="Image"
      >
        <Image />
      </Button>
      <Button
        size="small"
        variant="secondary"
        on:click={() => insertMarkdown("codeblock")}
        title="Code Block"
      >
        <Code />
      </Button>
    </div>
  </div>

  <!-- Editor Content -->
  <div class="editor-content">
    <div class="editor-pane">
      <div class="pane-header">
        <h3>
          <File />
          Write
        </h3>
        <div class="pane-info">
          <span class="word-count"
            >{content.split(/\s+/).filter((w) => w.length > 0).length} words</span
          >
        </div>
      </div>
      <div class="pane-content">
        <textarea
          bind:this={editorTextarea}
          bind:value={content}
          placeholder={`# New Note
Start writing here... You can use Markdown syntax:

## Formatting
- **Bold** and *italic* text
- ~~Strikethrough~~

## Lists
- Item 1
- Item 2
  - Subitem

## Code
\`\`\`js
// Write your code here
// Write your code here
\`\`\`

## Blockquotes
> Great for tips, warnings, or highlights.

## Links & Images
[Example link](https://example.com)

![Image](https://via.placeholder.com/100)

---

Happy writing! 🚀`}
          class="editor-textarea"
          spellcheck="false"
        ></textarea>
      </div>
    </div>

    <div class="editor-pane">
      <div class="pane-header">
        <h3>
          <Eye />
          Preview
        </h3>
        <div class="pane-info">
          <span class="render-info">Live preview</span>
        </div>
      </div>
      <div class="pane-content">
        <div bind:this={previewContainer} class="preview-content">
          <div class="preview-placeholder">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <p>Start typing to see your markdown come to life...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .editor-page {
    height: 100vh;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    display: flex;
    flex-direction: column;
    opacity: 0;
    transition: opacity 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .editor-page::before {
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

  .editor-page::after {
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

  @keyframes particleFloat {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-100px); }
  }

  .editor-page.fade-in {
    opacity: 1;
  }

  /* Header */
  .editor-header {
    background: rgba(15, 15, 35, 0.9);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(99, 102, 241, 0.2);
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    position: relative;
    z-index: 10;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .title-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .title-section h1 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: #f1f5f9;
  }

  .status-indicators {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .visibility-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .visibility-indicator.public {
    color: #10b981;
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.1);
  }

  .visibility-indicator.secret {
    color: #f59e0b;
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
  }

  .save-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    font-size: 0.75rem;
    color: var(--text-secondary);
    transition: all 0.2s ease;
  }

  .save-indicator.saving {
    background: rgba(99, 102, 241, 0.1);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  .header-right {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  /* Settings Bar */
  .settings-bar {
    background: rgba(15, 15, 35, 0.9);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(99, 102, 241, 0.2);
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    position: relative;
    z-index: 10;
  }

  .settings-left {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex: 1;
  }

  .input-group {
    min-width: 300px;
  }



  .visibility-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .visibility-group label {
    font-weight: 500;
    color: #f1f5f9;
    font-size: 0.875rem;
    letter-spacing: 0.02em;
  }



  .visibility-select {
    padding: 0.75rem 1rem;
    border: 2px solid rgba(99, 102, 241, 0.2);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    color: #f1f5f9;
    font-size: 0.875rem;
    min-width: 280px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    letter-spacing: 0.02em;
    box-shadow: 
      0 4px 15px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1rem;
    padding-right: 3rem;
  }

  .visibility-select:hover {
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }

  .visibility-select:focus {
    outline: none;
    border-color: #6366f1;
    background: rgba(0, 0, 0, 0.6);
    box-shadow: 
      0 0 0 3px rgba(99, 102, 241, 0.1),
      0 4px 20px rgba(99, 102, 241, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
    animation: focusGlow 0.3s ease-out;
  }

  .visibility-select option {
    background: rgba(15, 15, 35, 0.95);
    color: #f1f5f9;
    padding: 0.75rem;
    border: none;
    font-size: 0.875rem;
  }

  .visibility-select option:hover,
  .visibility-select option:checked {
    background: rgba(99, 102, 241, 0.2);
    color: #f1f5f9;
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

  .secret-input-group {
    min-width: 360px;
  }



  /* Toolbar */
  .toolbar {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    padding: 0.75rem 1.5rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    overflow-x: auto;
  }

  .toolbar-group {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }



  /* Editor Content - Fixed 50/50 split */
  .editor-content {
    flex: 1;
    display: flex;
    min-height: 0;
    height: 100%;
  }

  .editor-pane {
    width: 50%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border-color);
    background: var(--bg-primary);
    min-height: 0;
  }

  .editor-pane:last-child {
    border-right: none;
  }

  .pane-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
  }

  .pane-header h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .pane-info {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .pane-content {
    flex: 1;
    min-height: 0;
  }

  .editor-textarea {
    width: 100%;
    height: 100%;
    border: none;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
    font-size: 0.875rem;
    line-height: 1.7;
    padding: 1.5rem;
    resize: none;
    outline: none;
    tab-size: 2;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* Custom scrollbar for editor */
  .editor-textarea::-webkit-scrollbar {
    width: 8px;
  }

  .editor-textarea::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  .editor-textarea::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
  }

  .editor-textarea::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary);
  }

  .editor-textarea::placeholder {
    color: var(--text-secondary);
    opacity: 0.7;
  }

  .preview-content {
    padding: 1.5rem;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background: var(--bg-primary);
  }

  /* Custom scrollbar for preview */
  .preview-content::-webkit-scrollbar {
    width: 8px;
  }

  .preview-content::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  .preview-content::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
  }

  .preview-content::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary);
  }

  .preview-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary);
    text-align: center;
    gap: 1rem;
  }

  .preview-placeholder svg {
    opacity: 0.5;
  }

  .preview-placeholder p {
    margin: 0;
    font-size: 0.875rem;
  }

  /* Spinner */
  .spinner {
    width: 12px;
    height: 12px;
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

  /* Enhanced markdown styling */
  :global(.preview-content h1) {
    color: var(--text-primary);
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  :global(.preview-content h1:hover) {
    color: var(--primary-color);
  }

  :global(.preview-content h2) {
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.25rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  :global(.preview-content h2:hover) {
    color: var(--primary-color);
  }

  :global(.preview-content h3) {
    color: var(--text-primary);
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  :global(.preview-content h3:hover) {
    color: var(--primary-color);
  }

  :global(.preview-content p) {
    color: var(--text-primary);
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  :global(.preview-content ul, .preview-content ol) {
    color: var(--text-primary);
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }

  :global(.preview-content li) {
    margin-bottom: 0.5rem;
  }

  :global(.preview-content blockquote) {
    border-left: 4px solid var(--primary-color);
    padding-left: 1rem;
    margin: 1rem 0;
    color: var(--text-secondary);
    font-style: italic;
  }

  :global(.preview-content pre) {
    background: var(--bg-secondary) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: 0.5rem !important;
    overflow-x: auto;
    margin: 1rem 0;
  }

  :global(.preview-content pre code.hljs) {
    padding: 1rem;
    display: block;
    background: transparent !important;
    font-size: 0.875rem;
    line-height: 1.6;
    font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  }

  :global(.preview-content p code) {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    padding: 0.125rem 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--primary-color);
    font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  }

  :global(.preview-content a) {
    color: var(--primary-color);
    text-decoration: none;
    border-bottom: 1px dotted var(--primary-color);
  }

  :global(.preview-content a:hover) {
    border-bottom-style: solid;
  }

  :global(.preview-content img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  :global(.preview-content table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  :global(.preview-content th, .preview-content td) {
    border: 1px solid var(--border-color);
    padding: 0.75rem;
    text-align: left;
  }

  :global(.preview-content th) {
    background: var(--bg-secondary);
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .editor-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .header-left {
      justify-content: space-between;
    }

    .header-right {
      justify-content: center;
    }

    .settings-bar {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .settings-left {
      flex-direction: column;
      gap: 1rem;
    }

    .visibility-select {
      min-width: auto;
    }

    .toolbar {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .editor-content {
      flex-direction: column;
    }

    .editor-pane {
      width: 100%;
      height: 50vh;
      border-right: none;
      border-bottom: 1px solid var(--border-color);
    }

    .editor-pane:last-child {
      border-bottom: none;
    }
  }
</style>

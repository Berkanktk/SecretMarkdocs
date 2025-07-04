# SecretMarkdocs

Simple self-hosted notes platform built with SvelteKit. Markdown files live in `content/` and each file has a `secret` defined in its frontmatter. Visiting `/{slug}` prompts for the secret before revealing the note.

Run `npm install` then `npm run dev` to start (requires internet access to install dependencies).

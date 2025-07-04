<script>
  export let size = 14;
  export let strokeWidth = 2;
  export let visible = true;
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={strokeWidth}
>
  {#if visible}
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  {:else}
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <circle cx="12" cy="7" r="4" />
    <path d="M12 1v6" />
  {/if}
</svg> 
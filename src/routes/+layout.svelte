<script>
  import '../app.css';
</script>

<slot />

<style>
  :global(::-webkit-scrollbar) {
    background-color: #2c2c2c;
    width: 8px;
    height: 8px;
    border-radius: 4px;
}

:global(::-webkit-scrollbar-thumb) {
    background-color: #474747;
    border-radius: 4px;
}

:global(article h1) {
  margin-top: 20px !important;
  border-bottom: 1px solid var(--border-color);
}
</style>

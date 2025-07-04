<script>
  export let size = 16;
</script>

<div class="spinner" style="width: {size}px; height: {size}px;"></div>

<style>
  .spinner {
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
</style> 
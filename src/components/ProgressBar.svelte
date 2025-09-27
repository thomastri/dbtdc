<script>
  export let progress = 0;
</script>

<div class="progress-indicator mb-5">
  <progress class="progress is-warning" value={progress} max="100">{progress}%</progress>
  <p class="has-text-centered mt-2">Progress: {progress}%</p>
</div>

<style>
  .progress-indicator {
    margin-bottom: 2rem;
  }
</style>
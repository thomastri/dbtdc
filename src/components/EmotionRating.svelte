<script>
  import { createEventDispatcher } from 'svelte';
  
  export let emotions = [];
  
  const dispatch = createEventDispatcher();
  let ratings = {};
  let currentEmotionIndex = 0;
  
  $: currentEmotion = emotions[currentEmotionIndex];
  $: isComplete = Object.keys(ratings).length === emotions.length;
  
  function selectRating(rating) {
    ratings[currentEmotion] = rating;
    ratings = { ...ratings }; // Trigger reactivity
    
    // Auto-advance to next emotion
    setTimeout(() => {
      if (currentEmotionIndex < emotions.length - 1) {
        currentEmotionIndex++;
      }
    }, 500);
  }
  
  function goToPrevious() {
    if (currentEmotionIndex > 0) {
      currentEmotionIndex--;
    }
  }
  
  function goToNext() {
    if (currentEmotionIndex < emotions.length - 1) {
      currentEmotionIndex++;
    }
  }
  
  function submitRatings() {
    dispatch('complete', ratings);
  }
</script>

<div class="emotion-rating">
  <h2 class="title is-4 has-text-centered">Rate Your Emotions</h2>
  <p class="subtitle has-text-centered">How intensely did you feel each emotion today?</p>
  
  <div class="emotion-card">
    <div class="card">
      <div class="card-content has-text-centered">
        <h3 class="title is-5">{currentEmotion}</h3>
        <p class="subtitle is-6">Rate from 0 (not at all) to 5 (extremely intense)</p>
        
        <div class="rating-buttons">
          {#each Array(6) as _, i}
            <button 
              class="button rating-button {ratings[currentEmotion] === i ? 'selected' : 'is-primary'}"
              on:click={() => selectRating(i)}
            >
              {i}
            </button>
          {/each}
        </div>
        
        {#if ratings[currentEmotion] !== undefined}
          <p class="mt-3 has-text-warning">
            Selected: {ratings[currentEmotion]}
          </p>
        {/if}
      </div>
    </div>
  </div>
  
  <div class="navigation-controls">
    <div class="level">
      <div class="level-left">
        <button 
          class="button is-primary" 
          disabled={currentEmotionIndex === 0}
          on:click={goToPrevious}
        >
          ← Previous
        </button>
      </div>
      
      <div class="level-item">
        <span class="tag is-warning is-medium">
          {currentEmotionIndex + 1} of {emotions.length}
        </span>
      </div>
      
      <div class="level-right">
        {#if currentEmotionIndex < emotions.length - 1}
          <button 
            class="button is-primary" 
            on:click={goToNext}
          >
            Next →
          </button>
        {:else if isComplete}
          <button 
            class="button is-warning is-large" 
            on:click={submitRatings}
          >
            Continue to Skills
          </button>
        {/if}
      </div>
    </div>
  </div>
  
  <div class="completed-emotions mt-4">
    <h4 class="subtitle is-6">Completed Ratings:</h4>
    <div class="tags">
      {#each emotions as emotion}
        {#if ratings[emotion] !== undefined}
          <span class="tag is-warning">
            {emotion}: {ratings[emotion]}
          </span>
        {:else}
          <span class="tag">
            {emotion}: -
          </span>
        {/if}
      {/each}
    </div>
  </div>
</div>

<style>
  .rating-buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
  }
  
  .emotion-card {
    margin-bottom: 2rem;
  }
  
  .navigation-controls {
    margin-top: 2rem;
  }
  
  .completed-emotions .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>
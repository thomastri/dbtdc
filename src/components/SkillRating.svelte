<script>
  import { createEventDispatcher } from 'svelte';
  
  export let skills = [];
  
  const dispatch = createEventDispatcher();
  let ratings = {};
  let currentSkillIndex = 0;
  
  $: currentSkill = skills[currentSkillIndex];
  $: isComplete = Object.keys(ratings).length === skills.length;
  
  function selectRating(rating) {
    ratings[currentSkill] = rating;
    ratings = { ...ratings }; // Trigger reactivity
    
    // Auto-advance to next skill
    setTimeout(() => {
      if (currentSkillIndex < skills.length - 1) {
        currentSkillIndex++;
      }
    }, 500);
  }
  
  function goToPrevious() {
    if (currentSkillIndex > 0) {
      currentSkillIndex--;
    }
  }
  
  function goToNext() {
    if (currentSkillIndex < skills.length - 1) {
      currentSkillIndex++;
    }
  }
  
  function submitRatings() {
    dispatch('complete', ratings);
  }
</script>

<div class="skill-rating">
  <h2 class="title is-4 has-text-centered">Rate Your Skills Usage</h2>
  <p class="subtitle has-text-centered">How well did you use each skill today?</p>
  
  <div class="skill-card">
    <div class="card">
      <div class="card-content has-text-centered">
        <h3 class="title is-5">{currentSkill}</h3>
        <p class="subtitle is-6">Rate from 0 (didn't use at all) to 5 (used very effectively)</p>
        
        <div class="rating-buttons">
          {#each Array(6) as _, i}
            <button 
              class="button rating-button {ratings[currentSkill] === i ? 'selected' : 'is-primary'}"
              on:click={() => selectRating(i)}
            >
              {i}
            </button>
          {/each}
        </div>
        
        {#if ratings[currentSkill] !== undefined}
          <p class="mt-3 has-text-warning">
            Selected: {ratings[currentSkill]}
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
          disabled={currentSkillIndex === 0}
          on:click={goToPrevious}
        >
          ← Previous
        </button>
      </div>
      
      <div class="level-item">
        <span class="tag is-warning is-medium">
          {currentSkillIndex + 1} of {skills.length}
        </span>
      </div>
      
      <div class="level-right">
        {#if currentSkillIndex < skills.length - 1}
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
            Continue to Notes
          </button>
        {/if}
      </div>
    </div>
  </div>
  
  <div class="completed-skills mt-4">
    <h4 class="subtitle is-6">Completed Ratings:</h4>
    <div class="tags">
      {#each skills as skill}
        {#if ratings[skill] !== undefined}
          <span class="tag is-warning">
            {skill}: {ratings[skill]}
          </span>
        {:else}
          <span class="tag">
            {skill}: -
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
  
  .skill-card {
    margin-bottom: 2rem;
  }
  
  .navigation-controls {
    margin-top: 2rem;
  }
  
  .completed-skills .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>
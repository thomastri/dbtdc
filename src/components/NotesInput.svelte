<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  let notes = '';
  let wantToAddNotes = null; // null = not decided, true = yes, false = no
  
  function handleYes() {
    wantToAddNotes = true;
  }
  
  function handleNo() {
    wantToAddNotes = false;
    dispatch('complete', '');
  }
  
  function submitNotes() {
    dispatch('complete', notes.trim());
  }
  
  function goBack() {
    wantToAddNotes = null;
    notes = '';
  }
</script>

<div class="notes-input">
  <h2 class="title is-4 has-text-centered">Optional Notes</h2>
  
  {#if wantToAddNotes === null}
    <div class="has-text-centered">
      <p class="subtitle">Would you like to add any notes about today?</p>
      <p class="mb-4">You can add thoughts, reflections, or anything else you'd like to remember about today.</p>
      
      <div class="buttons is-centered">
        <button class="button is-warning is-large" on:click={handleYes}>
          Yes, Add Notes
        </button>
        <button class="button is-primary is-large" on:click={handleNo}>
          No, Skip Notes
        </button>
      </div>
    </div>
  {:else if wantToAddNotes === true}
    <div class="notes-form">
      <p class="subtitle has-text-centered">Add your notes for today:</p>
      
      <div class="field">
        <div class="control">
          <textarea 
            class="textarea" 
            placeholder="Write your thoughts, reflections, or anything else about today..."
            rows="6"
            bind:value={notes}
          ></textarea>
        </div>
      </div>
      
      <div class="field is-grouped is-grouped-centered">
        <div class="control">
          <button class="button is-primary" on:click={goBack}>
            ← Back
          </button>
        </div>
        <div class="control">
          <button 
            class="button is-warning is-large" 
            on:click={submitNotes}
            disabled={notes.trim().length === 0}
          >
            Save & Complete
          </button>
        </div>
      </div>
      
      <div class="help-text mt-3">
        <p class="has-text-grey">
          <strong>Character count:</strong> {notes.length}
        </p>
        <p class="has-text-grey is-size-7">
          Your notes will be saved to your daily tracking spreadsheet.
        </p>
      </div>
    </div>
  {/if}
</div>

<style>
  .notes-input {
    padding: 1rem;
  }
  
  .notes-form {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .help-text {
    text-align: center;
  }
  
  .buttons {
    margin-top: 2rem;
  }
  
  .textarea {
    min-height: 120px;
    resize: vertical;
  }
</style>
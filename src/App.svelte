<script>
  import EmotionRating from './components/EmotionRating.svelte';
  import SkillRating from './components/SkillRating.svelte';
  import NotesInput from './components/NotesInput.svelte';
  import ProgressBar from './components/ProgressBar.svelte';
  import { GoogleSheetsService } from './services/googleSheets.js';

  // App state
  let currentStep = 'emotions'; // emotions, skills, notes, complete
  let emotionRatings = {};
  let skillRatings = {};
  let notes = '';
  let isLoading = false;
  let error = null;

  // Emotions list (based on typical emotion tracking)
  const emotions = [
    'Anger',
    'Fear/Anxiety', 
    'Sadness',
    'Disgust',
    'Joy/Happiness',
    'Surprise',
    'Contempt',
    'Guilt',
    'Shame',
    'Pride'
  ];

  // Skills list (common DBT/therapy skills)
  const skills = [
    'Mindfulness',
    'Distress Tolerance',
    'Emotion Regulation',
    'Interpersonal Effectiveness',
    'Self-Care',
    'Communication',
    'Problem Solving',
    'Coping Strategies'
  ];

  const googleSheets = new GoogleSheetsService();

  function handleEmotionsComplete(ratings) {
    emotionRatings = ratings;
    currentStep = 'skills';
  }

  function handleSkillsComplete(ratings) {
    skillRatings = ratings;
    currentStep = 'notes';
  }

  function handleNotesComplete(userNotes) {
    notes = userNotes;
    submitAllData();
  }

  async function submitAllData() {
    isLoading = true;
    error = null;
    
    try {
      const today = new Date();
      const dateString = `${today.getMonth() + 1}/${today.getDate()}`;
      
      await googleSheets.updateSpreadsheet({
        date: dateString,
        emotions: emotionRatings,
        skills: skillRatings,
        notes: notes
      });
      
      currentStep = 'complete';
    } catch (err) {
      error = `Failed to save data: ${err.message}`;
      console.error('Error submitting data:', err);
    } finally {
      isLoading = false;
    }
  }

  function resetApp() {
    currentStep = 'emotions';
    emotionRatings = {};
    skillRatings = {};
    notes = '';
    error = null;
  }

  function getProgressPercentage() {
    switch(currentStep) {
      case 'emotions': return 25;
      case 'skills': return 50;
      case 'notes': return 75;
      case 'complete': return 100;
      default: return 0;
    }
  }
</script>

<main class="section">
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-8">
        <div class="card">
          <div class="card-content">
            <h1 class="title has-text-centered">Daily Emotion & Skills Tracker</h1>
            
            <ProgressBar progress={getProgressPercentage()} />
            
            {#if error}
              <div class="notification is-danger">
                <button class="delete" on:click={() => error = null}></button>
                {error}
              </div>
            {/if}

            {#if isLoading}
              <div class="has-text-centered">
                <div class="button is-loading is-large is-primary">Loading</div>
                <p class="mt-4">Saving your data...</p>
              </div>
            {:else if currentStep === 'emotions'}
              <EmotionRating 
                {emotions} 
                on:complete={(e) => handleEmotionsComplete(e.detail)} 
              />
            {:else if currentStep === 'skills'}
              <SkillRating 
                {skills} 
                on:complete={(e) => handleSkillsComplete(e.detail)} 
              />
            {:else if currentStep === 'notes'}
              <NotesInput 
                on:complete={(e) => handleNotesComplete(e.detail)} 
              />
            {:else if currentStep === 'complete'}
              <div class="has-text-centered">
                <h2 class="title is-4">Thank you!</h2>
                <p class="subtitle">Your daily tracking has been saved successfully.</p>
                <button class="button is-warning is-large mt-4" on:click={resetApp}>
                  Track Another Day
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
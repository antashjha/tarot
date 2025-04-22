document.addEventListener('DOMContentLoaded', function() {
  const selectedCardsData = JSON.parse(localStorage.getItem('selectedCards')) || [];
  const selectedCardsContainer = document.querySelector('.selected-cards');
  const readingResults = document.querySelector('.reading-results');
  
  if (!selectedCardsData || selectedCardsData.length === 0) {
      readingResults.innerHTML = '<p>No reading found. Please go back and select cards.</p>';
      return;
  }

  // Load full card data from JSON to get messages and categories
  fetch('data/cards.json')
      .then(response => response.json())
      .then(fullCardData => {
          // Match selected cards with full data
          const selectedCards = selectedCardsData.map(selected => 
              fullCardData.find(card => card.id === selected.id)
          );
          
          // Generate personalized message
          const personalizedMessage = generatePersonalizedMessage(selectedCards);
          readingResults.innerHTML = `
              <div class="personalized-message">${personalizedMessage}</div>
          `;

          // Display selected cards and their readings
          selectedCards.forEach((card, index) => {
              if (!card) return;
              
              // Display card
              const cardElement = document.createElement('div');
              cardElement.className = 'reading-card';
              cardElement.innerHTML = `
                  <div class="symbol">${card.symbol}</div>
                  <div class="title">${card.title}</div>
              `;
              selectedCardsContainer.appendChild(cardElement);
              
              // Create reading result
              const resultElement = document.createElement('div');
              resultElement.className = 'reading-result';
              resultElement.innerHTML = `
                  <h3>Card ${index + 1}: ${card.title}</h3>
                  <p>${card.message}</p>
              `;
              readingResults.appendChild(resultElement);
              
              // Show results with delay
              setTimeout(() => {
                  resultElement.style.display = 'block';
                  resultElement.style.animation = 'fadeIn 1s forwards';
              }, (index + 1) * 800);
          });
      })
      .catch(error => {
          console.error('Error loading card data:', error);
          readingResults.innerHTML = '<p>Error loading reading. Please try again.</p>';
      });
  // Back button functionality
  document.querySelector('.btn-back').addEventListener('click', function() {
      window.location.href = 'index.html';
  });

  // Music controls
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  let musicPlaying = false;
  
  function attemptPlayMusic() {
      bgMusic.volume = 0.3;
      const playPromise = bgMusic.play();
      
      if (playPromise !== undefined) {
          playPromise.then(_ => {
              musicPlaying = true;
              updateMusicIcon();
          })
          .catch(error => {
              musicPlaying = false;
              updateMusicIcon();
          });
      }
  }
  
  function updateMusicIcon() {
      musicToggle.textContent = musicPlaying ? '♪' : '🔇';
  }
  
  musicToggle.addEventListener('click', function() {
      if (musicPlaying) {
          bgMusic.pause();
      } else {
          bgMusic.play();
      }
      musicPlaying = !musicPlaying;
      updateMusicIcon();
  });
  
  document.body.addEventListener('click', function firstInteraction() {
      attemptPlayMusic();
      document.body.removeEventListener('click', firstInteraction);
  });

  function generatePersonalizedMessage(cards) {
      const loveCount = cards.filter(c => c.category === 'love').length;
      const passionCount = cards.filter(c => c.category === 'passion').length;
      const destinyCount = cards.filter(c => c.category === 'destiny').length;
      
      if (loveCount >= 2) {
          return "True love sees you, not who you pretend to be. Stay as you are, and the right hearts will find you.";
      } else if (passionCount >= 2) {
          return "Sweetheart, you shine just as you are.Don’t let life’s storms dim your light or make you change to fit others. You are meant to stand out, not shrink in.";
      } else if (destinyCount >= 2) {
          return "Even if everything changes — the skies, the seasons, the way the world moves around us — let this, whatever this is between us, stay untouched. Let us remain the one constant in a world full of shifting tides.";
      } else {
          return "In your arms, the noise fades. It’s just your heartbeat, and mine — speaking a language no one else hears.";
      }
  }
});
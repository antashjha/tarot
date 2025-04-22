document.addEventListener('DOMContentLoaded', function() {
  const cardStack = document.querySelector('.card-stack');
  const counter = document.querySelector('.counter span');
  const selectedCards = [];
  
  // Load card data from JSON
  fetch('data/cards.json')
      .then(response => response.json())
      .then(tarotCards => {
          // Create and position cards in a horizontal stack
          tarotCards.forEach((card, index) => {
              const cardElement = document.createElement('div');
              cardElement.className = 'tarot-card';
              cardElement.dataset.id = card.id;
              
              cardElement.innerHTML = `
                  <div class="symbol">${card.symbol}</div>
                  <div class="title">${card.title}</div>
              `;
              
              // Position each card with overlap (only 5mm visible)
              const offset = index * 20; // 20px (~5mm) overlap
              cardElement.style.left = `${offset}px`;
              cardElement.style.zIndex = index;
              
              cardElement.addEventListener('click', function() {
                  if (selectedCards.length < 5 && !selectedCards.some(c => c.id === card.id)) {
                      selectedCards.push(card);
                      counter.textContent = selectedCards.length;
                      
                      // Pop out effect without revealing
                      cardElement.classList.add('selected');
                      
                      if (selectedCards.length === 5) {
                          setTimeout(() => {
                              localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
                              window.location.href = "reading.html";
                          }, 1000);
                      }
                  }
              });
              
              cardStack.appendChild(cardElement);
          });
          
          // Set container width to fit all cards
          const totalWidth = (tarotCards.length * 20) + 180;
          cardStack.style.width = `${totalWidth}px`;
      })
      .catch(error => {
          console.error('Error loading card data:', error);
          cardStack.innerHTML = '<p>Error loading cards. Please refresh the page.</p>';
      });
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
        
        // Attempt to play music on first interaction
        document.body.addEventListener('click', function firstInteraction() {
          attemptPlayMusic();
          document.body.removeEventListener('click', firstInteraction);
        });
      
        // Hide welcome message after delay
        setTimeout(() => {
          document.querySelector('.heart-welcome').style.opacity = '0';
          setTimeout(() => {
            document.querySelector('.heart-welcome').style.display = 'none';
          }, 1000);
        }, 3000);
  });
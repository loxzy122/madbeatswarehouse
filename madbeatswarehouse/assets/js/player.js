async function loadBeats() {
  const res = await fetch('./data/beats.json');
  const beats = await res.json();

  const container = document.getElementById('beatList');
  const categoryFilter = document.getElementById('categoryFilter');
  const searchInput = document.getElementById('searchInput');


  // 🎨 [Random Dropbox GIF Cover Logic Starts Here]
const gifCovers = [
  "https://www.dropbox.com/scl/fi/h7orvr2i76jt7eekp6s2h/AQMEDDTBdA8I6QCMLEwzWUcEzwUJDYvmAq1tYx9M_Z6KZSaALIpTBsu9kemlbfJtJuO1SDwJbESTXfUVZ8JQOMCSXEYdjGy3BbQTVp44V8mpT7k8YhRTc_gkM7rDImAl.gif?rlkey=3qx5pa8tu15zwygxxe261bh2o&st=uaw47bqr&dl=1",
  "hhttps://www.dropbox.com/scl/fi/q8k6ycavaexf3dr6twyt4/AQMiAH8EYNdxy440ecfX_Jw6L7X7dude0peeRUzuIuXh4zqolgQ-o9bfgzdFKZxoN5DZgIdEUltxg1mwfXUuIOf6HugTLrtPu_aw_lt-RSK0hPZ_dujEAxzkv2jhk_gZ.gif?rlkey=f5t9wfpwgfbdnqzbouecaj1ha&st=odkbnu41&dl=1",
  "https://www.dropbox.com/scl/fi/h018gqg59ne1lgj0tmn72/AQNsqKhSQp8p0t_7KyiNqjEgHZdXeUWidc4_mNdErI3cpCt3srSAlxzmLA63NDJjuJI5D3keyz8sqoDrdxROYdP0Vbawotji4MWXH792s8Vke5DmEJRWGN_smoGxVgU.gif?rlkey=jsl57rcukj202klctuq7bvbh7&st=2vwzid7a&dl=1",
  "https://www.dropbox.com/scl/fi/9vz2omibeo5p4ddbr191s/AQOk68Y1D1FMsIoWWT4MtQ4GU7gpRZbBoyiuOKKdVckwmlLuYJ38qWJoAfr-DWQhWUmb_edR0ipok0aVu_7SEu5JeKGLPvpdDdnkqUyVnzUmFSqP889EQ75REnHhvkM.gif?rlkey=26rfqwz89rnpy75jnk6387rg0&st=rljndl24&dl=1",
  "https://www.dropbox.com/scl/fi/htcwo286yjey04jt8e38x/AQOo6UqwyKbqXPGieeKstB7XdXXvX5SXDXRLfrH1FLwddCjixda8BtcL0Si2qZQLSBsqpA0SNcHOeMOlcQyut5IUP-knVrqIIjh4RT-Lm4GtkWfRz8m_oou1nzCKMUjt-1.gif?rlkey=wyxje15hqoj09nx5gxv32kply&st=a6umf50q&l=1"
];

// assign random Dropbox GIFs to beats that don't have a cover
beats.forEach(beat => {
  if (!beat.cover || beat.cover.trim() === '') {
    const randomGif = gifCovers[Math.floor(Math.random() * gifCovers.length)];
    beat.cover = randomGif;
  }
});
// 🎨 [Random Dropbox GIF Cover Logic Ends Here]


  // Extract unique categories
  const categories = [...new Set(beats.map(b => b.category || 'Uncategorized'))].sort();
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.style.color = '#4ade80';
    option.style.cursor = 'pointer';
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // --- Render Beats ---
  function renderBeats(filter = 'all', searchTerm = '') {
    container.innerHTML = ''; // Clear container

    const filtered = beats.filter(b => {
      const matchCategory = filter === 'all' || (b.category || '').toLowerCase() === filter.toLowerCase();
      const matchSearch =
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.genre.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<p class="text-gray-400 text-center w-full">No beats found.</p>`;
      return;
    }

    // Create horizontal scroll container
    const scrollRow = document.createElement('div');
    scrollRow.className = "flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar";

    filtered.forEach((beat, index) => {
      const card = document.createElement('div');
      card.className = `
        min-w-[200px] bg-gray-800/60 rounded-2xl shadow-md snap-start flex-shrink-0
        hover:bg-gray-700 transition-all duration-200 cursor-pointer relative group
      `;

      card.innerHTML = `
        <div class="relative">
          <img src="${beat.cover}" alt="${beat.title}" 
               class="w-full h-40 object-cover rounded-t-2xl group-hover:opacity-80 transition-opacity duration-200">
          <button class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition play-btn" data-index="${index}">
            <i class="fas fa-play text-white text-3xl bg-green-500/80 p-3 rounded-full"></i>
          </button>
        </div>
        <div class="p-3">
          <h3 class="text-sm font-semibold text-white truncate">${beat.title}</h3>
          <p class="text-xs text-gray-400 mb-1">${beat.genre} | ${beat.bpm} BPM</p>
          <p class="text-xs text-gray-500">${beat.duration}</p>
        </div>
        <div class="absolute bottom-2 right-2 flex gap-3 opacity-0 group-hover:opacity-100 transition">
          <a href="#contact" class="text-gray-300 hover:text-white mail-link" data-index="${index}"><i class="fas fa-envelope"></i></a>
          <button class="text-green-500 hover:text-green-600 whatsapp-btn" data-index="${index}">
            <i class="fab fa-whatsapp"></i>
          </button>
        </div>
        <audio src="${beat.url}" preload="metadata" class="card-audio hidden"></audio>
      `;
      scrollRow.appendChild(card);
    });

    container.appendChild(scrollRow);
    initPlayer(filtered);
  }

  // --- Filter + Search events ---
  categoryFilter.addEventListener('change', () => {
    renderBeats(categoryFilter.value, searchInput.value.trim());
  });

  searchInput.addEventListener('input', () => {
    renderBeats(categoryFilter.value, searchInput.value.trim());
  });

  // --- Initial render ---
  renderBeats();
}

// --- Sticky Filter Bar on Scroll ---
window.addEventListener('scroll', () => {
  const filterBar = document.getElementById('filterBar');
  if (window.scrollY > 20) {
    filterBar.classList.add('bg-gray-900/90', 'backdrop-blur-md', 'shadow-lg');
  } else {
    filterBar.classList.remove('bg-gray-900/90', 'backdrop-blur-md', 'shadow-lg');
  }
});

// Modal markup (append once if not present)
if (!document.getElementById('whatsappModal')) {
  const modal = document.createElement('div');
  modal.id = 'whatsappModal';
  modal.className = 'fixed inset-0 bg-black/60 flex items-center justify-center z-50 hidden';
  modal.innerHTML = `
    <div class="bg-gray-900 rounded-lg p-6 w-full max-w-sm text-white">
      <h2 class="text-lg font-bold mb-2">Send Beat Details via WhatsApp</h2>
      <form id="whatsappForm" class="space-y-3">
        <input type="text" id="userName" class="w-full p-2 rounded bg-gray-800 text-white" placeholder="Your Name" required>
        <input type="text" id="userWhatsapp" class="w-full p-2 rounded bg-gray-800 text-white" placeholder="Your WhatsApp Number" required>
        <input type="email" id="userEmail" class="w-full p-2 rounded bg-gray-800 text-white" placeholder="Your Email (optional)">
        <button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded">Send to WhatsApp</button>
      </form>
      <button id="closeModal" class="mt-4 w-full bg-gray-700 hover:bg-gray-600 py-2 rounded">Cancel</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function initPlayer(filteredBeats) {
  const playButtons = document.querySelectorAll('.play-btn');
  const audios = document.querySelectorAll('.card-audio');
  const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
  const mailLinks = document.querySelectorAll('.mail-link');
  const modal = document.getElementById('whatsappModal');
  const form = document.getElementById('whatsappForm');
  const closeModal = document.getElementById('closeModal');
  let selectedBeat = null;

  playButtons.forEach((btn, i) => {
    const audio = audios[i];
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      audios.forEach((a, j) => {
        if (j !== i) {
          a.pause();
          playButtons[j].querySelector('i').classList.replace('fa-pause', 'fa-play');
        }
      });
      const playIcon = btn.querySelector('i');
      if (audio.paused) {
        audio.play();
        playIcon.classList.replace('fa-play', 'fa-pause');
      } else {
        audio.pause();
        playIcon.classList.replace('fa-pause', 'fa-play');
      }
    });
    audio.addEventListener('ended', () => {
      btn.querySelector('i').classList.replace('fa-pause', 'fa-play');
    });
  });

  whatsappButtons.forEach((btn, i) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedBeat = i;
      modal.classList.remove('hidden');
    });
  });

  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    form.reset();
  });

  form.onsubmit = function (e) {
    e.preventDefault();
    if (selectedBeat === null) return;
    const beat = filteredBeats[selectedBeat];
    const userName = document.getElementById('userName').value.trim();
    const userWhatsapp = document.getElementById('userWhatsapp').value.trim();
    const userEmail = document.getElementById('userEmail').value.trim();
    let message = `🎶 *Beat Inquiry*%0A%0A`;
    message += `*Title:* ${beat.title}%0A`;
    message += `*Genre:* ${beat.genre}%0A`;
    message += `*BPM:* ${beat.bpm}%0A`;
    message += `*Preview:* ${beat.url}%0A%0A`;
    message += `👤 *User Info*%0A`;
    message += `Name: ${userName}%0A`;
    message += `WhatsApp: ${userWhatsapp}`;
    if (userEmail) message += `%0AEmail: ${userEmail}`;
    const yourWhatsapp = '2347034625362';
    const waUrl = `https://wa.me/${yourWhatsapp}?text=${message}`;
    window.open(waUrl, '_blank');
    modal.classList.add('hidden');
    form.reset();
  };

  mailLinks.forEach((link, i) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // Scroll to contact section
      const contactSection = document.getElementById('contact');
      if (contactSection && typeof contactSection.scrollIntoView === 'function') {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#contact';
      }
      // Set textarea value
      const textarea = document.getElementById('contactMessage');
      if (textarea) {
        const beat = filteredBeats[i];
        textarea.value = `Hello 👋, I'm interested in licensing this beat:\n\n🎵 *${beat.title}*\nGenre: ${beat.genre}\nBPM: ${beat.bpm}\nDuration: ${beat.duration}\nPreview: ${beat.url}\n\nPlease let me know the pricing and terms.\n\nBest regards`;
        textarea.focus();
      }
    });
  });
}

// --- Initial load ---
loadBeats();

// --- Scroll progress indicator ---
const beatList = document.getElementById('beatList');
const scrollIndicator = document.getElementById('scrollIndicator');

if (beatList && scrollIndicator) {
  beatList.addEventListener('scroll', () => {
    const scrollWidth = beatList.scrollWidth - beatList.clientWidth;
    const scrollLeft = beatList.scrollLeft;
    const progress = (scrollLeft / scrollWidth) * 100;
    scrollIndicator.style.width = `${progress}%`;
  });
}

mailLinks.forEach((link, i) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    const textarea = document.getElementById('contactMessage');
    const beat = filteredBeats[i];

    if (!textarea) return;

    // Fill textarea with beat info
    textarea.value = `Hello 👋, I'm interested in this beat:\n\n🎵 *${beat.title}*\nGenre: ${beat.genre}\nBPM: ${beat.bpm}\nDuration: ${beat.duration}\nPreview: ${beat.url}\n\nPlease let me know the pricing and terms.\n\nBest regards,\n[Your Name]`;

    // Check if contact section is visible
    const rect = contactSection.getBoundingClientRect();
    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

    if (!isVisible && typeof contactSection.scrollIntoView === 'function') {
      // Smooth scroll if not in view
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        textarea.focus();
        textarea.classList.add('highlight-shake');
        setTimeout(() => textarea.classList.remove('highlight-shake'), 800);
      }, 700);
    } else {
      // Already visible → just highlight & shake
      textarea.focus();
      textarea.classList.add('highlight-shake');
      setTimeout(() => textarea.classList.remove('highlight-shake'), 800);
    }
  });
});

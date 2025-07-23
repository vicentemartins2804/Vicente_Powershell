const input = document.getElementById('input');
const history = document.getElementById('history');

let soundOn = false;
let commandHistory = [];
let historyIndex = -1;

const audio = new Audio();

const tracks = {
  "Travis Scott - 90210": "assets/musics/Travis Scott - 90210.mp3",
  "Kanye West - Violent Crimes": "assets/musics/Kanye West - Violent Crimes.mp3",
  "Kendrick Lamar - Not Like Us": "assets/musics/Kendrick Lamar - Not Like Us.mp3"
};

const commands = {
  help: () => 'Available commands:\n[ clear | social | about | work | copyright | contact | theme | sound | dino | exit ]',
  dino: () => 'Chrome T-Rex Game\n\n -> "hide dino" to hide the game\n -> "show dino" to show the game\n\nClick to start\nTo Jump press "w", "UpArrow" or "Space"',
  about: () => 'Vicente Martins\n20 years old\nPortuguese\nComputer Engineering student at ISEP',
  work: () => 'Installing project data...\n[■■■■■■■■■■■■■■■■■■■■■■■] 100% - Done.\nNo projects yet',
  contact: () => 'Email: vicente.martins@outlook.com',
  copyright: () => '© 2025 Vicente. All rights reserved.',
  social: () => 'GitHub: github.com/vicentemartins2804\nLinkedIn: linkedin.com/in/vicentemartins28\nInstagram: @vicente.martins28\n\nDo "cd ..." to open the profiles.',
  theme: (arg) => {
    const themes = {
      powershell: { background: "#012456", color: "#FFFFFF", command: "#00BCF2" },
      cmd: { background: "#000000", color: "#FFFFFF", command: "#00FF00" }
    };
    if (!arg) return 'Available themes:\n[ powershell | cmd ]\nUse "theme THEME_NAME" to apply.';
    const selected = themes[arg.toLowerCase()];
    if (!selected) return `Theme "${arg}" not found. Try: powershell, cmd.`;

    document.body.style.backgroundColor = selected.background;
    document.body.style.color = selected.color;
    const style = document.createElement('style');
    style.innerHTML = `.command { color: ${selected.command}; }`;
    document.head.appendChild(style);
    return `Theme "${arg}" applied.`;
  },
  sound: () => {
    return "Available commands:\n -> 'ls musics' - to view the songs\n -> 'play <name>' - to play a song by name\n -> 'volume <amount>' - to set the volume of the song\n -> 'resume' - to resume playback\n -> 'pause' - to pause playback\n -> 'stop' - to stop playback";
  },
  exit: () => {
    document.getElementById('terminal').innerHTML = '<div class="output">Session terminated. Thank you for visiting!</div>';
    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    return '';
  },
  clear: () => {
    history.innerHTML = '';
    return '';
  },
  "cd github": () => {
    window.open("https://github.com/vicentemartins2804", "_blank");
    return "Opening GitHub profile...";
  },
  "cd linkedin": () => {
    window.open("https://linkedin.com/in/vicentemartins28", "_blank");
    return "Opening linkedIn profile...";
  },
  "cd instagram": () => {
    window.open("https://www.instagram.com/vicente.martins28/", "_blank");
    return "Opening Instagram profile...";
  },
  play: (arg) => {
    if (!arg) return 'Usage: play [keyword]';

    const keyword = arg.toLowerCase();
    const foundKey = Object.keys(tracks).find(title => title.toLowerCase().includes(keyword));

    if (!foundKey) return `No track found for keyword "${arg}".`;

    audio.pause();
    audio.src = tracks[foundKey];
    audio.play();
    return `Now playing "${foundKey}"...`;
  },
  pause: () => {
    audio.pause();
    return "Music paused.";
  },
  resume: () => {
    if (audio.src) {
      audio.play();
      return "Music resumed.";
    }
    return "No track is currently loaded.";
  },
  stop: () => {
    audio.pause();
    audio.currentTime = 0;
    return "Music stopped.";
  },
  volume: (arg) => {
    const value = parseInt(arg);
    if (isNaN(value) || value < 0 || value > 100) {
      return "Usage: volume [0-100]";
    }

    audio.volume = value / 100;

    const totalBars = 20;
    const filledBars = Math.round((value / 100) * totalBars);
    const emptyBars = totalBars - filledBars;

    const bar = "[" + "■".repeat(filledBars) + " ".repeat(emptyBars) + `] ${value}%`;

    return `Volume set to:\n${bar}`;
  },
  ls: (arg) => {
    if (arg?.toLowerCase() === "musics") {
      const titles = Object.keys(tracks);
      if (titles.length === 0) return "No tracks available.";
      return "Available tracks:\n" + titles.map((t, i) => `  ${i + 1}. ${t}`).join("\n");
    }
    return 'Usage: ls musics';
  },
  "show dino": () => {
    const container = document.getElementById('container');
    container.style.display = 'block';
    return "Dino visible.";
  },
  "hide dino": () => {
    const container = document.getElementById('container');
    container.style.display = 'none';
    return "Dino hidden.";
  }
};


function typeOutput(text, container) {
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      container.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    if (cmd) {
      commandHistory.push(cmd);
      historyIndex = commandHistory.length;
      const wrapper = document.createElement('div');
      wrapper.classList.add('output');
      wrapper.innerHTML = `<span class="command">$ ${cmd}</span>\n`;
      const outputText = document.createElement('div');
      wrapper.appendChild(outputText);
      history.appendChild(wrapper);
      let [baseCmd, ...args] = cmd.split(" ");
      let fullCmd = cmd.toLowerCase();

      let result =
        commands[fullCmd]?.() ||
        commands[baseCmd]?.(args.join(" ")) ||
        'Command not found.';

      if (cmd === 'clear' || cmd === 'exit') {
        commands[cmd]();
        input.value = '';
        return;
      }
      typeOutput(result, outputText);
    }
    input.value = '';
    window.scrollTo(0, document.body.scrollHeight);
  } else if (e.key === 'ArrowUp') {
    if (historyIndex > 0) {
      historyIndex--;
      input.value = commandHistory[historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      input.value = commandHistory[historyIndex];
    } else {
      input.value = '';
    }
  }
});

// Jogo

let container = document.querySelector('#container');
let dino = document.querySelector('#dino');
let block = document.querySelector('#block');
let road = document.querySelector('#road');
let cloud = document.querySelector('#cloud');
let score = document.querySelector('#score');
let gameOver = document.querySelector('#gameOver');
let controls = document.querySelector('#controls');

// Counter and CSS animations

let interval = null;
let playerScore = 0;
const scoreCounter = () => {
    playerScore++;
    score.innerHTML = `Score: <b>${playerScore}</b>`
}

container.addEventListener('click', () => {
  if (block.classList.contains('blockActive')) return; // já está a correr

  gameOver.style.display = 'none';
  block.classList.add('blockActive');
  road.firstElementChild.style.animation = 'animateRoad 1s linear infinite';
  cloud.firstElementChild.style.animation = 'animateCloud 20s linear infinite';
  controls.style.display = 'none';

  playerScore = 0;
  clearInterval(interval); // caso tenha ficado ativo
  interval = setInterval(scoreCounter, 100);
});


// Dinosaur jump

window.addEventListener('keydown', (event) => {
  if (
    event.code === 'ArrowUp' ||
    event.code === 'KeyW' ||
    event.code === 'Space'
  ) {
    if (!dino.classList.contains('dinoActive')) {
      dino.classList.add('dinoActive');

      setTimeout(() => {
        dino.classList.remove('dinoActive');
      }, 500);
    }
  }
});


// Game Over screen

let result = setInterval(() => {
    let dinoBottom = parseInt(getComputedStyle(dino).getPropertyValue('bottom'));
    /* console.log('Dino Bottom: ' + dinoBottom); */

    let blockLeft = parseInt(getComputedStyle(block).getPropertyValue('left'));
    /* console.log('Block Left: ' + blockLeft); */

    if(dinoBottom <= 100 && blockLeft >= 20 && blockLeft <= 65) {
        gameOver.innerHTML = `Game Over <p>You scored ${playerScore} points.</p>`;
        gameOver.style.display = 'block';
        block.classList.remove('blockActive')
        road.firstElementChild.style.animation = 'none';
        cloud.firstElementChild.style.animation = 'none';

        clearInterval(interval);
        playerScore = 0;
    }
}, 10);




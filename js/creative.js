// ---- Creative Extras JS ----

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initMatrixRain();
    initThemeSwitcher();
    initKonamiCode();
    initTiltEffect();
    initGlitchText();
    initTerminal();
    initSynthPad();
});

// Step 1: Konami Code
function initKonamiCode() {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let index = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === code[index]) {
            index++;
            if (index === code.length) {
                toggleDevMode();
                index = 0;
            }
        } else {
            index = 0;
        }
    });
}

function toggleDevMode() {
    document.body.classList.toggle('dev-mode');
    alert('DEV MODE ACTIVATED. REALITY INVERTED.');
}

// Step 2: 3D Tilt Effect
function initTiltEffect() {
    const cards = document.querySelectorAll('.card, .video-card');
    cards.forEach(card => {
        card.classList.add('tilt-card');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// Step 4: Custom Cursor
function initCustomCursor() {
    // Create elements
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const outline = document.createElement('div');
    outline.className = 'cursor-outline';
    document.body.appendChild(dot);
    document.body.appendChild(outline);

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;

        // Smooth follow
        outline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effect
    const clickables = document.querySelectorAll('a, button, input, textarea, .card');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}

// Step 5: Matrix Rain
function initMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const rainDrops = [];

    for(let i=0; i<columns; i++) {
        rainDrops[i] = 1;
    }

    const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for(let i=0; i<rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i*fontSize, rainDrops[i]*fontSize);

            if(rainDrops[i]*fontSize > canvas.height && Math.random() > 0.975){
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };

    setInterval(draw, 30);

    // Default to off, user can toggle
}

// Step 7: Glitch Text Scramble
function initGlitchText() {
    const elements = document.querySelectorAll('h1, h2, h3, .nav a');
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

    elements.forEach(el => {
        el.dataset.value = el.innerText;

        el.addEventListener('mouseover', event => {
            let iteration = 0;
            let interval = setInterval(() => {
                event.target.innerText = event.target.innerText
                    .split("")
                    .map((letter, index) => {
                        if(index < iteration) {
                            return event.target.dataset.value[index];
                        }
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if(iteration >= event.target.dataset.value.length){
                    clearInterval(interval);
                }

                iteration += 1/3;
            }, 30);
        });
    });
}

// Step 8: Theme Switcher
function initThemeSwitcher() {
    const switcher = document.createElement('div');
    switcher.id = 'theme-switcher';
    switcher.innerHTML = `
        <button class="theme-btn" onclick="setTheme('rave')" title="Rave Mode">🟣</button>
        <button class="theme-btn" onclick="setTheme('matrix')" title="Matrix Mode">🟢</button>
        <button class="theme-btn" onclick="setTheme('clean')" title="Clean Mode">⚪</button>
    `;
    document.body.appendChild(switcher);
}

window.setTheme = function(mode) {
    document.body.className = ''; // Reset
    if (mode === 'matrix') {
        document.body.classList.add('matrix-mode');
    } else if (mode === 'clean') {
        // Clean mode overrides some CSS vars via style attribute
        document.documentElement.style.setProperty('--bg', '#ffffff');
        document.documentElement.style.setProperty('--fg', '#000000');
        document.documentElement.style.setProperty('--card', '#f0f0f0');
        document.documentElement.style.setProperty('--accent', '#0000ff');
        document.documentElement.style.setProperty('--accent-2', '#ff0000');
    } else {
        // Rave/Default reset
        document.documentElement.removeAttribute('style');
    }
}

// Step 9: Interactive Synth Pad
function initSynthPad() {
    // Only if element exists (maybe add it to footer or specific page)
    // For now, let's create a hidden one that shows up or just a function
    // Let's inject it into the footer for fun
    const footer = document.querySelector('footer .wrap');
    if(!footer) return;

    const div = document.createElement('div');
    div.id = 'synth-pad';
    div.style.display = 'none'; // Hidden by default, maybe toggle with command?

    for(let i=0; i<8; i++) {
        const key = document.createElement('div');
        key.className = 'synth-key';
        key.dataset.note = 200 + (i * 50);
        key.addEventListener('mousedown', () => playNote(key.dataset.note));
        div.appendChild(key);
    }

    // Add toggle to footer
    const toggle = document.createElement('button');
    toggle.textContent = '🎹 SYNTH';
    toggle.className = 'cta outline';
    toggle.style.fontSize = '0.7rem';
    toggle.style.marginTop = '10px';
    toggle.onclick = () => {
        div.style.display = div.style.display === 'none' ? 'grid' : 'none';
    };

    footer.appendChild(toggle);
    footer.appendChild(div);
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playNote(freq) {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
    osc.stop(audioCtx.currentTime + 0.5);
}

// Step 10: Terminal Command Line
function initTerminal() {
    const input = document.getElementById('terminal-input');
    if (!input) return;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            input.value = '';
            handleCommand(cmd);
        }
    });
}

function handleCommand(cmd) {
    const term = document.querySelector('.terminal');
    const output = document.createElement('div');
    output.className = 'term-line';
    output.style.color = 'var(--muted)';
    output.textContent = `> ${cmd}`;
    term.insertBefore(output, term.lastElementChild);

    let response = '';
    switch(cmd) {
        case 'help':
            response = 'COMMANDS: help, about, clear, matrix, rave, slop, date, whoami';
            break;
        case 'about':
            response = 'USTNIK_2.0 is a digital playground for AI experiments.';
            break;
        case 'clear':
            // Remove all previous lines
            document.querySelectorAll('.terminal .term-line:not(:first-child)').forEach(el => el.remove());
            return; // Don't print response
        case 'matrix':
            setTheme('matrix');
            response = 'ENTERING THE MATRIX...';
            break;
        case 'rave':
            setTheme('rave');
            response = 'PARTY MODE ENGAGED.';
            break;
        case 'slop':
            response = generateAISlop();
            break;
        case 'date':
            response = new Date().toString();
            break;
        case 'whoami':
            response = 'guest@ustnik-net';
            break;
        default:
            response = `Command not found: ${cmd}`;
    }

    const respLine = document.createElement('div');
    respLine.className = 'term-line';
    respLine.style.color = 'var(--accent-2)';
    respLine.textContent = response;
    term.insertBefore(respLine, term.lastElementChild);
}

// Step 6: AI Slop Generator
function generateAISlop() {
    const words = ['cyber', 'neural', 'flux', 'quantum', 'synapse', 'void', 'echo', 'glitch', 'data', 'entropy', 'system', 'kernel', 'daemon'];
    let slop = '';
    for(let i=0; i<10; i++) {
        slop += words[Math.floor(Math.random() * words.length)] + ' ';
    }
    return slop.trim() + "... CRITICAL FAILURE.";
}

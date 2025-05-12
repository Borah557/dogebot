document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;

    // --- Basic Telegram WebApp setup ---
    tg.expand(); // Expand the webapp to full height
    tg.MainButton.hide(); // We'll use buttons inside the webview

    // --- DOM Elements ---
    const balanceElement = document.getElementById('doge-balance');
    const rateElement = document.getElementById('mining-rate');
    const startStopButton = document.getElementById('start-stop-button');
    const statusText = document.getElementById('status-text');
    const miningAnimation = document.getElementById('mining-animation');
    const userGreeting = document.getElementById('user-greeting');
    // const upgradeButton = document.getElementById('upgrade-button'); // Uncomment if using upgrade
    // const closeButton = document.getElementById('close-button'); // Uncomment if using close

    // --- Game State (using localStorage for simple persistence) ---
    let dogeBalance = parseFloat(localStorage.getItem('dogeBalance') || '0.0');
    let miningRatePerSecond = parseFloat(localStorage.getItem('miningRate') || '0.00000100'); // Initial rate
    let isMining = false;
    let miningInterval = null;

    // --- Initialization ---
    function initializeApp() {
        // Display initial values
        updateDisplay();

        // Personalize greeting if user data is available
        if (tg.initDataUnsafe?.user?.first_name) {
            userGreeting.textContent = `Welcome, ${tg.initDataUnsafe.user.first_name}! Much wow.`;
        }

        // Restore mining state if app was closed while mining (optional)
        // Note: This won't mine while the app is closed, just restarts visually
        // if (localStorage.getItem('isMining') === 'true') {
        //     startMining();
        // }

        console.log("DogeMiner Sim Initialized");
        console.log("Telegram User Data (unsafe):", tg.initDataUnsafe);
    }

    // --- Core Mining Simulation ---
    function mine() {
        if (!isMining) return;
        dogeBalance += miningRatePerSecond;
        updateDisplay();
        saveState(); // Save state periodically
    }

    function startMining() {
        if (isMining) return;
        isMining = true;
        statusText.textContent = 'Status: Mining... Much speed!';
        startStopButton.textContent = 'Stop Mining';
        startStopButton.classList.add('mining'); // Optional: style button differently
        miningAnimation.classList.add('mining');
        miningAnimation.classList.remove('idle');
        miningInterval = setInterval(mine, 1000); // Update every second
        localStorage.setItem('isMining', 'true'); // Remember state
        console.log('Mining started');
    }

    function stopMining() {
        if (!isMining) return;
        isMining = false;
        statusText.textContent = 'Status: Idle. Very pause.';
        startStopButton.textContent = 'Start Mining';
        startStopButton.classList.remove('mining');
        miningAnimation.classList.remove('mining');
        miningAnimation.classList.add('idle');
        clearInterval(miningInterval);
        miningInterval = null;
        localStorage.setItem('isMining', 'false'); // Remember state
        saveState(); // Save final balance when stopped
        console.log('Mining stopped');
    }

    // --- Upgrades (Example) ---
    // function upgradeRig() {
    //     const upgradeCost = 10.0; // Example cost
    //     if (dogeBalance >= upgradeCost) {
    //         dogeBalance -= upgradeCost;
    //         miningRatePerSecond *= 1.5; // Increase rate by 50%
    //         alert(`Upgrade successful! New rate: ${miningRatePerSecond.toFixed(8)} Ð/sec`);
    //         updateDisplay();
    //         saveState();
    //     } else {
    //         alert(`Not enough Doge! Need ${upgradeCost.toFixed(2)} Ð`);
    //     }
    // }

    // --- UI Update ---
    function updateDisplay() {
        balanceElement.textContent = dogeBalance.toFixed(8); // Show 8 decimal places
        rateElement.textContent = miningRatePerSecond.toFixed(8);
    }

    // --- Persistence ---
    function saveState() {
        localStorage.setItem('dogeBalance', dogeBalance.toString());
        localStorage.setItem('miningRate', miningRatePerSecond.toString());
        // 'isMining' state is saved in start/stop functions
    }

    // --- Event Listeners ---
    startStopButton.addEventListener('click', () => {
        if (isMining) {
            stopMining();
        } else {
            startMining();
        }
    });

    // Uncomment if using upgrade button
    // upgradeButton.addEventListener('click', upgradeRig);

    // Uncomment if using close button
    // closeButton.addEventListener('click', () => {
    //     tg.close();
    // });

    // --- Start the app ---
    initializeApp();

    // Optional: Show confirmation on close (if main button is used or via API)
    // tg.onEvent('mainButtonClicked', function(){
    //     // Example: Send data back to bot
    //     tg.sendData(JSON.stringify({balance: dogeBalance, rate: miningRatePerSecond}));
    // });

    // tg.enableClosingConfirmation(); // Ask user before closing
});

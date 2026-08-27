/////////////////////////////////////////////
// SOURCE ATTRIBUTION                      //
//                                         //
// ./generator/dictionary.json             //
// https://github.com/dwyl/english-words   //
//                                         //
// function enforceMinMax()                //
// https://stackoverflow.com/a/59291891    //
//                                         //
/////////////////////////////////////////////

const usernameElement = document.getElementById("username");
const generateButton = document.getElementById("generate");
const copyButton = document.getElementById("copy");

const maxLengthInput = document.getElementById("length");
const numbersToggle = document.getElementById("numbers");
const underscoresToggle = document.getElementById("underscores");

const dictionary = await fetch("./generator/dictionary.json")
    .then(res => res.json());

const words = Object.keys(dictionary);

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(length) {
    let result = "";

    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }

    return result;
}

function log(message, data = null) {
    const timestamp = new Date().toLocaleTimeString();

    const prefix = `%c[ namebox ]%c ${timestamp} · ${message}`;

    if (data !== null) {
        console.info(
            prefix,
            "color: #888; font-weight: bold;",
            "color: inherit;",
            data
        );
    } else {
        console.info(
            prefix,
            "color: #888; font-weight: bold;",
            "color: inherit;"
        );
    }
}

function enforceMinMax(el) {
    if (el.value !== "") {
        if (parseInt(el.value) < parseInt(el.min)) {
            el.value = el.min;
        }

        if (parseInt(el.value) > parseInt(el.max)) {
            el.value = el.max;
        }
    }
}

function generateUsername() {
    let maxLength = parseInt(maxLengthInput.value);

    if (isNaN(maxLength)) {
        maxLength = 12;
    }

    const useNumbers = numbersToggle.checked;
    const useUnderscores = underscoresToggle.checked;

    const word1 = randomItem(words);
    const word2 = randomItem(words);

    let username = word1;

    if (useUnderscores) {
        username += "_";
    }

    username += word2;

    if (useNumbers) {
        if (useUnderscores) {
            username += "_";
        }

        username += randomNumber(
            Math.floor(Math.random() * 4) + 3
        );
    }

    username = username.slice(0, maxLength);

    if (username.endsWith("_")) {
        username = username.slice(0, -1);
    }

    usernameElement.textContent = username;
    usernameElement.style.color = "#fff";

    log("generated username", {
        username,
        maxLength,
        numbers: useNumbers,
        underscores: useUnderscores
    });
}

async function copyUsername() {
    const username = usernameElement.textContent;

    if (!username) {
        log("copy skipped · no username available");
        return;
    }

    try {
        await navigator.clipboard.writeText(username);

        log("copied username", {
            username
        });

        const oldText = copyButton.textContent;

        copyButton.textContent = "copied";

        setTimeout(() => {
            copyButton.textContent = oldText;
        }, 1000);

    } catch (error) {
        console.error("[ namebox ] · failed to copy username", error);
    }
}

generateButton.addEventListener("click", generateUsername);

copyButton.addEventListener("click", copyUsername);

maxLengthInput.addEventListener("input", () => {
    enforceMinMax(maxLengthInput);

    log("maxLength changed", {
        value: maxLengthInput.value
    });

    generateUsername();
});

numbersToggle.addEventListener("change", () => {
    log("numbers toggled", {
        enabled: numbersToggle.checked
    });

    generateUsername();
});

underscoresToggle.addEventListener("change", () => {
    log("underscores toggled", {
        enabled: underscoresToggle.checked
    });

    generateUsername();
});

log("dictionary loaded", {
    words: words.length
});

log("ready");

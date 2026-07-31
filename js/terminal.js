import commands from "./commands.js";
import { openGallery, closeGallery } from "./gallery.js";
import { openProfile, closeProfile } from "./profile.js";

const input = document.getElementById("real-input");
const display = document.getElementById("terminal-text");
const output = document.getElementById("output");

let terminalLocked = false;
let pendingInputValue = "";

function isOverlayOpen() {
    const profileOverlay = document.getElementById("profile-overlay");
    const galleryOverlay = document.getElementById("gallery-overlay");
    return profileOverlay?.style.display === "flex" || galleryOverlay?.style.display === "flex";
}

function clearTerminalInput() {
    input.value = "";
    display.textContent = "";
    pendingInputValue = "";
}

function lockTerminal() {
    terminalLocked = true;
    input.disabled = true;
    input.style.opacity = "0.6";
}

function unlockTerminal() {
    terminalLocked = false;
    input.disabled = false;
    input.style.opacity = "1";
    clearTerminalInput();
    requestAnimationFrame(() => {
        input.focus({ preventScroll: true });
        const len = input.value.length;
        input.setSelectionRange(len, len);
    });
}

function scrollBottom() {
    output.parentElement.scrollTop = output.parentElement.scrollHeight;
}

function printLine(text = "") {
    const div = document.createElement("div");
    div.className = "line";
    div.textContent = text;
    output.appendChild(div);
    scrollBottom();
}

function printCommand(command) {

    const div = document.createElement("div");
    div.className = "line";

    div.innerHTML = `
        <span class="prompt">
            <span class="user">fuz</span>@<span class="host">terminal</span>:~$
        </span>
        <span class="typed-command">${command}</span>
    `;

    output.appendChild(div);
    scrollBottom();

}

function printLink(text, href) {
    const div = document.createElement("div");
    div.className = "line";

    div.innerHTML = `
        <a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>
    `;

    output.appendChild(div);
    scrollBottom();
}

function printHelpLine(name, description) {
    const div = document.createElement("div");
    div.className = "line";

    div.innerHTML = `
        <span class="command-name">${name}</span>
        <span class="command-description">${description}</span>
    `;

    output.appendChild(div);
}

function findCommand(name) {

    name = name.toLowerCase();

    if (commands[name])
        return commands[name];

    for (const key in commands) {

        const cmd = commands[key];

        if (
            cmd.aliases &&
            cmd.aliases.includes(name)
        ) {
            return cmd;
        }

    }

    return null;

}

function runCommand(command) {

    if (command === "") return;

    if (command === "clear") {

        output.innerHTML = "";
        return;

    }

    if (command === "help") {

        printLine("");
        printLine("Available commands:");
        printLine("");

for (const key in commands) {

    const cmd = commands[key];

    if (cmd.hidden)
        continue;

    printHelpLine(key, cmd.description);

}

        printHelpLine("help", "Show all commands");
        printHelpLine("clear", "Clear the terminal");

        printLine("");
        return;

    }

    const cmd = findCommand(command);

    if (!cmd) {

        printLine("");
        printLine(`Unknown command: ${command}`);
        printLine('Type "help" to see all commands.');
        printLine("");
        return;

    }

    printLine("");

    for (const item of cmd.output) {

        if (typeof item === "string") {

            printLine(item);

        } else {

            printLink(item.text, item.href);

        }

    }

    printLine("");

}

window.addEventListener("load", () => {

    input.focus({ preventScroll: true });

});

document.addEventListener("pointerdown", e => {

    if (terminalLocked) return;

    if (
        e.target.tagName === "A" ||
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA"
    ) return;

    requestAnimationFrame(() => input.focus());

});

input.addEventListener("blur", () => {

    if (terminalLocked) return;
    requestAnimationFrame(() => input.focus());

});

input.addEventListener("input", () => {

    pendingInputValue = input.value;
    display.textContent = pendingInputValue;

});

input.addEventListener("keydown", e => {

    if (terminalLocked) {
        e.preventDefault();
        return;
    }

    if (e.key !== "Enter")
        return;

    e.preventDefault();

    const command = input.value.trim();
    pendingInputValue = command;

    printCommand(command);

    if (isOverlayOpen()) {
        lockTerminal();
        return;
    }

    if (command === "gallery") {

printLine("");
printLine("Launching gallery.");

setTimeout(() => {
    printLine("Loading images...");
}, 200);

setTimeout(() => {
    printLine("Done.");
}, 1000);

setTimeout(() => {
    openGallery();
}, 1300);

    clearTerminalInput();

    return;
}

    runCommand(command);

    clearTerminalInput();

    if (command === "profile") {

    lockTerminal();

    printLine("");
    printLine("Connecting to Discord...");

    setTimeout(() => {

        printLine("Fetching profile...");

    }, 300);

    setTimeout(() => {

        printLine("Done.");
        openProfile();

    }, 800);

    clearTerminalInput();

    return;
}

});

const profileOverlay = document.getElementById("profile-overlay");
const galleryOverlay = document.getElementById("gallery-overlay");

function syncTerminalLock() {
    if (isOverlayOpen()) {
        lockTerminal();
    } else {
        unlockTerminal();
    }
}

const observer = new MutationObserver(() => {
    syncTerminalLock();
});

observer.observe(profileOverlay, { attributes: true, attributeFilter: ["style"] });
observer.observe(galleryOverlay, { attributes: true, attributeFilter: ["style"] });

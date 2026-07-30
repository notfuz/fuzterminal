import commands from "./commands.js";
import { openGallery } from "./gallery.js";

const input = document.getElementById("real-input");
const display = document.getElementById("terminal-text");
const output = document.getElementById("output");

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

    if (
        e.target.tagName === "A" ||
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA"
    ) return;

    requestAnimationFrame(() => input.focus());

});

input.addEventListener("blur", () => {

    requestAnimationFrame(() => input.focus());

});

input.addEventListener("input", () => {

    display.textContent = input.value;

});

input.addEventListener("keydown", e => {

    if (e.key !== "Enter")
        return;

    e.preventDefault();

    const command = input.value.trim();

    printCommand(command);

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

    input.value = "";
    display.textContent = "";

    return;
}

    runCommand(command);

    input.value = "";
    display.textContent = "";

});
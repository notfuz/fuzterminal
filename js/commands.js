export default {

    about: {
        aliases: ["info", "whoami", "aboutme"],
        description: "Learn more about me",
        hidden: false,
        output: [
            "Hey! I'm Fuz.",
            "Welcome to my website.",
            "I don't know what else to say here, so I'll just leave it at that."
        ]

    },

    socials: {
        aliases: ["social", "links"],
        description: "View my social links",
        hidden: false,
        output: [
            {
                text: "Discord Server",
                href: "https://discord.gg/kBeT6aRmEw"
            },
            {
                text: "GitHub Account",
                href: "https://github.com/notfuz"
            }
        ]

    },

    projects: {
        aliases: ["project", "myprojects"],
        description: "View my projects",
        hidden: false,
        output: [
            "Nothing here yet",
        ]

    },

    gallery: {
        aliases: ["photos", "images"],
        description: "Open photo gallery",
        hidden: false,
        output: []
    },

    profile: {
        aliases: ["profile", "discord", "myprofile"],
        description: "Show my discord profile",
        hidden: false,
        output: []
    },

    "matt": {
        aliases: ["mattsite"],
        description: "Matt's website!",
        hidden: false,
        output: [
            {
                text: "Matt's Site :3",
                href: "https://doves-place.nekoweb.org/"
            },
        ]
    }, 

    hostname: {
        description: "",
        hidden: true,
        aliases: [],
        output: [
            "GitHub"
        ]

    },

    fortune: {
        description: "",
        hidden: true,
        aliases: [],
        output: [
            "Achievement unlocked: Curiosity."
        ]
    },

    coffee: {
        description: "",
        hidden: true,
        aliases: [],
        output: [
            "Error:",
            "No coffee found.",
            "Try again tomorrow."
        ]
    },

    sudo: {
        description: "",
        hidden: true,
        aliases: [],
        output: [
            "Permission denied.",
            "nice try."
        ]
    },

    "sudo make me a sandwich": {
        description: "",
        hidden: true,
        aliases: [],
        output: [
            "Okay.",
            "🥪"
        ]
    },

    "rm -rf /": {
        description: "",
        hidden: true,
        aliases: [],
        output: [
            "Deleting website...",
            "0%",
            "Access denied.",
            "Nice try bud xD"
        ]
    },

    exit: {
        description: "",
        hidden: true,
        aliases: ["logout"],
        output: [
            "Logout failed.",
            "You're here forever."
        ]

    },

    hack: {
        description: "",
        hidden: true,
        aliases: [],
        output: [
            "Initializing Hollywood hacking sequence...",
            "Access denied."
        ]
    },

    hello: {
        description: "",
        hidden: true,
        aliases: ["hi"],
        output: [
            "Hello! 👋"
        ]
    },

    cd: {
        description: "",
        hidden: true,
        aliases: [],
        output: [
            "You wonder around for a bit...",
            "Nothing changed."
        ]
    },

    matrix: {
        description: "",
        hidden: true,
        aliases: [],
        output: [
            "Wake up, Neo...",
            "The Matrix has you...",
        ]
    },

    "42": {
        description: "",
        hidden: true,
        aliases: [],
        output: [
            "The answer is 42.",
            "But what is the question?"
        ]
    }, 
    
    secrets: {
        description: "",
        hidden: true,
        aliases: [],
        output: [
            "hostname",
            "fortune",
            "coffee",
            "sudo",
            "sudo make me a sandwich",
            "rm -rf /",
            "exit",
            "hack",
            "hello",
            "cd",
            "matrix",
            "42"
        ]
    },

};

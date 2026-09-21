const keys = {};
window.addEventListener("keydown", (event) => {
    keys[event.code] = true;
});
window.addEventListener("keyup", (event) => {
    keys[event.code] = false;
});

const gameData = {
    size: 64,
    gravity: -0.01,
    mapWidth: 5,
    mapHeight: 2
};

const mapData = [
    ".....",
    "#####"
];
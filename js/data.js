const keys = {};
window.addEventListener("keydown", (event) => {
    keys[event.code] = true;
});
window.addEventListener("keyup", (event) => {
    keys[event.code] = false;
});

const gameData = {
    size: 48,
    gravity: -0.01,
    mapWidth: 20,
    mapHeight: 10
};

const mapData = [
    "#..................#",
    "#..................#",
    "#..................#",
    "#..................#",
    "#..................#",
    "#..................#",
    "#..................#",
    "#..................#",
    "#..................#",
    "####################"
];
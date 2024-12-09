// GET URL PARAMETERS
const urlParams = new URLSearchParams (Window.location.search);
const username = urlParams.get ('username');
const avatar = urlParams.get ('avatar');

const avatarDescriptions = {
    "pngegg.png": "The shuttle - A carrier that takes you to space",
    "pngegg (1).png": "The Astronaut - A person in space",
    "pngegg (2).png": "The moon - A roundish planet that has no life",
    "pngegg (3).png": "Space Station - A comanding zone",
    "pngegg (4).png": "The robot - Your close by companion on a mission ",
    "pngegg (5).png": "The satalitte - A drone you see in space",
    "pngegg (6).png": "The planets - we have nine planets in the solar system",
    "pngegg (7).png": "The space Lander Module - an escape vehicle in case things get out of hand",
    "pngegg (8).png": "Telescope - See the planets from a distance",
   
};

const generateProfileContent = () => {
    if (!username || !avatar)
       `
            <h2 style="font-family: 'Bokor', cursive; color: red;"> Caution: You're missing a username or a selected avatar! </h2>
            <a href="index.html" style="font-family: 'Bokor', cursive;">Please return back to the profile Setup</a>
        `;

};

generateProfileContent();

let allBrawlers = [];
let currentClass = null; //current selected category KH

//fetch the brawlers KH
//ChatGPT helped me to fix the structure of my function, and remove some unnecessary elements. I had trouble reciving the data since it was stored in an array, ChatGPT helped me create a workaround.
//https://chatgpt.com/share/66fe1311-2780-800d-a6d3-30970315eb07
async function fetchBrawlers() {
  console.log("Fetching brawlers...");
  try {
    const response = await fetch("https://api.brawlify.com/v1/brawlers");
    console.log("Response received:", response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data received:", JSON.stringify(data, null, 2));

    if (data && data.list && Array.isArray(data.list)) {
      allBrawlers = data.list; //store the brawlers KH
      organizeBrawlersByClass(allBrawlers); //calls the organize function to sort the brawlers KH
    } else {
      console.error("Brawlers data not in expected format:", data);
    }
  } catch (error) {
    console.error("Error fetching brawlers:", error);
  }
}

//filter brawlers based on search KH
//ChatGPT provided me with a very good example of how I could approach sorting all the different Brawlers by class. I made some modifications to the provided code in order to debug, but ChatGPT's code was a good starting place.
//https://chatgpt.com/share/66fe1311-2780-800d-a6d3-30970315eb07
function filterBrawlers() {
  const searchTerm = document.getElementById("searchBar").value.toLowerCase();

  //always filter from allBrawlers, ignoring the selected class KH
  //after reciving feedback from class, I decided to fix the issue of the wrong category descriptions showing up when the search bar is used. I consulted ChatGPT on how to solve this issue
  //ChatGPT: "Store the Class and Description Data, Search Function, Update the Display"
  //https://chatgpt.com/share/66fe1311-2780-800d-a6d3-30970315eb07
  let filteredBrawlers = allBrawlers.filter((brawler) =>
    brawler.name.toLowerCase().includes(searchTerm)
  );

  //remove the active class from all category buttons KH
  document.querySelectorAll("#classButtonsDiv button").forEach((btn) => {
    btn.classList.remove("activeButton");
  });

  currentClass = null; //reset the current class since user is searching KH

  if (filteredBrawlers.length > 0) {
    //if there is at least 1 brawler found...
    const firstBrawler = filteredBrawlers[0]; //choose the first matching brawler KH
    const className = firstBrawler.class.name; //get the class of that brawler KH

    //update the category info
    document.getElementById("categoryInfo").style.display = "block";
    document.getElementById("categoryTitle").textContent = className;
    document.getElementById("categoryDescription").textContent =
      classDescriptions[className] || "No description available.";
  } else {
    //if there is no brawler found, hide the category info KH
    //ChatGPT helped me to edit this function to display no brawlers on initial load
    //https://chatgpt.com/share/66fe1311-2780-800d-a6d3-30970315eb07
    document.getElementById("categoryInfo").style.display = "none";
  }

  displayBrawlers(filteredBrawlers); //display the filtered brawlers KH
}

//sort the brawlers by class and display the buttons KH
function organizeBrawlersByClass(brawlers) {
  const classes = {};

  brawlers.forEach((brawler) => {
    const className = brawler.class.name;
    if (!classes[className]) {
      classes[className] = [];
    }
    classes[className].push(brawler);
  });

  displayClassButtons(Object.keys(classes));
}

//custom class descriptions (not from the API) KH
//at first, my custom class descriptions weren't showing up. ChatGPT helped me to debug the issue after some back and forth. I pasted my code and error messages I was recieving, and ChatGPT assisted in debugging accordingly.
//according to ChatGPT: "The issue likely stems from how the classDescriptions are being accessed. The code logic looks correct, but it's possible that the className in the button.onclick handler isn't matching the exact keys in the classDescriptions object."
//https://chatgpt.com/share/66fe1311-2780-800d-a6d3-30970315eb07
const classDescriptions = {
  Tank: "As the frontline protectors, Tanks have TONS of health, so they can take a hit or two! They are ideal for players who want to charge into close-combat battles.",
  //use quotes for this word KH
  //since "Damage Dealer" has a space in it, I had trouble accessing the Damage Dealer description from the API. After brining this issue to ChatGPt, it helped me resolve it.
  //https://chatgpt.com/share/66fe1311-2780-800d-a6d3-30970315eb07
  "Damage Dealer":
    "These Brawlers really bring the heat! They thrive on aggression, dealing high damage while maintaining solid health. Perfect for players who want to charge into battle and eliminate enemies quickly.",
  Support:
    "The unsung heroes of the team, support Brawlers are perfect for players who love to help their teammates or for those playing with their friends.",
  Assassin:
    "Assassins are the sneaky ninjas of the battlefield. Players who enjoy swift, strategic gameplay with love these Brawlers.",
  Controller:
    "Controllers are tactical fighters and focus on dominating the map. Best for players who enjoy controlling space and dictating the flow of battle. They can really stand their ground, and even take it too!",
  Marksman:
    "Marksmen rain pain from a distance! Best suited for players who value precision, timing, and prefer to engage from a distance.",
  Artillery:
    "These Brawlers can throw projectiles over obstacles, dishing out a deadly delivery! They suit players want to play strategically with their placement and want to hide behind obstacles.",
};

//get the description by name KH
function getClassDescription(apiName) {
  return classDescriptions[apiName] || "Description not found.";
}

//this function is only for filtering "Damage Dealer" and creating the button KH
const apiClassName = "Damage Dealer";
const description = getClassDescription(apiClassName);

function displayClassButtons(classNames) {
  const classButtonsDiv = document.getElementById("classButtonsDiv");
  classButtonsDiv.innerHTML = ""; //clear button area KH

  classNames.forEach((className) => {
    const button = document.createElement("button");
    button.textContent = className;
    button.classList.add("initialButton"); //add initial button style KH

    button.onclick = () => {
      //reset all buttons to inactive KH
      //ChatGPT provided me with these few lines of code to style the category buttons different when active and inactive
      //https://chatgpt.com/share/66fe1311-2780-800d-a6d3-30970315eb07
      document
        .querySelectorAll("#classButtonsDiv button")
        .forEach((btn) => btn.classList.remove("activeButton"));

      //make the clicked button active KH
      button.classList.add("activeButton");

      //previously, users could only search from the brawler category they selected. I wanted users to be able to search from ALL brawlers. ChatGPT helped me to update the code to accomodate for this feature.
      //https://chatgpt.com/share/66fe1311-2780-800d-a6d3-30970315eb07
      currentClass = className; //set the current class KH
      const filteredBrawlers = allBrawlers.filter(
        (brawler) => brawler.class.name === currentClass
      );

      //display category ttile and description KH
      document.getElementById("categoryInfo").style.display = "block";
      document.getElementById("categoryTitle").textContent = className;
      document.getElementById("categoryDescription").textContent =
        classDescriptions[className] || "No description available.";

      displayBrawlers(filteredBrawlers); //display brawlers of the selected class KH
    };

    classButtonsDiv.appendChild(button);
  });
}

//when loading in, hide brawlers and category info KH
const categoryInfo = document.getElementById("categoryInfo");
if (categoryInfo) {
  categoryInfo.style.display = "block";
} else {
  console.error("Element with ID 'categoryInfo' not found.");
}

//display brawlers KH
//ChatGPT provided me with some suggesstions and adjustments to make my code run smoother. I applied SOME of the suggesstions to my code. It also helped me with a starting point for this function, by providing some example code.
//https://chatgpt.com/share/66fe1311-2780-800d-a6d3-30970315eb07
//I had trouble accessing the Star Power and gadget information from the api. ChatGPT helped me to debug and provided steps to fix the issue.
function displayBrawlers(brawlers) {
  const brawlersDiv = document.getElementById("brawlersDiv");
  brawlersDiv.innerHTML = ""; //clear previous brawlers KH

  brawlers.forEach((brawler) => {
    const brawlerDiv = document.createElement("div");
    brawlerDiv.classList.add("brawler");

    //access class name KH
    const className = brawler.class.name;

    brawlerDiv.innerHTML = `
    <h3>${
      brawler.name
    } <span class="brawler-class">(${className})</span></h3> <!-- Add a span for the class name -->
    <p>${brawler.description || "No description available."}</p>
    <img src="${brawler.imageUrl}" alt="${brawler.name}" />
    <button class="showDetailsButton">Details</button>
    <div class="details hidden">
      <div class="starPowers-container">
        <h4>Star Powers:</h4>
        <ul class="starPowers">
          ${
            brawler.starPowers.length > 0
              ? brawler.starPowers
                  .map(
                    (starPower) => `
              <li>
                <p>${starPower.name}</p>
                <p>${starPower.description}</p>
                <img src="${starPower.imageUrl}" alt="${starPower.name}" />
              </li>
            `
                  )
                  .join("")
              : //ChatGPT suggessted that I handle cases where a brawler might not have any star powers or gadgets to avoid empty sections. Although I didn't experience that issue with empty sections, since ChatGPT provided me with the code, I decided to add it in, just in case!
                "<li>No Star Powers available.</li>"
          }
        </ul>
      </div>
      <div class="gadgets-container">
        <h4>Gadgets:</h4>
        <ul class="gadgets">
          ${
            brawler.gadgets.length > 0
              ? brawler.gadgets
                  .map(
                    (gadget) => `
              <li>
                <p>${gadget.name}</p>
                <p>${gadget.description}</p>
                <img src="${gadget.imageUrl}" alt="${gadget.name}" />
              </li>
            `
                  )
                  .join("")
              : "<li>No Gadgets available.</li>"
          }
        </ul>
      </div>
    </div>
`;

    //add click event listener to show/hide details KH
    //when my code was not working, I asked ChatGPT to help me debug it by pasting the error message from the console into the chat. ChatGPT gave me steps to debug the issue, step-by-step.
    //https://chatgpt.com/share/66fe1311-2780-800d-a6d3-30970315eb07
    const showDetailsButton = brawlerDiv.querySelector(".showDetailsButton");
    const detailsDiv = brawlerDiv.querySelector(".details");

    //button to toggle details KH
    showDetailsButton.addEventListener("click", () => {
      const isHidden =
        detailsDiv.style.display === "none" || !detailsDiv.style.display;
      detailsDiv.style.display = isHidden ? "block" : "none";
    });

    brawlersDiv.appendChild(brawlerDiv); //append brawlersDiv to main div KH
  });
}

//call the fetch brawler function when script loads KH
fetchBrawlers();

document.getElementById("searchBar").addEventListener("input", filterBrawlers);

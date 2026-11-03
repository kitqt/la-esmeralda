/* =========================================================
   La Esmeralda — menu data
   Edit prices, descriptions and photos here. menu.js builds
   the menu page from this file, so nothing else needs to change.

   Item fields:
     name, price (label on the photo), description, image
     badge    – optional ribbon on the photo
     note     – optional highlighted note under the description
     prices   – optional list always shown on the card (sizes, etc.)
     options  – optional groups shown in the "Choices & add-ons" dropdown
   Option items with a price show as a price list, items with a
   note show as a described list, and plain names show as chips.
   ========================================================= */

const OPTIONS = {
  breakfastMeats: [
    { name: "Bacon", price: "Extra $2.00" },
    { name: "Sausage", price: "Extra $1.50" },
    { name: "Chorizo", price: "Extra $1.50" },
    { name: "Ham", price: "Extra $1.50" },
    { name: "Spam", price: "Extra $2.00" },
  ],
  basicChoices: [
    { name: "Egg", price: "$0.75" },
    { name: "Cheese", price: "$0.75" },
    { name: "Beans", price: "$0.75" },
    { name: "Potatoes", price: "$0.75" },
    { name: "Jalapeños", price: "$0.75" },
    { name: "Tomatoes", price: "$0.75" },
    { name: "Onions", price: "$0.75" },
    { name: "Rice", price: "$0.75" },
    { name: "Sour Cream", price: "$0.50" },
    { name: "Guacamole", price: "$1.00" },
    { name: "Bacon Strips", price: "$2.00" },
  ],
  meats: [
    { name: "Carne Guisada", note: "Beef tips simmered in a savory gravy" },
    { name: "Barbacoa", note: "Tender, slow-cooked beef" },
    { name: "Asado", note: "Pork in a rich red chile sauce" },
    { name: "Desebrada", note: "Seasoned shredded beef" },
    { name: "Desebrada Verde", note: "Shredded beef in green chile salsa" },
    { name: "Estofado", note: "Hearty house stew" },
    { name: "Picadillo", note: "Seasoned ground beef with potatoes" },
    { name: "Chicharrón", note: "Pork cracklings simmered in salsa" },
  ],
  breakfastSides: [{ name: "Potatoes" }, { name: "Beans" }, { name: "Sausage" }, { name: "Bacon" }, { name: "Ham" }, { name: "Spam" }],
  lunchSides: [{ name: "Rice" }, { name: "Beans" }, { name: "Potatoes" }],
  tortillas: [{ name: "Homemade Flour" }, { name: "Homemade Corn" }],
  breakfastExtras: [
    { name: "Extra Egg", price: "$1.25" },
    { name: "Extra Meat Side", price: "$2.00" },
  ],
  lunchExtras: [{ name: "Extra Meat Side", price: "$2.00" }],
  takeHome: [
    { name: "Flour Tortillas", price: "$4.50" },
    { name: "Corn Tortillas", price: "$3.00" },
    { name: "Chips & Salsa (small bag)", price: "$4.50" },
    { name: "Chips & Salsa (large bag)", price: "$7.00" },
  ],
};

const group = (title, items, note) => ({ title, items, note });

const MENU = [
  /* ---------------- Breakfast ---------------- */
  {
    id: "breakfast",
    title: "Breakfast",
    kicker: "Desayuno",
    note: "Served until 1:00 PM or until supplies last.",
    items: [
      {
        name: "3 Item Breakfast Burrito",
        price: "from $6.00",
        badge: "Fan favorite",
        image: "images/menu/breakfast-burrito.jpg",
        description: "Your choice of breakfast meat plus two basic choices, rolled up in a warm homemade flour tortilla.",
        options: [
          group("Pick 1 breakfast meat", OPTIONS.breakfastMeats),
          group("Pick 2 basic choices", OPTIONS.basicChoices, "Want more? Add extra basic choices at the prices shown."),
        ],
      },
      {
        name: "No Meat 3 Item Burrito",
        price: "from $5.00",
        image: "images/menu/no-meat-burrito.jpg",
        description: "Build it your way with any three items of your liking from our basic choices.",
        options: [group("Pick 3 basic choices", OPTIONS.basicChoices)],
      },
      {
        name: "Migas Burrito",
        price: "from $5.00",
        image: "images/menu/migas-burrito.jpg",
        description: "Two eggs scrambled with fried corn tortilla, onion, jalapeño and tomato.",
        options: [
          group("What's inside", [{ name: "2 Eggs" }, { name: "Fried Corn Tortilla" }, { name: "Onion" }, { name: "Jalapeño" }, { name: "Tomato" }]),
          group("Add a breakfast meat", OPTIONS.breakfastMeats),
          group("Add basic choices", OPTIONS.basicChoices),
        ],
      },
      {
        name: "O/E Egg Burrito",
        price: "from $6.50",
        image: "images/menu/oe-egg-burrito.jpg",
        description: "Two over-easy eggs with two items of your liking from our basic choices.",
        options: [group("Pick 2 basic choices", OPTIONS.basicChoices), group("Add a breakfast meat", OPTIONS.breakfastMeats)],
      },
      {
        name: "Breakfast Plate",
        price: "from $11.99",
        image: "images/menu/breakfast-plate.jpg",
        description: "Two eggs with your choice of two sides and fresh tortillas.",
        options: [group("Pick 2 sides", OPTIONS.breakfastSides), group("Tortillas", OPTIONS.tortillas), group("Extras", OPTIONS.breakfastExtras)],
      },
      {
        name: "Huevos Rancheros",
        price: "from $12.99",
        image: "images/menu/huevos-rancheros.jpg",
        description: "Two eggs covered in our ranchero sauce, served with your choice of two sides and tortillas.",
        options: [group("Pick 2 sides", OPTIONS.breakfastSides), group("Tortillas", OPTIONS.tortillas), group("Extras", OPTIONS.breakfastExtras)],
      },
      {
        name: "Migas Plate",
        price: "from $11.99",
        image: "images/menu/migas-plate.jpg",
        description: "Two eggs scrambled with three fried corn tortillas, onion, jalapeño and tomato, plus two sides and tortillas.",
        options: [group("Pick 2 sides", OPTIONS.breakfastSides), group("Tortillas", OPTIONS.tortillas)],
      },
    ],
  },

  /* ---------------- Lunch ---------------- */
  {
    id: "lunch",
    title: "Lunch",
    kicker: "Comida",
    note: "Pick from eight house-made meats. Open any item to see them all.",
    items: [
      {
        name: "Meat Burrito",
        price: "from $6.00",
        image: "images/menu/meat-burrito.jpg",
        description: "Your choice of meat on our homemade flour tortilla.",
        note: "Meat burritos include the meat only. Add anything else from the basic choices.",
        options: [group("Pick your meat", OPTIONS.meats), group("Add basic choices", OPTIONS.basicChoices)],
      },
      {
        name: "Meat Plate",
        price: "from $13.99",
        image: "images/menu/meat-plate.jpg",
        description: "Your choice of meat with two sides of your choice and tortillas.",
        options: [
          group("Pick your meat", OPTIONS.meats),
          group("Pick 2 sides", OPTIONS.lunchSides),
          group("Tortillas", OPTIONS.tortillas),
          group("Extras", OPTIONS.lunchExtras),
        ],
      },
      {
        name: "Torta",
        price: "from $8.50",
        image: "images/menu/torta.jpg",
        description: "Homemade bread served with your choice of meat, lettuce, tomato, guacamole and mayo.",
        options: [
          group("Pick your meat", [...OPTIONS.meats, { name: "Jamón", note: "Ham, available on tortas only" }]),
          group("Comes with", [{ name: "Homemade Bread" }, { name: "Lettuce" }, { name: "Tomato" }, { name: "Guacamole" }, { name: "Mayo" }]),
        ],
      },
      {
        name: "Taco Plate",
        price: "from $10.99",
        image: "images/menu/taco-plate.jpg",
        description: "Three tacos with your choice of meat, two sides and the tortillas of your choice.",
        options: [
          group("Pick your meat", OPTIONS.meats),
          group("Pick 2 sides", OPTIONS.lunchSides),
          group("Tortillas", OPTIONS.tortillas),
          group("Extras", OPTIONS.lunchExtras),
        ],
      },
      {
        name: "Tacos",
        price: "$2.75 each",
        image: "images/menu/tacos.jpg",
        description: "Your choice of meat on our homemade corn tortillas. Order as many as you like.",
        options: [group("Pick your meat", OPTIONS.meats)],
      },
      {
        name: "Menudo",
        price: "Sm $15 · Lg $19",
        badge: "Fri & Sat only",
        image: "images/menu/menudo.jpg",
        description: "A hot bowl of menudo served with limes, onions and your choice of tortillas.",
        toggleLabel: "Sizes & extras",
        options: [
          group("Sizes", [
            { name: "Small", price: "$15.00" },
            { name: "Large", price: "$19.00" },
          ]),
          group("Served with", [{ name: "Limes" }, { name: "Onions" }]),
          group("Tortillas", OPTIONS.tortillas),
          group("Extras", [{ name: "Pan Tostado", price: "+$2.00" }]),
        ],
      },
    ],
  },

  /* ---------------- To-Go ---------------- */
  {
    id: "to-go",
    title: "To-Go",
    kicker: "Para llevar",
    note: "Small cups are 16 oz. Large cups are 32 oz.",
    items: [
      {
        name: "Barbacoa",
        price: "from $9.00",
        badge: "By the pound",
        image: "images/menu/barbacoa.jpg",
        description: "Tender barbacoa sold by the pound, enough to feed the whole family.",
        prices: [
          { name: "½ lb", price: "$9.00" },
          { name: "1 lb", price: "$17.00" },
        ],
        toggleLabel: "Make it a meal",
        options: [group("Add to your order", OPTIONS.takeHome)],
      },
      {
        name: "Asado",
        price: "from $15.00",
        image: "images/menu/asado.jpg",
        description: "Pork simmered in a rich red chile sauce, by the cup.",
        prices: [
          { name: "Small cup (16 oz)", price: "$15.00" },
          { name: "Large cup (32 oz)", price: "$30.00" },
        ],
        toggleLabel: "Make it a meal",
        options: [group("Add to your order", OPTIONS.takeHome)],
      },
      {
        name: "Carne Guisada",
        price: "from $17.00",
        image: "images/menu/carne-guisada.jpg",
        description: "Beef tips slow-simmered in a savory gravy, by the cup.",
        prices: [
          { name: "Small cup (16 oz)", price: "$17.00" },
          { name: "Large cup (32 oz)", price: "$35.00" },
        ],
        toggleLabel: "Make it a meal",
        options: [group("Add to your order", OPTIONS.takeHome)],
      },
      {
        name: "Desebrada Verde",
        price: "from $20.00",
        image: "images/menu/desebrada-verde.jpg",
        description: "Shredded beef in green chile salsa, by the cup.",
        prices: [
          { name: "Small cup (16 oz)", price: "$20.00" },
          { name: "Large cup (32 oz)", price: "$28.00" },
        ],
        toggleLabel: "Make it a meal",
        options: [group("Add to your order", OPTIONS.takeHome)],
      },
    ],
  },

  /* ---------------- Drinks & Extras ---------------- */
  {
    id: "drinks-extras",
    title: "Drinks & Extras",
    kicker: "Bebidas y más",
    note: "Fresh tortillas from our tortillería, by the pack.",
    items: [
      {
        name: "Bottle Drinks",
        price: "from $3.00",
        image: "images/menu/drinks.jpg",
        description: "Ice-cold bottled sodas, including Mexican favorites.",
        prices: [
          { name: "Bottle Drinks", price: "$3.00" },
          { name: "Mexican Bottle Drinks", price: "$4.00" },
        ],
      },
      {
        name: "Coffee, Juice & Tea",
        price: "from $1.50",
        image: "images/menu/coffee.jpg",
        description: "Hot coffee for the morning rush and cold drinks for the afternoon.",
        prices: [
          { name: "Coffee", price: "$1.50" },
          { name: "Orange / Apple Juice", price: "$3.00" },
          { name: "Limonada", price: "$4.50" },
          { name: "Sweet / Unsweet Tea", price: "$2.25" },
        ],
      },
      {
        name: "Chips & Salsa",
        price: "from $4.50",
        image: "images/menu/chips-salsa.jpg",
        description: "Crispy tortilla chips with salsa, bagged to go.",
        prices: [
          { name: "Small bag", price: "$4.50" },
          { name: "Large bag", price: "$7.00" },
        ],
      },
      {
        name: "Flour Tortillas",
        price: "$4.50",
        badge: "Homemade",
        image: "images/menu/flour-tortillas.jpg",
        description: "Our homemade flour tortillas, soft and warm, to take home.",
      },
      {
        name: "Corn Tortillas",
        price: "$3.00",
        badge: "Homemade",
        image: "images/menu/corn-tortillas.jpg",
        description: "Homemade corn tortillas, fresh from our tortillería.",
      },
    ],
  },
];

window.MENU = MENU;

/*
 * =============================================
 * NOTE - UTILISATION D'UN CHATBOT (Claude)
 * =============================================
 * J'ai utilisé un chatbot (Claude) pour m'aider à mettre en forme les commentaires
 * de ce fichier,le but étant de vous simplifier la lecture des commentaires.
 */


// =============================================
// URL du dataset hébergé sur le serveur EMU
// =============================================
// On stocke l'URL dans une variable const car elle ne changera jamais.
// Pour un autre dataset (shows, HR...), il suffirait de changer cette ligne.
const myUrl = "https://makerslab.em-lyon.com/dww/data/products.json";


// =============================================
// Fonction asynchrone pour récupérer les données
// =============================================
/*
 * NOTE CHATBOT - cette fonction m'a été expliquée par Claude.
 * Prompt : "Je ne comprends pas pourquoi on utilise async/await et try/catch
 *           pour récupérer des données. Peux-tu m'expliquer et me montrer un exemple ?"
 *
 * Ce que j'ai compris : fetch() est une opération qui prend du temps (attente réseau).
 * "async" dit au navigateur que cette fonction va travailler de manière asynchrone.
 * "await" met la fonction en pause jusqu'à ce qu'on reçoive la réponse, sans bloquer
 * le reste de la page. try/catch permet de gérer les erreurs proprement (ex: pas de
 * connexion, URL incorrecte) sans que le site plante.
 */
const getData = async (doStuff) => {
    try {
        // On envoie une requête et on attend la réponse
        const response = await fetch(myUrl);

        // Si la réponse n'est pas OK (ex: fichier introuvable), on génère une erreur
        // response.ok est un booléen : true si le code HTTP est entre 200 et 299
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        // On convertit la réponse en JSON et on attend que ce soit prêt
        // Sans cette étape, on aurait juste un objet "Response" brut, pas les vraies données
        const data = await response.json();

        // Une fois les données prêtes, on appelle la fonction doStuff avec les données
        // doStuff est un paramètre : c'est une fonction qu'on passe en argument (callback)
        doStuff(data);

    } catch (error) {
        console.error("Problème lors de la récupération des données :", error);
    }
};


// =============================================
// Fonction qui crée et affiche les cartes produits
// =============================================
/*
 * NOTE CHATBOT - structure des boucles imbriquées
 * Prompt : "Mon JSON n'est pas un tableau simple, les produits sont rangés par marque.
 *           Comment faire pour boucler sur tous les produits quand même ?"
 *
 * Erreur que j'aurais pu faire : en cours, on a vu data.forEach() sur un tableau plat.
 * Ici ça ne marchait pas directement car data est un objet avec une clé "brands" et
 * une clé "items". Il fallait d'abord boucler sur data.brands pour avoir les noms des
 * marques, puis utiliser data.items[brand] pour accéder aux produits de chaque marque.
 */
const displayCards = (data) => {

    // On cible le conteneur HTML où on va injecter les cartes
    // On utilise l'ID "cards-container" défini dans index.html
    const container = document.querySelector("#cards-container");

    // On boucle sur chaque marque du tableau data.brands
    // ["adidas", "asics", "converse", "jordan", "newbalance", "nike", "puma"]
    data.brands.forEach((brand) => {

        // Pour chaque marque, on récupère la liste de ses produits
        // data.items["nike"] renvoie par exemple un tableau de ~20 produits Nike
        const products = data.items[brand];

        // On boucle sur chaque produit de la marque
        // "product" représente un objet avec les clés : name, brand, price, image, gender, etc.
        products.forEach((product) => {

            // On crée le HTML de la carte avec un literal template (backticks)
            // Le $ { } permet d'injecter des variables JavaScript directement dans le HTML
            const card = `
                <div class="card">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="card-brand">${product.brand}</div>
                    <div class="card-name">${product.name}</div>
                    <div class="card-gender">${product.gender}</div>
                    <div class="card-price">${product.price} €</div>
                </div>
            `;

            // On ajoute la carte au conteneur (sans écraser les précédentes)
            // += est important : sans lui, chaque carte remplacerait la précédente
            container.innerHTML += card;
        });
    });
};


// =============================================
// Appel de la fonction principale
// =============================================
// On appelle getData en lui passant displayCards comme argument (callback).
// getData va récupérer les données, puis appeler displayCards avec ces données.
getData(displayCards);

// display all articles
const newsContainer = document.querySelector(".newsContainer");
const commentForm = `<form action="" class="commentForm">
<label for="comment">enter comment below</label>
<input type="textarea" name="comment">
<input type="submit">
</form>`
function fetchAndPrintData() {
	fetch("/api/data/articles")
		.then((data) => data.json())
		.then((json) => {
			json.reverse();
			json.forEach((article) => {
				console.log(article);
				const { created_at, description, link, title } = article;
				const utcDate = created_at;
				const localDate = new Date(utcDate);
				const date = localDate.toDateString();
				const time = localDate.toTimeString().split("-");
				const htmlToAppend = ` <li class="article">
        <p>posted on ${date} at ${time[0]}</p>
            <h2 class="newsTitle"> <a href="${link}" rel="noopener" target="_blank"> ${title} </a> </h2>
            <p class="description"> ${description} </p>
            ${commentForm}
          </li>`
				newsContainer.innerHTML += htmlToAppend;
			});
		});
}

// display articles according to search filter
const searchFunction = function (query) {
	fetch("/api/data/articles")
		.then((data) => data.json())
		.then((json) => {
			json.reverse();
			newsContainer.innerHTML = "";
			json.forEach((article) => {
				if (article.title.toLowerCase().includes(query) || article.description.toLowerCase().includes(query)) {
					const { created_at, description, link, title } = article;
					const utcDate = created_at;
					const localDate = new Date(utcDate);
					const date = localDate.toDateString();
					const time = localDate.toTimeString().split("-");
					const htmlToAppend = ` <li class="article">
        <p>posted on ${date} at ${time[0]}</p>
            <h2 class="newsTitle"> <a href="${link}" rel="noopener" target="_blank"> ${title} </a> </h2>
            <p class="description"> ${description} </p>
          </li>
          ${commentForm}`;
					newsContainer.innerHTML += htmlToAppend;
				}
			});
		});
};


const searchForm = document.querySelector(".searchForm");
searchForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const query = e.target.search.value;
	searchFunction(query);
});

const clearFilterButton = document.querySelector(".clearFilter");
clearFilterButton.addEventListener("click", () => {
	searchForm.reset();
	newsContainer.innerHTML = "";
	fetchAndPrintData();
});

// target for article form reset
const postArticleForm = document.querySelector(".postArticleForm");

// Submits the form and refreshes the data
function submitForm() {
	event.preventDefault();

	const title = event.target.title.value;
	const description = event.target.description.value;
	const link = event.target.link.value;

	fetch("/api/data/articles", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ title, description, link }),
	}).then(() => {
		// console.log(JSON.stringify({ title, description, link }));
		fetchAndPrintData();
		postArticleForm.reset();
	});
}

// run this on load
fetchAndPrintData();
postArticleForm.reset();

//user auth

//auth constants
const signupForm = document.querySelector("#signupForm");
const signupLink = document.querySelector("#signupLink");
const loginForm = document.querySelector("#loginForm");
const loginLink = document.querySelector("#loginLink");
const logoutLink = document.querySelector("#logout");

// target for form toggle
const modalSignup = document.querySelector(".modalSignup");
const modalLogin = document.querySelector(".modalLogin");

// listen for auth status changes
auth.onAuthStateChanged((user) => {
	// determine which auth links to display in the nav
	if (user) {
		loginLink.closest("li").style.display = "none";
		signupLink.closest("li").style.display = "none";
		logoutLink.closest("li").style.display = "inline";
	} else {
		logoutLink.closest("li").style.display = "none";
		loginLink.closest("li").style.display = "inline";
		signupLink.closest("li").style.display = "inline";
	}
});

// sign up show modal
signupLink.addEventListener("click", () => {
	modalSignup.style.display = "block";
	modalLogin.style.display = "none";
});
loginLink.addEventListener("click", () => {
	modalLogin.style.display = "block";
	modalSignup.style.display = "none";
});
// sign up function
signupForm.addEventListener("submit", (e) => {
	e.preventDefault();

	// get user info
	const email = signupForm["signupEmail"].value;
	const password = signupForm["signupPassword"].value;
	const signupUsername = signupForm["signupUsername"].value;

	// sign up this user in firebase
	auth.createUserWithEmailAndPassword(email, password).then((cred) => {
		// if valid response, take the username
		if (cred) {
			cred.displayName = signupUsername;
		}
		modalSignup.style.display = "none";
		signupForm.reset();
	});
});

loginForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const email = loginForm["loginEmail"].value;
	const password = loginForm["loginPassword"].value;
	auth.signInWithEmailAndPassword(email, password).then((cred) => {
		modalLogin.style.display = "none";
		loginForm.reset();
	});
});

logoutLink.addEventListener("click", (e) => {
	e.preventDefault();
	auth.signOut().then(() => {
		console.log("user has signed out");
	});
});

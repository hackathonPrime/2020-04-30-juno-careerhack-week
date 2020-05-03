// display all articles
const newsContainer = document.querySelector(".newsContainer");
const commentForm = `<form action="" class="commentForm">
<label for="comment">enter comment below</label>
<input type="textarea" name="comment">
<input type="submit">
</form>`;
function fetchAndPrintData() {
	fetch("/api/data/articles")
		.then((data) => data.json())
		.then((json) => {
			json.reverse();
			json.forEach((article) => {
				console.log(article);
				const { _id, created_at, description, link, title } = article;
				const utcDate = created_at;
				const localDate = new Date(utcDate);
				const date = localDate.toDateString();
				const time = localDate.toTimeString().split("-");
				const htmlToAppend = ` <li class="article ${_id}">
        <p>posted on ${date} at ${time[0]}</p>
		<h2 class="newsTitle"> <a href="${link}" rel="noopener" target="_blank"> ${title} </a> </h2>
		<p class="description"> ${description} </p>
		${commentForm}
	</li>`;
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

//functions in the nav bar

//search function
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

// Submits the article form and refreshes the data
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
// article form
const postArticleForm = document.querySelector(".postArticleForm");

// run this on load
fetchAndPrintData();
postArticleForm.reset();

// user auth constants
const signupForm = document.querySelector("#signupForm");
const loginForm = document.querySelector("#loginForm");

// navbar constants
const postArticleLink = document.querySelector("#postArticleLink");
const loginLink = document.querySelector("#loginLink");
const signupLink = document.querySelector("#signupLink");
const logoutLink = document.querySelector("#logout");

// form constants for display purposes
const modalSignup = document.querySelector(".modalSignup");
const modalLogin = document.querySelector(".modalLogin");
const modalArticle = document.querySelector(".modalArticle");
const closeSignupModal = document.querySelector(".closeSignupModal");
const closeLoginModal = document.querySelector(".closeLoginModal");
const closeArticleModal = document.querySelector(".closeArticleModal");

// listen for auth status changes
auth.onAuthStateChanged((user) => {
	// determine which auth nav links to display based on signed in/out
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

// show sign up modal
signupLink.addEventListener("click", () => {
	modalSignup.style.display = "block";
	modalLogin.style.display = "none";
});
// show login modal
loginLink.addEventListener("click", () => {
	modalLogin.style.display = "block";
	modalSignup.style.display = "none";
});

// show post article modal
postArticleLink.addEventListener("click", () => {
	modalArticle.style.display = "block";
});

// close signup
closeSignupModal.addEventListener("click", () => {
	modalSignup.style.display = "none";
});
// close login
closeLoginModal.addEventListener("click", () => {
	modalLogin.style.display = "none";
});
// close post article
closeArticleModal.addEventListener("click", () => {
	modalArticle.style.display = "none";
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

// login function
loginForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const email = loginForm["loginEmail"].value;
	const password = loginForm["loginPassword"].value;
	auth.signInWithEmailAndPassword(email, password).then((cred) => {
		modalLogin.style.display = "none";
		loginForm.reset();
	});
});
// logout function
logoutLink.addEventListener("click", (e) => {
	e.preventDefault();
	auth.signOut().then(() => {
		console.log("user has signed out");
	});
});

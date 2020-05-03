// display all articles
const newsContainer = document.querySelector(".newsContainer");
const addCommentForm = function(id){
const form = `<form action="" class="commentForm">
<input type="text" name="articleID" value="${id}" disabled="true">
<label for="comment">enter comment below</label>
<input type="textarea" name="comment">
<input type="submit">
</form>`
console.log(id)
return form
}

const voting = `<div class="voteContainer">
<button class="upVote"><span class="sr-only">upvote this article</span><i class="fas fa-caret-up"></i></button> 5
<button class="downVote"><span class="sr-only">downvote this article</span><i class="fas fa-caret-down"></i></button> 0
</div>`;
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
				${voting}
				<h2 class="newsTitle"> <a href="${link}" rel="noopener" target="_blank"> ${title} </a> </h2>
				<p>posted on ${date} at ${time[0]}</p>
		<p class="description"> ${description} </p>
		${addCommentForm(_id)}
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
					<h2 class="newsTitle"> <a href="${link}" rel="noopener" target="_blank"> ${title} </a> </h2>
					<p>posted on ${date} at ${time[0]}</p>
            <p class="description"> ${description} </p>
			${commentForm}
		</li>`;
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
const welcomeMessage = document.querySelector('.welcomeMessage')

// form constants for display purposes
const modalSignup = document.querySelector(".modalSignup");
const modalLogin = document.querySelector(".modalLogin");
const modalArticle = document.querySelector(".modalArticle");
const closeSignupModal = document.querySelector(".closeSignupModal");
const closeLoginModal = document.querySelector(".closeLoginModal");
const closeArticleModal = document.querySelector(".closeArticleModal");


const userObjects = {}
// listen for auth status changes
auth.onAuthStateChanged((user) => {

	// determine which auth nav links to display based on signed in/out
	if (user) {
    userObjects.username = user.displayName;
    userObjects.email = user.email;
		loginLink.closest("li").style.display = "none";
		signupLink.closest("li").style.display = "none";
		logoutLink.closest("li").style.display = "inline";
		welcomeMessage.closest('li').style.display = "inline"
		welcomeMessage.innerHTML = `Welcome, ${user.displayName}`
	} else {
		logoutLink.closest("li").style.display = "none";
		loginLink.closest("li").style.display = "inline";
		signupLink.closest("li").style.display = "inline";
		welcomeMessage.closest('li').style.display = "none"
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
	// const email = signupForm["signupEmail"].value;
	// const password = signupForm["signupPassword"].value;
	// const signupUsername = signupForm["signupUsername"].value;

  const signupUsername = e.target.signupUsername.value
  const email = e.target.signupEmail.value
  const password = e.target.signupPassword.value



	// sign up this user in firebase
	auth.createUserWithEmailAndPassword(email, password).then((cred) => {
		// if valid response, take the username
		if (cred) {
			const user = firebase.auth().currentUser;
			let displayName, idToken;

			user
				.updateProfile({
					displayName: signupUsername,
				})
				.then(() => {
					// console.log(user.displayName)
					displayName = user.displayName;
				});
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

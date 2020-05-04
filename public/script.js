// display all articles
const newsContainer = document.querySelector(".newsContainer");
const addCommentForm = function (id) {
	const form = `<form action="" class="commentForm">
<input class="articleID" aria-hidden="true" type="text" name="articleID" value="${id}" disabled="true">
<label for="comment">Leave a Comment</label>
<textarea required="true" class="commentTextArea" name="comment"></textarea>
<input value="Submit Comment" class="submitCommentButton" type="submit">
<div id="commentOut"></div>
</form>`;
	let commentForm;
	return form;
};

const createArticle = function(article) {
	const { _id, created_at, description, link, title } = article;
				const utcDate = created_at;
				const localDate = new Date(utcDate);
				const date = localDate.toDateString().split(" ").slice(1, 4).join(" ");
				const htmlToAppend = ` <li class="article ${_id}">
				<h2 class="newsTitle"> <a href="${link}" rel="noopener" target="_blank"> ${title} </a> </h2>
				<p class="timePosted">${date}</p>
		<p class="description"> ${description} </p>
		<button class="displayCommentToggle">Show / Add Comments</button>
		<div class="comment${_id}">
		<ul class="commentList">
		</ul>
		${addCommentForm(_id)}
		</div>
	</li>`;

	newsContainer.innerHTML += htmlToAppend;
	commentForm = document.getElementsByClassName(".commentForm");
}

function fetchAndPrintData() {
	fetch("/api/data/articles")
		.then((data) => data.json())
		.then((json) => {
			json.reverse();
			json.forEach((article) => {
				createArticle(article);
			});

			fetchAndPrintComments();

			document.body.addEventListener(
				"submit",
				function (e) {
					e.preventDefault();
					if (e.target.className === "commentForm") {
						const articleID = e.target.articleID.value;
						const comment = e.target.comment.value;
						const username = userObject.username;
						const email = userObject.email;
						fetch("/api/data/comments", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ comment, username, email, articleID }),
						}).then((res, err) => {
							fetchAndPrintComments();
							e.target.reset();
						});
					}
				},
				false
			);
		});
}

const commentObj = {};

function fetchAndPrintComments() {
	for (let key in commentObj) delete commentObj[key];
	fetch("api/data/comments")
		.then((data) => data.json())
		.then((json) => {
			const commentArray = [];
			// for each comment get the article's id that it's written on
			json.forEach((comment) => {
				commentArray.push(comment.articleID);
			});
			// get an array of only the unique article ID's
			const uniqueArray = commentArray.filter((v, i, a) => a.indexOf(v) === i);
			// set those unique article ID's to be keys in the comment object
			for (let id in uniqueArray) {
				commentObj[uniqueArray[id]] = [];
			}
			// for each comment that matches on of the comment object's keys, push those comment objects to that array.
			json.forEach((comment) => {
				for (let articleID in commentObj) {
					if (articleID == comment.articleID) {
						commentObj[articleID].push(comment);
					}
				}
			});
			displayComments();
		});
}


// display comments function
const displayComments = function () {
	// have to empty out the lists for the search filters to work properly
	const commentLists = document.getElementsByClassName('commentList')
	for(let i=0; i<commentLists.length; i++) {
		commentLists[i].innerHTML = ''
	}
	// for each comment in each thread, construct a comment
	for (let thread in commentObj) {
		commentObj[thread].forEach((comment) => {
			const commentTime = new Date(comment.created_at).toTimeString().split("-")[0].split(" ")[0];
			const commentDate = new Date(comment.created_at).toDateString();
			const htmlToAppend = `<li>
		<h3>${comment.username}</h3>
		<p class="commentTime">${commentTime} ${commentDate}</p>
		<p class="commentMessage">${comment.comment}</p>
		</li>`;
			// target the proper article's thread
			const threadFocus = document.querySelector(`.comment${thread} ul`);
			if (threadFocus){

				// post all the comments to that thread
				threadFocus.innerHTML += htmlToAppend;
			}
		});
	}
	commentShowToggleFunction();
};

// toggle comments visibility
const commentShowToggleFunction = function(){
	const commentShow = document.getElementsByClassName('displayCommentToggle');
	for (let i = 0; i<commentShow.length; i++) {
		commentShow[i].addEventListener('click',()=>{
				commentShow[i].classList.toggle('showing')
				if (commentShow[i].className.includes('showing')) {
					commentShow[i].textContent = 'Hide Comments'
				} else {
					commentShow[i].textContent = 'Show / Add Comments'
				}
		})

	}
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
					createArticle(article)
				}
				fetchAndPrintComments();
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
		newsContainer.innerHTML = "";
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
const welcomeMessage = document.querySelector(".welcomeMessage");

// form constants for display purposes
const modalSignup = document.querySelector(".modalSignup");
const modalLogin = document.querySelector(".modalLogin");
const modalArticle = document.querySelector(".modalArticle");
const closeSignupModal = document.querySelector(".closeSignupModal");
const closeLoginModal = document.querySelector(".closeLoginModal");
const closeArticleModal = document.querySelector(".closeArticleModal");

const userObject = {};
// listen for auth status changes
auth.onAuthStateChanged((user) => {
	// determine which auth nav links to display based on signed in/out
	if (user) {
		userObject.username = user.displayName;
		userObject.email = user.email;
		loginLink.closest("li").style.display = "none";
		signupLink.closest("li").style.display = "none";
		logoutLink.closest("li").style.display = "inline";
		welcomeMessage.closest("li").style.display = "inline";
		welcomeMessage.innerHTML = `Welcome, ${user.displayName}`;
	} else {
		userObject.username = 'Guest';
		userObject.email = 'guest@gmail.com';
		logoutLink.closest("li").style.display = "none";
		loginLink.closest("li").style.display = "inline";
		signupLink.closest("li").style.display = "inline";
		welcomeMessage.closest("li").style.display = "none";
	}
});

// show sign up modal
signupLink.addEventListener("click", () => {
	modalSignup.style.display = "block";
	modalLogin.style.display = "none";
	modalArticle.style.display = "none";
});
// show login modal
loginLink.addEventListener("click", () => {
	modalLogin.style.display = "block";
	modalSignup.style.display = "none";
	modalArticle.style.display = "none";
});

// show post article modal
postArticleLink.addEventListener("click", () => {
	modalArticle.style.display = "block";
	modalLogin.style.display = "none";
	modalSignup.style.display = "none";
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

	const signupUsername = e.target.signupUsername.value;
	const email = e.target.signupEmail.value;
	const password = e.target.signupPassword.value;

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
	});
});

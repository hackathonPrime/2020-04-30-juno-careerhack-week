// Gets the data and outputs it to the `out` div
function fetchAndPrintData() {
	fetch("/api/data/articles")
		.then((data) => data.json())
		.then((json) => {
			json.forEach((article) => {
        console.log(article)
        const { created_at, description, link, title } = article;
        const utcDate = created_at;
        const localDate = new Date(utcDate);
        const date = localDate.toDateString()
        const time = localDate.toTimeString().split("-");
        const htmlToAppend = ` <li class="article">
        <p>posted on ${date} at ${time[0]}</p>
            <h2 class="newsTitle"> <a href="${link}" rel="noopener" target="_blank"> ${title} </a> </h2>
            <p class="description"> ${description} </p>
          </li>`;

          const newsContainer = document.querySelector('.newsContainer')
          newsContainer.innerHTML += htmlToAppend
      });
		});
}
// target for article form reset
const postArticleForm = document.querySelector('.postArticleForm')

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
		console.log(JSON.stringify({ title, description, link }));
    fetchAndPrintData();
    postArticleForm.reset();
    
	});
}

// run this on load
fetchAndPrintData();
postArticleForm.reset();

//user auth

//signup
const signupForm = document.querySelector("#signupForm");
const signupLink = document.querySelector("#signupLink");
const loginForm = document.querySelector("#loginForm");
const loginLink = document.querySelector("#loginLink");
const logoutLink = document.querySelector("#logout");

// target for form toggle
const modalSignup = document.querySelector('.modalSignup')
const modalLogin = document.querySelector('.modalLogin')

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

	// sign up this user in firebase
	auth.createUserWithEmailAndPassword(email, password).then((cred) => {
		modalSignup.style.display = "none";
		signupForm.reset();
	});
});

loginForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const email = loginForm["loginEmail"].value;
	const password = loginForm["loginPassword"].value;
	auth.signInWithEmailAndPassword(email, password).then((cred) => {
		console.log(cred.user, "user has logged in");
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

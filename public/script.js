// Gets the data and outputs it to the `out` div
function fetchAndPrintData() {
	fetch("/api/data")
		.then((data) => data.json())
		.then((json) => {
			document.getElementById("out").textContent = JSON.stringify(json);
		});
}

// Submits the form and refreshes the data
function submitForm() {
	event.preventDefault();

	const title = event.target.title.value;
	const description = event.target.description.value;

	fetch("/api/data", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ title, description }),
	}).then(() => {
		console.log(JSON.stringify({ title, description }));
		fetchAndPrintData();
	});
}

// run this on load
fetchAndPrintData();

//user auth

//signup
const signupForm = document.querySelector("#signupForm");
const signupLink = document.querySelector("#signupLink");
const loginForm = document.querySelector("#loginForm");
const loginLink = document.querySelector("#loginLink");
const logoutLink = document.querySelector("#logout");

// sign up show modal
signupLink.addEventListener("click", () => {
	signupForm.style.display = "block";
});
loginLink.addEventListener("click", () => {
	loginForm.style.display = "block";
});
// sign up function
signupForm.addEventListener("submit", (e) => {
	e.preventDefault();

	// get user info
	const email = signupForm["signupEmail"].value;
	const password = signupForm["signupPassword"].value;

	// sign up this user in firebase
	auth.createUserWithEmailAndPassword(email, password).then((cred) => {
		const modal = document.querySelector("#modalSignup");
		signupForm.style.display = "none";
		signupForm.reset();
	});
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm['loginEmail'].value;
  const password = loginForm['loginPassword'].value;
  auth.signInWithEmailAndPassword(email, password).then((cred)=>{
console.log(cred.user, 'user has logged in');
loginForm.style.display = "none";
loginForm.reset();
  })
});

logoutLink.addEventListener("click", (e) => {
	e.preventDefault();
	auth.signOut().then(() => {
		console.log("user has signed out");
	});
});

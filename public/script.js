// Gets the data and outputs it to the `out` div
function fetchAndPrintData() {
	fetch("/api/data")
		.then((data) => data.json())
		.then((json) => {
      // console.log(json)
			document.getElementById("out").textContent = JSON.stringify(json);
		});
}

// Submits the form and refreshes the data
function submitForm() {
	event.preventDefault();

  const title = event.target.title.value;
  const description = event.target.description.value;
  const link = event.target.link.value;

  fetch('/api/data/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, description, link })
  })
  .then(() => {
    console.log(JSON.stringify({ title, description, link }))
    fetchAndPrintData()
  });
  
}
  

// run this on load
fetchAndPrintData();

//user auth

//user auth variables
const signupForm = document.querySelector("#signupForm");
const signupLink = document.querySelector("#signupLink");
const loginForm = document.querySelector("#loginForm");
const loginLink = document.querySelector("#loginLink");
const logoutLink = document.querySelector("#logout");

// to toggle modal visibility
const signupFormVisible = document.querySelector('.modalSignup');
const loginFormVisible = document.querySelector('.modalLogin');

// sign up show modal
signupLink.addEventListener("click", () => {
  signupFormVisible.style.display = "block";
  loginFormVisible.style.display = "none";
});
loginLink.addEventListener("click", () => {
  loginFormVisible.style.display = "block";
  signupFormVisible.style.display = "none";
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
		signupForm.reset();
		signupFormVisible.style.display = "none";
	});
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm['loginEmail'].value;
  const password = loginForm['loginPassword'].value;
  auth.signInWithEmailAndPassword(email, password).then((cred)=>{
console.log(cred.user, 'user has logged in');
loginForm.reset();
loginFormVisible.style.display = "none";
  })
});

logoutLink.addEventListener("click", (e) => {
	e.preventDefault();
	auth.signOut().then(() => {
		console.log("user has signed out");
	});
});

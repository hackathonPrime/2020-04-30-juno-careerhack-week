// Gets the data and outputs it to the `out` div
function fetchAndPrintData() {
  fetch('/api/data/articles')
    .then(data => data.json())
    .then(json => {
      document.getElementById('out').textContent = JSON.stringify(json)
    } );
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

//signup
const signupForm = document.querySelector('#signupForm');
const signupLink = document.querySelector('#signupLink')

signupLink.addEventListener('click',()=>{
  signupForm.style.display = 'block';
})
signupForm.addEventListener('submit',(e)=>{
e.preventDefault();

// get user info
const email = signupForm['signupEmail'].value;
const password = signupForm['signupPassword'].value;

// sign up this user

auth.createUserWithEmailAndPassword(email,password).then(cred=>{
console.log(cred.user);
const modal = document.querySelector('#modalSignup')
signupForm.style.display = 'none';
signupForm.reset();
})
})
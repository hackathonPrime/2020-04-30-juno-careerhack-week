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


// document.addEventListener('DOMContentLoaded', (event) => {

//   const userAuth = function() {
//     let email = document.getElementById('email');
//     let password = document.getElementById('password');
//     firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       // 
//       console.log('form submitted',email,password)
//     });
//   }
//   const form = document.getElementById('loginForm');
//   form.addEventListener('submit', userAuth);
  
//   })
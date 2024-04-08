const username = document.getElementById('username')
const password = document.getElementById('password')
const showPassword = document.getElementById('showPassword')
const loginBtn = document.getElementById('loginBtn')

showPassword.addEventListener('click', showPasswordChars)
loginBtn.addEventListener('click', login)

function showPasswordChars() {
    if (password.type === "password") {
        password.type = "text";
      } else {
        password.type = "password";
      }
}

function login() {
    fetch('/login', {
        method:'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({"username":username.value, "password":password.value})
    }).then(res => res.json())
    .then(data => {
        window.location.href = data.redirectUrl
    })
}


 // Initialize Firebase
firebase.initializeApp(
  var config = {
    apiKey: "AIzaSyBhP77MXGReodt1X7uQ7mJDyM8wLEijh6w",
    authDomain: "super-bowl-voting.firebaseapp.com",
    databaseURL: "https://super-bowl-voting.firebaseio.com",
    storageBucket: "super-bowl-voting.appspot.com",
    messagingSenderId: "83268777882"
})


document.querySelector('.choice-a button').addEventListener('click', onVote)
document.querySelector('.choice-b button').addEventListener('click', onVote)

function onVote (evt) {
  // submit the vote
  // // which button
  const voteFor = evt.target.closest('.choice').dataset.value
  const url = 'https://super-bowl-voting.firebaseio.com/votes.json'

  // go GET current count
  fetch(url)
    .then(resp => resp.json()) // fires on the first 'bite'
    .then(data => {
      let newCount
      if(data) {
    // there are existing votes
        newCount = data[voteFor] + 1
        fetch(url, {
          method: 'PATCH',
          body: JSON.stringify({ [voteFor]: newCount})
        })
      } else {
    // you're the first voter
        newCount = 1
        fetch(url, {
          method: 'PATCH',
          body: JSON.stringify({ [voteFor]: newCount})
        })
      }

      // const newCount = data && data[voteFor] ? data[voteFor] + 1 : 1  // ternary option

  // PATCH new count
      return fetch(url, {
        method: 'PATCH',
        body: JSON.stringify({ [voteFor]: newCount})
      })
  // show current vote totals
    // promise inside a promise!!! guess it's ok here
      .then(() => {
        document.querySelectorAll('h3').forEach(choice => {
          const total = Object.values(data).reduce((acc, val) => acc + val)
          const current = data[choice.closest('.choice').dataset.value]
          choice.innerText = Math.round( ( current / total ) * 100 ) + "%"
        })
      })
    })
    .catch(console.log('error', evt.error))

  // .then hide buttons
  document.querySelectorAll('button').forEach(btn => btn.remove())
}

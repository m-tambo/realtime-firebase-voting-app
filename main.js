{
  // Initialize Firebase
  firebase.initializeApp({
    apiKey: "AIzaSyBhP77MXGReodt1X7uQ7mJDyM8wLEijh6w",
    authDomain: "super-bowl-voting.firebaseapp.com",
    databaseURL: "https://super-bowl-voting.firebaseio.com",
    storageBucket: "super-bowl-voting.appspot.com",
    messagingSenderId: "83268777882"
  })

  document
    .querySelectorAll(".choice button")
    .forEach(btn => btn.addEventListener('click', onVote))

  // document.querySelector('.choice-a button').addEventListener('click', onVote)
  // document.querySelector('.choice-b button').addEventListener('click', onVote)

  const messagesRef = firebase.database().ref('messages')
  const votesRef = firebase.database().ref('votes')


  function onVote(evt) {
    // submit the vote
    // // which button
    const voteFor = evt.target.closest('.choice').dataset.value
    const url = 'https://super-bowl-voting.firebaseio.com/votes.json'

    // go GET current count
    // fetch(url)
    // .then(resp => resp.json()) // fires on the first 'bite'
    votesRef.once('value')
      .then(snap => snap.val())
      .then(data => {
        let newCount
        if (data) {
          // there are existing votes
          newCount = data[voteFor] + 1
          fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({
              [voteFor]: newCount
            })
          })
        } else {
          // you're the first voter
          newCount = 1
          fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({
              [voteFor]: newCount
            })
          })
        }

        // const newCount = data && data[voteFor] ? data[voteFor] + 1 : 1  // ternary option

        // PATCH new count
        // return fetch(url, {
        //   method: 'PATCH',
        //   body: JSON.stringify({ [voteFor]: newCount})
        // })
        return votesRef.update({
            [voteFor]: newCount
          })
          // show current vote totals
          // promise inside a promise!!! guess it's ok here


      })
      .catch(console.log('error', evt.error))

    // .then hide buttons
    document.querySelectorAll('button').forEach(btn => btn.remove())

    // unhide the totals
    document.querySelectorAll('.hidden').forEach(item => item.classList.remove('hidden'))
  }

  const postMsg = (evt) => {

    evt.preventDefault()  // keeps page from refreshing
    let nameIn = document.querySelector('.name').value // evt.target.elements.name
    let messageIn = document.querySelector('.msg').value  // evt.target.elements.message

    const name = nameIn.trim()
    const message = messageIn.trim()

    messagesRef.push({
      name: name,
      message: message,
    });
    document.querySelector("form").reset();
  }

  // submit smack talk
  document.querySelector('form').addEventListener('submit', postMsg)


  function onNewMsg(snap) {
    const data = snap.val()
    document.querySelector('.messages').innerHTML += `
      <div>
        <strong>${data.name}</strong> said "${data.message}"
        <hr />
      </div>
      `
  }

// listening for changes in 'messages'
  messagesRef.limitToLast(5).on('child_added', onNewMsg)

// listening for changes in 'votes'
  votesRef.on('value', onUpdate)

  function onUpdate(snap) {
    const data = snap.val()

    document.querySelectorAll('h3').forEach(choice => {
      const total = Object.values(data).reduce((acc, val) => acc + val)
      const current = data[choice.closest('.choice').dataset.value]
      choice.innerText = Math.round((current / total) * 100) + "%"
    })
  }



}

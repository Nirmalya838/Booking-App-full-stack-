function deleteUser(button) {
  const userId = button.dataset.userid;

  axios.delete(`/user/delete-user/${userId}`)
    .then(response => {
      console.log(response.data);
      button.parentElement.parentElement.remove();
    })
    .catch(error => {
      console.error(error);
    });
}

function editUser(userId) {
  // Fetch user details from the server
  axios.get(`/user/${userId}`)
    .then(response => {
      const user = response.data;

      // Populate user details in an editable form
      let username = document.getElementById('name');
      let email = document.getElementById('email');
      let phone = document.getElementById('phone');
      username.value = user.USERNAME;
      email.value = user.EMAILID;
      phone.value = user.PHONE;

      const btn = document.getElementById('submit');
      btn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get the updated user data from the form fields
        const updatedUser = {
          USERNAME: username.value,
          EMAILID: email.value,
          PHONE: phone.value
        };

        // Make a PUT request to update the user data
        axios.put(`/user/update-user/${userId}`, updatedUser)
          .then(response => {
            console.log(response.data);
            location.reload();
          })
          .catch(error => {
            console.error(error);
          });
      });
    })
    .catch(error => {
      console.error(error);
    });
}

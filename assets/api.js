function getSelf(callback) {
  $.ajax({
    type: "GET",
    url: "/api2/users/me",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      callback(response.user);
    },
    error: function (xhr, status, error) {
      if (status == 401) {
        alert("로그인이 필요합니다.");
      } else {
        localStorage.clear();
        alert("로그인이 필요합니다.");
      }
      window.location.href = "/login";
    },
  });
}

function sign_out() {
  localStorage.clear();
  alert("로그아웃!");
  window.location.href = "/login";
}

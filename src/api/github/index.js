const getUser = async () =>
  fetch("https://api.github.com/users/mikaelhadler").then((res) => {
    if (!res.ok) {
      return res.json().then((errorData) => {
        throw new Error(`Failed at firstRequest: ${errorData.message}`);
      });
    }
    return res.json();
  });

export { getUser };

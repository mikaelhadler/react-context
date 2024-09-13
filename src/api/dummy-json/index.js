const checkResponse = (res) => {
  if (!res.ok) {
    return res.json().then((errorData) => {
      throw new Error(`Failed at firstRequest: ${errorData.message}`);
    });
  }
  return res.json()
}
const getUser = async () =>
  fetch("https://dummyjson.com/users/1")
    .then(async (res) => checkResponse(res))

export { getUser };

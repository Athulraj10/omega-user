const fetcher = (url: string, postData?: any) => {
  const options: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (postData) {
    options.method = "POST";
    options.body = JSON.stringify(postData);
  } else {
    options.method = "GET";
  }

  return fetch(url, options).then((res) => res.json());
};

export default fetcher;

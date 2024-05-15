import { HttpInterceptorFn } from '@angular/common/http';

type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const accessTokenExpired = isAccessTokenExpired();
  if (accessTokenExpired) {
    fetchNewAccessToken();
  }

  // here we have a bug - if it runs the query for the first
  //  time and the local storage is empty or has an expired value ->
  //  then it just take value (not w8 for fetchNewAccessToken() ) and then
  //  imidiatly return next(authReq) , but after it - set up the re-value correctly in LS.

  const accessToken = localStorage.getItem('accessToken');

  const authReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return next(authReq);
};

async function fetchNewAccessToken(): Promise<AccessTokenResponse> {
  const myHeaders = new Headers();
  myHeaders.append(
    'Authorization',
    'Basic WDMtc0c1MUxTQXNnQnV4OHpfWlBRNEQtOk9NeEdCR1dXa2UtZzVCLVpmcXljTnBRcG5OSWNibWlG',
  );

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: '',
    redirect: 'follow' as RequestRedirect,
  };
  const response = await fetch(
    'https://auth.europe-west1.gcp.commercetools.com/oauth/token?grant_type=client_credentials',
    requestOptions,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch new AccessToken');
  }

  const responseData: AccessTokenResponse = await response.json();

  localStorage.setItem('accessToken', responseData.access_token);
  localStorage.setItem(
    'expirationTime',
    (Date.now() + responseData.expires_in * 1000).toString(),
  );

  return responseData;
}

function isAccessTokenExpired() {
  const currentTime = new Date().getTime();
  const storedExpirationTime = parseInt(
    localStorage.getItem('accessTokenExpirationTime') || '0',
    10,
  );

  if (currentTime > storedExpirationTime) {
    return true;
  } else {
    return false;
  }
}

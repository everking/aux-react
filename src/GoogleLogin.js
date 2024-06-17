import React from 'react';

const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    const clientId = process.env.REACT_APP_FIREBASE_CLIENT_ID;
    const redirectUri = window.location.origin + '/auxilium/auth';
    const scope = 'email profile openid';
    const responseType = 'token id_token';

    // Generate a random nonce
    const generateNonce = () => {
      const array = new Uint32Array(8);
      window.crypto.getRandomValues(array);
      return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    };

    const nonce = generateNonce();
    localStorage.setItem('nonce', nonce);

    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&nonce=${nonce}`;

    window.location.href = oauthUrl;
  };

  return (
    <button onClick={handleGoogleLogin}>Login with Google</button>
  );
};

export default GoogleLogin;
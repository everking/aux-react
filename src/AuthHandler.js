import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const idToken = params.get('id_token');
      const accessToken = params.get('access_token');

      const authenticateWithFirebase = async (token) => {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${process.env.REACT_APP_FIREBASE_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requestUri: window.location.origin,
            postBody: `id_token=${token}&providerId=google.com`,
            returnSecureToken: true,
            returnIdpCredential: true,
          }),
        });
        return response.json();
      };

      const validateNonce = (idToken) => {
        const decodedToken = jwtDecode(idToken);
        const storedNonce = localStorage.getItem('nonce');
        if (decodedToken.nonce !== storedNonce) {
          throw new Error('Invalid nonce');
        }
      };

      if (idToken) {
        try {
          validateNonce(idToken);
          authenticateWithFirebase(idToken)
            .then(data => {
              if (data.idToken) {
                console.log('User data:', data);
                localStorage.setItem('user', JSON.stringify(data));
                navigate('/');
              } else {
                console.error('Failed to login:', data);
              }
            })
            .catch(error => console.error('Error during Google login:', error));
        } catch (error) {
          console.error('Nonce validation failed:', error);
        }
      } else if (accessToken) {
        fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`)
          .then(response => response.json())
          .then(data => {
            if (data.aud === process.env.REACT_APP_FIREBASE_CLIENT_ID) {
              return authenticateWithFirebase(accessToken);
            } else {
              throw new Error('Invalid access token');
            }
          })
          .then(data => {
            if (data.idToken) {
              console.log('User data:', data);
              localStorage.setItem('user', JSON.stringify(data));
              navigate('/');
            } else {
              console.error('Failed to login:', data);
            }
          })
          .catch(error => console.error('Error during Google login:', error));
      }
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default AuthHandler;
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return { currentUser, setCurrentUser };
};
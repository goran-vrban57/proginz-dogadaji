import {jwtDecode} from 'jwt-decode';
export function provjeriAdmin() {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  const dekodiranToken = jwtDecode(token);
  return dekodiranToken.uloga === 0;
};

export function provjeriKorisnika() {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  const decodedToken = jwtDecode(token);
  return decodedToken.uloga === 1;
};


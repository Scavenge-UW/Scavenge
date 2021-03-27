import request from './request';

function signup(user) {
  console.log(user);
  return request({
    url: '/signup',
    method: 'POST',
    data: {
      "username": user.username,
      "password": user.password,
      "phoneNumber": user.phoneNumber,
      "address": user.address,
      "city": user.city,
      "state": user.state,
      "zip": user.zip,
      "carDescription": user.carDescription,
      "type": user.type,
      "email": user.email
    },
    withCredentials: true,
  });
}

function login(user) {
  return request({
    url: '/login',
    method: 'POST',
    data: {
      "username": user.username,
      "password": user.password,
    },
    withCredentials: true,
  });
}

function editProfile(user, token) {
  return request({
    url: '/' + user.username,
    method: 'PUT',
    data: {
      "username": user.username,
      "password": user.password,
      "phoneNumber": user.phoneNumber,
      "address": user.address,
      "city": user.city,
      "state": user.state,
      "zip": user.zip,
      "email": user.email,
      "firstName": user.firstName,
      "lastName": user.LastName
    },
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

function logout(user) {
  return request({
    url: '/logout',
    method: 'POST',
    withCredentials: true,
  });
};

const AuthService = {
  signup, login, editProfile, logout
}


export default AuthService;

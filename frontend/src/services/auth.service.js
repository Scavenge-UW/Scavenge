import request from './request';

function editProfile(user, token){
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
        "carDescription": user.carDescription,
        "type": user.type,
        "email": user.email
      },
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  }


const AuthService = {
    editProfile
}

export default AuthService;
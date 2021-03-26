import request from './request'

function getDetail(pantryId) {
    return request({
        url: '/pantries/' + pantryId,
        method: 'GET',
        withCredentials: true,
    })
}

function updateDetail(pantry, pantryId, token){
    return request({
      url: '/' + pantryId,
      method: 'PUT',
      data: {
        "username": pantry.username,
        "password": pantry.password,
        "phoneNumber": pantry.phoneNumber,
        "address": pantry.address,
        "city": pantry.city,
        "state": pantry.state,
        "zip": pantry.zip,
        "carDescription": pantry.carDescription,
        "type": pantry.type,
        "email": pantry.email
      },
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  }

const PantryService = {
    getDetail, updateDetail
}

export default PantryService;
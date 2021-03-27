import { EDIT_PROFILE } from './types';
import AuthService from '../services/auth.service';


export const editProf = (user, token) => dispatch =>{
    AuthService.editProfile(user, token).then(res => res.json()).then(prof=> dispatch({
      type: EDIT_PROFILE,
      payload: prof
    }));
};
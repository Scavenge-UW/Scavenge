import React, { Component } from 'react';

export default class HelpView extends Component {
    render() {
        return (
            <div>
               <h1 style={{paddingTop:"20px"}}>Help Page</h1>

               <h4>To access your admin account and submit new pantry please email the people below:</h4>
               
               <h5>Contact Info</h5>
               <ul>
                   <li>Gleb: gleb@wisc.edu</li>
                   <li>Ilkyu Juu: ilkyu@wisc.edu </li>
                   <li>Jason Sutanto: jsutanto@wisc.edu</li>
                   <li>Kenneth Mui: klmui@wisc.edu</li>
                   <li>Yayen Lin: andy@wisc.edu</li>
               </ul>

               <h5>Upcoming features</h5>
               <ul>
                   <li>Wishlist items</li>
                   <li>Email notifications when a wishlisted item comes back in stock and when their reservation gets approved</li>
                   <li>Real-time inventory</li>
                   <li>Track the nutrition of the foods you reserve</li>
               </ul>




                
            </div>
        )
    }
}

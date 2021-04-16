import React, { Component } from 'react';

export default class HelpView extends Component {
    render() {
        return (
            <div>
               <h1 style={{paddingTop:"20px"}}>Help Page</h1>

               <h4>To access your admin account and submit new pantry please email Kenny:</h4>
               
               <h5>Contact Info</h5>
               <ul>
                    <li>Andy: Frontend Developer</li>
                   <ul>
                       <li>Email: lin383@wisc.edu@wisc.edu</li>
                   </ul>
                   <li>Gleb: Frontend Developer</li>
                   <ul>
                       <li>Email: tsyganov@wisc.edu</li>
                   </ul>
                   <li>Ilkyu: Frontend Lead </li>
                   <ul>
                       <li>Email: iju2@wisc.edu</li>
                   </ul>
                   <li>Jason: Frontend Developer</li>
                   <ul>
                       <li>Email: jsutanto2@wisc.edu</li>
                   </ul>
                   <li>Kenny: Project Leader / Backend Lead</li>
                   <ul>
                       <li>Email: klmui@wisc.edu@wisc.edu</li>
                   </ul>
                   
                   <li>Sean: Backend Developer</li>
                   <ul>
                       <li>Email: sjcunningham@wisc.edu</li>
                   </ul>
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

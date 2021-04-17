import React, { Component } from 'react';

export default class HelpView extends Component {
    render() {
        return (
            <div className="container" style={{background: "#FFF", height: "100vh"}}>
               <h1 className="text-center" style={{paddingTop:"20px"}}>Help Page</h1>
               
               <div className="container mt-4">
                <h5>Frequently Asked Questions</h5>
                <ul>
                    <li><em>How do I manage a pantry?</em> Ask Kenny to email you the information for a pantry manager.</li>
                    <li><em>How do I edit my pantry's infomation?</em> Login as a pantry staff or admin and go to "Manage Pantry". Scroll to the bottom to edit your pantry's description and hours (we know it can be a lot of scrolling unfortunately and are currently addressing this issue).</li>
                    <li><em>How do I make a pantry?</em> Email your pantry information to Kenny and he will submit it once it has been approved.</li>
                </ul>
            
                <h5>Contact Info</h5>
                <ul>
                    <li>Kenny: Project Leader / Backend Lead / Frontend Developer</li>
                    <ul>
                        <li>Email: klmui@wisc.edu@wisc.edu</li>
                    </ul>

                    <li>Ilkyu: Frontend Lead / Lead QA Tester</li>
                    <ul>
                        <li>Email: iju2@wisc.edu</li>
                    </ul>

                    <li>Andy: Frontend Developer</li>
                    <ul>
                        <li>Email: lin383@wisc.edu@wisc.edu</li>
                    </ul>

                    <li>Gleb: Frontend Developer</li>
                    <ul>
                        <li>Email: tsyganov@wisc.edu</li>
                    </ul>

                    <li>Jason: Frontend Developer</li>
                    <ul>
                        <li>Email: jsutanto2@wisc.edu</li>
                    </ul>

                    <li>Sean: Backend Developer / Database Administrator</li>
                    <ul>
                        <li>Email: sjcunningham@wisc.edu</li>
                    </ul>
                </ul>

                <h5>Current Features</h5>
                <ul>
                    <li>User: Search for nearby pantries</li>
                    <li>User: See what's in stock for each pantry by using the search form or clicking a pantry</li>
                    <li>User: Make and cancel reservations</li>
                    <li>User: Ability to edit their profile</li>
                    <li>Admin: Edit pantry information</li>
                    <li>Admin: Approve and edit reservations</li>
                    <li>Admin: Add/delete foods</li>
                    <li>Admin: Update food quantities</li>
                </ul>

                <h5>Upcoming Features</h5>
                <ul>
                    <li>Wishlist items</li>
                    <li>Email notifications when a wishlisted item comes back in stock and when their reservation gets approved</li>
                    <li>Real-time inventory</li>
                    <li>Track the nutrition of the foods you reserve</li>
                </ul>

               </div>


                
            </div>
        )
    }
}

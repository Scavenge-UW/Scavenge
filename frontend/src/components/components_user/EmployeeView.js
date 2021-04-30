import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// import Tab from "react-bootstrap/Tab";
// import Tabs from "react-bootstrap/Tabs";

import PantryService from "../../services/pantry.service";


import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function EmployeeView(props) {

    const [pantryDetail, setPantryDetail] = useState(null);
    const  {pantry_id}  = pantry_id; // get pantry_id in route param

    /**
    * Fetch pantry detail on init
    *
    */
    React.useEffect(() => {
        fetchPantryDetail();
    }, []);

    /**
     * Fetch pantry detail and food information
     *
     */
    const fetchPantryDetail = async () => {
        const detail = await PantryService.getDetail(pantry_id); // TODO: change pantry id based on user's affiliation
        setPantryDetail(detail);
    };

    const showEmployees = () => {
        return(
        <Row>
            <h2>{"The River bank" + " employees:"}</h2>
        </Row>
        );

    }

    return (
        <div>
           {showEmployees()}
        </div>
    )
}


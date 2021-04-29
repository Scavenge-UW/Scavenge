import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// imports for react bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Form from "react-bootstrap/Form";

// imports for components and service
import InventoryView from "./InventoryView";
import MySpinner from "../helper_functions/MySpinner";
import PantryService from "../../services/pantry.service";
import DashboardView from "../components_shared/DashboardView";

/**
 * PantryAdminView that consists of PantryDashboardView and InventoryView
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */

function PantryAdminView(props) {
  const [pantryDetail, setPantryDetail] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false); // used for spinner

  const employeeOf = props.owns; // list of pantries
  const default_pantry_id = parseInt(useParams().pantry_id); // set default pantry id on first load
  const [pantry_id, setPantryId] = useState(default_pantry_id); // admin can switch between pantry
  const [pantries, setPantries] = useState([]);
  /**
   * Fetch pantry detail on init
   *
   */
  useEffect(() => {
    fetchPantryDetail();
  }, []);

  /**
   * Fetch pantry detail
   */
  const fetchPantryDetail = async (id = null) => {
    setIsLoaded(false);
    const detail = await PantryService.getDetail(id ? id : pantry_id);
    setPantryDetail(detail);

    // set current pantry_id
    setPantryId(id ? id : pantry_id);

    // get all pantries to load panty names to switching pantry profiles
    const all_pantries = await PantryService.getPantries();
    // setPantries(all_pantries.result);
    setPantries([...Object.values(all_pantries.result)]);

    // console.log("DEBUG-01: ");
    // console.log(pantries);

    // console.log("DEBUG-02: ");
    // console.log(all_pantries);

    // set isLoaded to true
    setIsLoaded(true);
  };

  const PantryAdminViewTabs = () => {
    const [tab, setTab] = useState("dashboard");

    // show spinner while data is loading
    if (!isLoaded) {
      return (
        <Container id="my-wishlist-loading">
          <MySpinner />
        </Container>
      );
    }

    return (
      <Tabs
        variant="pills"
        activeKey={tab}
        onSelect={(t) => setTab(t)}
        className="mb-4 justify-content-center nav-justified"
      >
        <Tab eventKey="dashboard" title="Pantry Dashboard">
          <DashboardView
            pantries={pantries}
            pantryDetail={pantryDetail}
            fetchPantryDetail={() => fetchPantryDetail()}
            employeeOf={employeeOf}
            setPantryId={(id) => {
              console.log("RECEIVED ID: ", id);
              setPantryId(id);
              fetchPantryDetail(id);
            }}
          />
        </Tab>
        <Tab eventKey="inventory" title="Manage Inventory">
          <InventoryView
            pantryDetail={pantryDetail}
            fetchPantryDetail={fetchPantryDetail}
          />
        </Tab>
      </Tabs>
    );
  };

  return (
    <Container id="pantry-admin-tabs">
      <PantryAdminViewTabs />
    </Container>
  );
}

export default PantryAdminView;

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

  const default_pantry_id = parseInt(useParams().pantry_id); // set default pantry id on first load
  const employeeOf = props.owns; // list of pantries
  const [pantry_id, setPantry_id] = useState(default_pantry_id); // admin can switch between pantry

  /**
   * Fetch pantry detail on init
   *
   */
  useEffect(() => {
    fetchPantryDetail();
  }, []);

  /**
   * Fetch pantry detail
   *
   */
  const fetchPantryDetail = async (pantry_id = null) => {
    setIsLoaded(false);
    const detail = await PantryService.getDetail(
      pantry_id ? pantry_id : default_pantry_id
    );
    console.log(employeeOf);
    setPantryDetail(detail);
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
            pantryDetail={pantryDetail}
            fetchPantryDetail={fetchPantryDetail}
            employeeOf={employeeOf}
            setPantry_id={() => setPantry_id()}
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

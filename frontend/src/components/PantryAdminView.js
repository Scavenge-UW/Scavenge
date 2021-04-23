import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";

import PantryService from "../services/pantry.service";
import InventoryView from "./InventoryView";
import DashboardView from "./DashboardView";

/**
 * PantryAdminView that consists of PantryDashboardView and InventoryView
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 */

function PantryAdminView() {
  const [pantryDetail, setPantryDetail] = useState(null);

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
  const fetchPantryDetail = async () => {
    const detail = await PantryService.getDetail(1); // TODO: change pantry id based on user's affiliation
    setPantryDetail(detail);
  };

  const PantryAdminViewTabs = () => {
    const [tab, setTab] = useState("dashboard");

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
    <Container>
      <PantryAdminViewTabs />
    </Container>
  );
}

export default PantryAdminView;

import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';


import InventoryView from './InventoryView'
import DashboardView from './DashboardView'

/**
 * PantryAdminView that consists of PantryDashboardView and InventoryView
 * 
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 */

 function PantryAdminView() {
  const PantryAdminViewTabs = () => {
    const [tab, setTab] = useState('dashboard')

    return (
      <Tabs
        variant="pills"
        activeKey={tab}
        onSelect={(t) => setTab(t)}
        className="mb-4 justify-content-center nav-justified"
      >
        <Tab eventKey="dashboard" title="Pantry Dashboard">
          <DashboardView />
        </Tab>
        <Tab eventKey="inventory" title="Manage Inventory">
          <InventoryView />
        </Tab>
      </Tabs>
    )
  }

  return (
    <Container>
        <PantryAdminViewTabs />
    </Container>
  );
}



export default PantryAdminView;
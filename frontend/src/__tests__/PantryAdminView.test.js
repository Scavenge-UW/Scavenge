import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, mount } from "enzyme";

import PantryAdminView from "../components/components_admin/PantryAdminView";
import "../setupTests";
import pantryDetail from "../__mocks__/pantryDetailMock";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => jest.fn().mockReturnValue({ pantry_id: 1 }),
}));

describe("PantryAdminView tests", () => {
  const wrapper1 = shallow(<PantryAdminView />);

  it("should have <PantryAdminViewTabs />", () => {
    expect(wrapper1.find("PantryAdminViewTabs")).toHaveLength(1);
  });

  // const wrapper2 = mount(<PantryAdminView />);
  // it("should display two tabs", () => {
  //   expect(wrapper2.find("Tab")).toHaveLength(2);
  // });
});

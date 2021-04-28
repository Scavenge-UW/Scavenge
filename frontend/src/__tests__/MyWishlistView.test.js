import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import MyWishlistView from "../components/components_user/MyWishlistView";

import "../setupTests";
import pantryDetail from "../__mocks__/pantryDetailMock";

const mockPantryDetail = pantryDetail.pantryDetail;
const mockUsername = "ilkyu";

describe("MyWishlistView tests", () => {
  // empty cart
  const wrapper1 = mount(
    <MemoryRouter>
      <MyWishlistView username={mockUsername} />
    </MemoryRouter>
  );

  it("should load a spinner on init", () => {
    expect(wrapper1.find("MySpinner")).toHaveLength(1);
  });
});

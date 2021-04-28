import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import SearchResultPantryCard from "../components/components_shared/SearchResultPantryCard";
import "../setupTests";
import pantryDetail from "../__mocks__/pantryDetailMock";

const mockPantryDetail = pantryDetail.pantryDetail;

describe("SearchResultPantryCard tests", () => {
  // empty cart
  const wrapper1 = mount(
    <MemoryRouter>
      <MyWishlistView pantry={mockPantryDetail} />
    </MemoryRouter>
  );

  it("should load a Card", () => {
    // There should be one button in LoginView
    expect(wrapper1.find("Card")).toHaveLength(1);
  });
});

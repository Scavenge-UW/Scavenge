import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import SearchResultPantryCard from "../components/components_shared/SearchResultPantryCard";
import "../setupTests";
import pantryDetail from "../__mocks__/pantryDetailMock";

const mockPantryDetail = pantryDetail.pantryDetail;

describe("HelpView tests", () => {
  // empty cart
  const wrapper1 = mount(
    <MemoryRouter>
      <SearchResultPantryCard pantry={mockPantryDetail} />
    </MemoryRouter>
  );

  it("should have one button when cart is empty", () => {
    // There should be one button in LoginView
    expect(wrapper1.find("Card")).toHaveLength(1);
  });
});

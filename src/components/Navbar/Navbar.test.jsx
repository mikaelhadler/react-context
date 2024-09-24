import { render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";
import { BrowserRouter } from "react-router-dom";

describe("Navbar", () => {
  it("should render correct the navbar with links", () => {
    const { getAllByRole } = render(<Navbar />, { wrapper: BrowserRouter });
    getAllByRole("link").forEach((link) => {
      expect(link).toHaveAttribute("href");
    });
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText(/users/i)).toBeInTheDocument();
  });
});

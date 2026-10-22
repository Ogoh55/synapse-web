import "@testing-library/jest-dom/vitest";
import { afterEach, describe, it, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminTab, { isSafeHttpUrl, SafeUrlLink } from "./AdminTab";

afterEach(cleanup);

describe("isSafeHttpUrl", () => {
  it.each(["http://example.com", "https://example.com/path?q=1", "  https://example.com  "])(
    "accepts %s",
    (value) => {
      expect(isSafeHttpUrl(value)).toBe(true);
    }
  );

  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "ftp://example.com",
    "not a url",
    "",
    "   ",
  ])("rejects %j", (value) => {
    expect(isSafeHttpUrl(value)).toBe(false);
  });

  it.each([undefined, null, 42, {}, []])("rejects non-string %j", (value) => {
    expect(isSafeHttpUrl(value)).toBe(false);
  });
});

describe("SafeUrlLink", () => {
  it("renders a safe URL as a hardened external link", () => {
    render(<SafeUrlLink url="https://example.com" className="x" />);
    const link = screen.getByRole("link", { name: "https://example.com" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer nofollow");
    expect(link).toHaveClass("x");
  });

  it("renders an unsafe URL as inert text", () => {
    render(<SafeUrlLink url="javascript:alert(1)" />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("javascript:alert(1)")).toBeInTheDocument();
  });

  it("renders an empty span for non-string input", () => {
    const { container } = render(<SafeUrlLink url={undefined} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(container.querySelector("span")).toBeEmptyDOMElement();
  });
});

describe("AdminTab", () => {
  it("renders the callback link and label preview", () => {
    render(<AdminTab callbackUrl="https://example.com/cb" addressLabel="Main" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.com/cb");
    expect(screen.getByRole("textbox")).toHaveValue("Main");
  });

  it("updates the preview as the label is typed, escaping markup", async () => {
    const user = userEvent.setup();
    const { container } = render(<AdminTab />);
    await user.type(screen.getByRole("textbox"), "<b>hi</b>");
    const preview = container.querySelector(".admin-tab__address-label-preview")!;
    expect(preview.textContent).toBe("<b>hi</b>");
    expect(preview.querySelector("b")).toBeNull();
  });
});

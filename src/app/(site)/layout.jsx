import FooterComponent from "../../components/FooterComponent";
import NavbarComponent from "../../components/NavbarComponent";

export default function SiteLayout({ children }) {
  return (
    <>
      <NavbarComponent />
      <main className="flex-1">{children}</main>
      <FooterComponent />
    </>
  );
}

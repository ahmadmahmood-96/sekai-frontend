// CarLayout.tsx
import { Outlet } from "react-router-dom";
import { HorizontalMenu, MenuList } from "../horizontalMenu";

const CarLayout = () => {
  const routes: MenuList[] = [
    {
      keyName: "car-sales",
      pathName: "Add Invoice",
      path: "/home/companies/car-sales",
    },
    {
      keyName: "view-invoices",
      pathName: "View Invoices",
      path: "/home/companies/view-invoices",
    },
  ];

  return (
    <>
      <HorizontalMenu routes={routes} />
      <div className="car-layout-content">
        <Outlet />
      </div>
    </>
  );
};

export default CarLayout;

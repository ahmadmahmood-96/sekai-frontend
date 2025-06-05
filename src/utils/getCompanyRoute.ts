/**
 * Maps company names to their respective route paths.
 */
export const getCompanyRoute = (companyName: string): string => {
  const companyRoutes: Record<string, string> = {
    "Sekai Cars Sales Ltd.": "/home/companies/car-sales",
    "Sekai Farm Produce": "/home/companies/farm-produce",
    "My Kenya Food Station": "/home/companies/food-station",
  };

  return companyRoutes[companyName] || "/";
};

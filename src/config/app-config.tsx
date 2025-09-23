import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "ROOMIQ",
  version: packageJson.version,
  copyright: `© ${currentYear}, RoomIQ.`,
  meta: {
    title: "ROOMIQ - Admin Dashboard Template",
    description:
      "ROOMIQ - Admin Dashboard Template.",
  },
};

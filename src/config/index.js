export const config = {
  host_dev: import.meta.env.VITE_API_HOST_DEV,
  port_dev: import.meta.env.VITE_API_PORT_DEV,

  host_lab: import.meta.env.VITE_API_HOST_LAB,
  port_lab: import.meta.env.VITE_API_PORT_LAB,

  host_uat: import.meta.env.VITE_API_HOST_UAT,
  port_uat: import.meta.env.VITE_API_PORT_UAT,

  host_demo: import.meta.env.VITE_API_HOST_DEMO,
  port_demo: import.meta.env.VITE_API_PORT_DEMO,

  mode: import.meta.env.MODE,
};

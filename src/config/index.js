export const config = {
  host_dev: import.meta.env.VITE_API_HOST_DEV,
  port_dev: import.meta.env.VITE_API_PORT_DEV,

  host_lab: import.meta.env.VITE_API_HOST_LAB,
  port_lab: import.meta.env.VITE_API_PORT_LAB,

  host_uat: import.meta.env.VITE_API_HOST_UAT,
  port_uat: import.meta.env.VITE_API_PORT_UAT,

  mode: import.meta.env.MODE,
};

import FormChart from "../components/organism/FormChart";
import FormPrice from "../components/organism/FormPrice";
import FormToken from "../components/organism/FormToken";
import { config } from "../config";

function GenerateLog() {
  let apiURL = `${config.host}:${config.port}`;
  if (config.mode === "uat") {
    apiURL = `${config.host}`;
  }

  return (
    <>
      <FormToken apiURL={apiURL} mode={config.mode} />
      <FormPrice />
      <FormChart />
    </>
  );
}

export default GenerateLog;

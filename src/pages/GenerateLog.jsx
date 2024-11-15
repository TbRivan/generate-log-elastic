import FormChart from "../components/organism/FormChart";
import FormPrice from "../components/organism/FormPrice";
import FormToken from "../components/organism/FormToken";

function GenerateLog() {
  return (
    <>
      <FormToken />
      <FormPrice />
      <FormChart />
    </>
  );
}

export default GenerateLog;

import { config } from "../../config";
import { useTokenStore } from "../../store/tokenStore";
import TextAreaInput from "../atom/TextAreaInput";

function FormToken() {
  const token = useTokenStore((state) => state.token);
  const setToken = useTokenStore((state) => state.setToken);
  const apiURL = `${config.host}:${config.port}`;

  return (
    <div className="form" style={{ marginBottom: 50 }}>
      <h3>{`Running on ${config.mode} mode`}</h3>
      <h3>{`${apiURL}`}</h3>
      <div className="input-container ic1">
        <TextAreaInput
          value={token}
          onChange={setToken}
          placeholder={"Input Token"}
        />
      </div>
    </div>
  );
}

export default FormToken;

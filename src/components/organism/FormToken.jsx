import { useEffect, useState } from "react";
import { useTokenStore } from "../../store/tokenStore";
import ButtonSubmit from "../atom/ButtonSubmit";
import TextAreaInput from "../atom/TextAreaInput";
import Cookies from "js-cookie";
import { useModalStore } from "../../store/modalStore";
import Modal from "../atom/Modal";
import { useEnvironmentStore } from "../../store/envStore";
import Select from "../atom/Select";

export const ENVS = [
  { value: "DEV", label: "Development" },
  { value: "LAB", label: "LAB" },
  { value: "UAT", label: "UAT" },
];

function FormToken() {
  const [temporaryValue, setTemporaryValue] = useState("");
  const { token, setToken, checkTokenFromCookie } = useTokenStore();
  const { isModalOpen, setModalOpen, setModalClose } = useModalStore();
  const { environmentMode, mode, apiURL, setEnvironmentMode } =
    useEnvironmentStore();

  useEffect(() => {
    checkTokenFromCookie();
  }, [checkTokenFromCookie]);

  const handleToken = () => {
    if (token) {
      Cookies.set("token", token, { expires: 1 });
      Cookies.set("environment", environmentMode, { expires: 1 });
    }
  };

  const handleEnvMode = () => {
    setEnvironmentMode(temporaryValue);
    setToken("");
    Cookies.remove("token");
    Cookies.remove("environment");
    handleModalClose();
  };

  const handleModalOpen = (e) => {
    setModalOpen();
    setTemporaryValue(e.target.value);
  };

  const handleModalClose = () => {
    setTemporaryValue("");
    setModalClose();
  };

  return (
    <div className="form" style={{ marginBottom: 50 }}>
      {environmentMode ? (
        <>
          <h3>{`Running on ${mode} mode`}</h3>
          <h3>{`${apiURL}`}</h3>
        </>
      ) : (
        <h3>{`Please Select Environment Mode`}</h3>
      )}
      <Select
        key={"coba"}
        value={environmentMode}
        onChange={handleModalOpen}
        values={ENVS}
        label={"Select environment"}
      />
      <div className="input-container ic1">
        {environmentMode && (
          <TextAreaInput
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={"Input Token"}
          />
        )}
      </div>
      <ButtonSubmit
        onClick={handleToken}
        style={{ marginTop: 20 }}
        disabled={token === "" || environmentMode === "" ? true : false}
      >
        Set Token
      </ButtonSubmit>
      {isModalOpen && (
        <Modal onClose={handleModalClose}>
          <h3 style={{ marginTop: -5 }}>Change mode</h3>
          <p>Are you sure want to change mode to {temporaryValue}?</p>
          <ButtonSubmit onClick={handleEnvMode} disabled={false}>
            Confirm
          </ButtonSubmit>
        </Modal>
      )}
    </div>
  );
}

export default FormToken;
